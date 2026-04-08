import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, cartTotal } = body;

        if (!code) {
            return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: "Coupon is no longer active" }, { status: 400 });
        }

        const now = new Date();
        if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
            return NextResponse.json({ error: "Coupon has expired or is not yet valid" }, { status: 400 });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
        }

        if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
            return NextResponse.json({
                error: `Minimum purchase amount of ${coupon.minPurchase} required for this coupon`
            }, { status: 400 });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (coupon.type === "PERCENTAGE") {
            discountAmount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else if (coupon.type === "FIXED") {
            discountAmount = coupon.value;
        } else if (coupon.type === "FREE_SHIPPING") {
            // Handled on frontend or during order calculation
            discountAmount = 0;
        }

        return NextResponse.json({
            valid: true,
            couponId: coupon.id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discountAmount,
            message: "Coupon applied successfully"
        });

    } catch (error) {
        console.error("Failed to validate coupon:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
