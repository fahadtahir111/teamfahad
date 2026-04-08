import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");

        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            orderBy: {
                createdAt: "desc",
            },
        });

        // Always return an array, never an object
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, image, color, categoryId, inventory } = body;

        if (!name || !price || !categoryId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate SKU if not provided (to avoid unique constraint on null)
        const sku = body.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image: image || "",
                color: color || "",
                categoryId,
                inventory: parseInt(inventory) || 0,
                sku,
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create product:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return NextResponse.json(
            {
                error: "Failed to create product",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
