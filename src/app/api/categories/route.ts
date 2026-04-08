import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { product: true }
                }
            },
            orderBy: {
                name: "asc",
            },
        });

        // Always return an array, never an object
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
