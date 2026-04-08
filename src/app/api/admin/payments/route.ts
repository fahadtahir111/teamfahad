import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const gateways = await prisma.payment_gateway.findMany();

        // If no gateways, seed defaults
        if (gateways.length === 0) {
            const defaults: any[] = [
                { name: "Cash on Delivery", provider: "cod", isActive: true, credentials: "{}", settings: "{}" },
                { name: "Stripe", provider: "stripe", isActive: false, credentials: "{}", settings: "{}" },
                { name: "Bank Transfer", provider: "bank", isActive: false, credentials: "{}", settings: "{}" },
            ];

            const created = await Promise.all(
                defaults.map(d => prisma.payment_gateway.create({ data: d }))
            );

            return NextResponse.json(created.map(g => ({
                id: g.id,
                name: g.name,
                provider: g.provider,
                isEnabled: g.isActive,
                settings: JSON.parse(g.settings || "{}")
            })));
        }

        return NextResponse.json(gateways.map(g => ({
            id: g.id,
            name: g.name,
            provider: g.provider,
            isEnabled: g.isActive,
            settings: JSON.parse(g.settings || "{}")
        })));
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { methods } = await request.json();

        await Promise.all(
            methods.map((m: any) =>
                prisma.payment_gateway.update({
                    where: { id: m.id },
                    data: {
                        isActive: m.isEnabled,
                        settings: JSON.stringify(m.settings)
                    }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating payment methods:", error);
        return NextResponse.json({ error: "Failed to update payment methods" }, { status: 500 });
    }
}

