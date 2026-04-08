import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
        return NextResponse.json({ cart: [] }); 
    }

    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart) return NextResponse.json({ cart: [] });

        const formattedCart = cart.items.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            color: item.product.color || "",
            quantity: item.quantity
        }));

        return NextResponse.json({ cart: formattedCart });
    } catch (e: any) {
        console.error("Cart GET error:", e);
        return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
        return NextResponse.json({ error: "Must be logged in to sync cart" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { cartItems } = body; // expecting array of cart items from frontend

        // Overwrite cart logic for SaaS Cart sync
        let dbCart = await prisma.cart.findFirst({ where: { userId } });

        if (!dbCart) {
            dbCart = await prisma.cart.create({ data: { userId } });
        }

        // Delete old items
        await prisma.cart_item.deleteMany({ where: { cartId: dbCart.id } });

        // Add new items
        const newItems = cartItems.map((item: any) => ({
            cartId: dbCart!.id,
            productId: item.id,
            quantity: item.quantity
        }));

        if (newItems.length > 0) {
            await prisma.cart_item.createMany({ data: newItems });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
         console.error("Cart SYNC error:", e);
         return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
    }
}
