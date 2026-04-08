import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // If session check passed but user is not admin, return empty array (middleware handles blocking)
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json([]);
        }

        // Fetch coupons from database
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform to match frontend interface
        const formattedCoupons = coupons.map(coupon => {
            let type: "percentage" | "fixed" | "free_shipping" = "percentage";
            if (coupon.type === "PERCENTAGE") type = "percentage";
            else if (coupon.type === "FIXED") type = "fixed";
            else if (coupon.type === "FREE_SHIPPING") type = "free_shipping";

            return {
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
            };
        });

        // Always return an array, never an object
        return NextResponse.json(formattedCoupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // If session check passed but user is not admin, return error
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const data = await request.json();

        // Helper function to convert frontend type to Prisma enum
        const convertCouponType = (type: string): "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" => {
            const typeUpper = type.toUpperCase();
            if (typeUpper === "PERCENTAGE" || typeUpper === "FIXED" || typeUpper === "FREE_SHIPPING") {
                return typeUpper as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
            }
            return "PERCENTAGE"; // default fallback
        };

        // Create coupon in database
        const coupon = await prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                type: convertCouponType(data.type),
                value: data.value,
                minPurchase: data.minPurchase || null,
                maxDiscount: data.maxDiscount || null,
                usageLimit: data.usageLimit || null,
                usedCount: 0,
                isActive: data.isActive ?? true,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil),
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
        console.error("Error creating coupon:", error);
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // If session check passed but user is not admin, return error
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
        }

        // Update coupon in database
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: updateData.code?.toUpperCase(),
                type: updateData.type === "percentage" ? "PERCENTAGE" : updateData.type === "fixed" ? "FIXED" : updateData.type === "free_shipping" ? "FREE_SHIPPING" : undefined,
                value: updateData.value !== undefined ? updateData.value : undefined,
                minPurchase: updateData.minPurchase !== undefined ? updateData.minPurchase : undefined,
                maxDiscount: updateData.maxDiscount !== undefined ? updateData.maxDiscount : undefined,
                usageLimit: updateData.usageLimit !== undefined ? updateData.usageLimit : undefined,
                isActive: updateData.isActive !== undefined ? updateData.isActive : undefined,
                validFrom: updateData.validFrom ? new Date(updateData.validFrom) : undefined,
                validUntil: updateData.validUntil ? new Date(updateData.validUntil) : undefined
            }
        });

        return NextResponse.json({
            id: coupon.id,
            code: coupon.code,
            type: coupon.type.toLowerCase().replace('_', '') as "percentage" | "fixed",
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

