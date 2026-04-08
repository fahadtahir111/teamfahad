import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error("Failed to fetch coupons:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { code, type, value, minPurchase, maxDiscount, usageLimit, isActive, validFrom, validUntil } = body;

        if (!code || !type || value === undefined || !validFrom || !validUntil) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert type to uppercase enum format
        const couponType = type.toUpperCase() as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type: couponType,
                value,
                minPurchase: minPurchase || null,
                maxDiscount: maxDiscount || null,
                usageLimit: usageLimit || null,
                isActive: isActive ?? true,
                validFrom: new Date(validFrom),
                validUntil: new Date(validUntil),
            },
        });

        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        console.error("Failed to create coupon:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: String(error) },
            { status: 500 }
        );
    }
}
