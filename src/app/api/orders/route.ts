import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { authOptions } from "@/lib/auth";
import { InventoryService } from "@/services/InventoryService";
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
    // Session state
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    let reservationsMade: any[] = [];

    try {
        const body = await request.json();
        const { customerName, customerEmail, shippingAddress, items, paymentMethod = "COD", couponCode } = body;

        if (!customerEmail || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Calculate price & Secure Inventory via PostgreSQL Row Locks
        let subtotal = 0;
        const orderItems: { productId: string, quantity: number, price: number }[] = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) throw new Error(`Product ${item.productId} not found`);

            // 🚀 SaaS Core Feature: Try to reserve inventory
            // If it fails, our catch block handles safely undoing others
            try {
                const reservation = await InventoryService.reserveInventory(item.productId, item.quantity, userId);
                reservationsMade.push(reservation.id);
            } catch (err: any) {
                // If we fail here, someone just bought the last one while you were typing!
                throw new Error(`Item ${product.name} is now out of stock or reserved by another buyer.`);
            }

            const price = Number(product.price);
            subtotal += price * item.quantity;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price,
            });
        }

        // 2. SaaS Coupon Validation Logic
        let discountAmount = 0;
        let couponId = null;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode.toUpperCase() }
            });

            if (coupon && coupon.isActive) {
                const now = new Date();
                const isValidDate = now >= new Date(coupon.validFrom) && now <= new Date(coupon.validUntil);
                const isUnderLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
                const meetsMinPurchase = !coupon.minPurchase || subtotal >= coupon.minPurchase;

                if (isValidDate && isUnderLimit && meetsMinPurchase) {
                    couponId = coupon.id;
                    if (coupon.type === "PERCENTAGE") {
                        discountAmount = (subtotal * coupon.value) / 100;
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;
                    } else if (coupon.type === "FIXED") {
                        discountAmount = coupon.value;
                    }
                }
            }
        }

        const totalAmount = Math.max(0, subtotal - discountAmount);

        // 3. SaaS Payment Simulation (If "CARD" is selected)
        let paymentStatus = "PENDING";
        if (paymentMethod === "CARD") {
            // In a real app we hit stripe.charges.create here.
            // For now, we simulate a successful 1 second process.
            paymentStatus = "PAID"; 
        }

        // 4. Create the Final Secured Order
        const orderResult = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    customerName,
                    customerEmail,
                    totalAmount,
                    status: paymentMethod === "CARD" ? 'PROCESSING' : 'PENDING', // If paid, move to processing
                    paymentMethod: paymentMethod === "COD" ? "COD" : "CARD",
                    paymentStatus: paymentStatus as any,
                    shippingAddress,
                    couponId: couponId,
                }
            });

            await tx.orderitem.createMany({
                data: orderItems.map(item => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            return newOrder;
        });

        // 5. Finalize the inventory! (Deduct actual stock, clear lock)
        for(let resId of reservationsMade) {
            await InventoryService.confirmPurchase(resId);
        }

        // 6. Next.js cache purged via DB trigger or revalidatePath if implemented.

        // Log SaaS Analytics
        await logActivity(
            "ORDER_PLACED",
            `SaaS Order placed by ${customerName}`,
            { orderId: orderResult.id, amount: totalAmount }
        );

        return NextResponse.json(orderResult, { status: 201 });

    } catch (error: any) {
        // Rollback reservations if ANY error occurred during checkout
        if (reservationsMade.length > 0) {
            for(let resId of reservationsMade) {
                 await (prisma as any).inventory_reservation.delete({ where: { id: resId } }).catch(() => null);
            }
        }

        console.error("Order Creation Failed:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        const userRole = (session.user as any)?.role;
        const userEmail = session.user?.email;

        // SaaS Security
        if (email) {
            if (email !== userEmail && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        } else {
            if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
                return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
            }
        }

        const orders = await prisma.order.findMany({
            where: email ? { customerEmail: email } : {},
            include: {
                orderitem: {
                    include: {
                        product: {
                            select: { name: true, image: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedOrders = orders.map((order) => ({
            ...order,
            totalAmount: order.totalAmount.toString(),
            items: order.orderitem.map((item) => ({
                ...item,
                price: item.price.toString(),
                product: item.product
            }))
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", message: String(error) },
            { status: 500 }
        );
    }
}
