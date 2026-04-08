import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Try to get session, but don't fail if it's not available
        let session;
        try {
            session = await getServerSession();
        } catch (sessionError) {
            console.error("Session error:", sessionError);
        }

        // If session check passed but user is not admin, return error
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const data = await request.json();

        // Helper function to convert frontend type to Prisma enum
        const convertCouponType = (type: string): "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" | undefined => {
            if (!type) return undefined;
            const typeUpper = type.toUpperCase();
            if (typeUpper === "PERCENTAGE" || typeUpper === "FIXED" || typeUpper === "FREE_SHIPPING") {
                return typeUpper as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
            }
            return undefined;
        };

        // Update coupon in database
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: data.code?.toUpperCase(),
                type: data.type ? convertCouponType(data.type) : undefined,
                value: data.value !== undefined ? data.value : undefined,
                minPurchase: data.minPurchase !== undefined ? data.minPurchase : undefined,
                maxDiscount: data.maxDiscount !== undefined ? data.maxDiscount : undefined,
                usageLimit: data.usageLimit !== undefined ? data.usageLimit : undefined,
                isActive: data.isActive !== undefined ? data.isActive : undefined,
                validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
                validUntil: data.validUntil ? new Date(data.validUntil) : undefined
            }
        });

        let type: "percentage" | "fixed" | "free_shipping" = "percentage";
        if (coupon.type === "PERCENTAGE") type = "percentage";
        else if (coupon.type === "FIXED") type = "fixed";
        else if (coupon.type === "FREE_SHIPPING") type = "free_shipping";

        return NextResponse.json({
            id: coupon.id,
            code: coupon.code,
            type,
            value: Number(coupon.value),
            minPurchase: coupon.minPurchase ? Number(coupon.minPurchase) : undefined,
            maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
            usageLimit: coupon.usageLimit || undefined,
            usedCount: coupon.usedCount,
            validFrom: coupon.validFrom.toISOString(),
            validUntil: coupon.validUntil.toISOString(),
            isActive: coupon.isActive
        });
    } catch (error) {
        console.error("Error updating coupon:", error);
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Try to get session, but don't fail if it's not available
        let session;
        try {
            session = await getServerSession();
        } catch (sessionError) {
            console.error("Session error:", sessionError);
        }

        // If session check passed but user is not admin, return error
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Delete coupon from database
        await prisma.coupon.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}

