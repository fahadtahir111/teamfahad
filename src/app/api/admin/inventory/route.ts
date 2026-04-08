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

        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        const inventory = products.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            currentStock: product.inventory || 0,
            lowStockThreshold: 10, // Default threshold
            price: Number(product.price) || 0,
            category: product.category?.name || "Uncategorized",
        }));

        // Always return an array, never an object
        return NextResponse.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { id, currentStock } = body;

        if (!id || currentStock === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                inventory: Number(currentStock)
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
    }
}

