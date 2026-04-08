import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { code, type, value, minPurchase, maxDiscount, usageLimit, isActive, validFrom, validUntil } = body;

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: code?.toUpperCase(),
                type,
                value,
                minPurchase,
                maxDiscount,
                usageLimit,
                isActive,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validUntil: validUntil ? new Date(validUntil) : undefined,
            },
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Failed to update coupon:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.coupon.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Failed to delete coupon:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
