import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { name } = body;

        const category = await prisma.category.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // Check for associated products
        const productCount = await prisma.product.count({
            where: { categoryId: id }
        });

        console.log(`[DELETE CATEGORY] ID: ${id}, Product Count: ${productCount}`);

        if (productCount > 0) {
            console.log(`[DELETE CATEGORY] Blocked deletion due to ${productCount} existing products.`);
            return NextResponse.json(
                { error: "Cannot delete category with existing products. Please reassign or delete the products first." },
                { status: 400 }
            );
        }

        // Double check with findFirst just in case count is misleading (unlikely but good for debug)
        const existingProduct = await prisma.product.findFirst({
            where: { categoryId: id }
        });

        if (existingProduct) {
            console.log(`[DELETE CATEGORY] Count was 0 but findFirst found product: ${existingProduct.id}`);
            return NextResponse.json(
                { error: "Cannot delete category with existing products." },
                { status: 400 }
            );
        }

        console.log(`[DELETE CATEGORY] Proceeding with deletion of ${id}`);
        await prisma.category.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Delete category error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: String(error) },
            { status: 500 }
        );
    }
}
