import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if ((session?.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ id, status });
    } catch (error) {
        console.error("Failed to update order status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
