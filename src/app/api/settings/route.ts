import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { getServerSession } from "next-auth/next";
// Import your auth options if they are in a separate file, or use the route one if it's exported
// Since we have it in [...nextauth]/route.ts but it's not exported as authOptions there, 
// I'll just check the database for the user role as a safety measure if needed, 
// but usually middleware handles the route protection.

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { settings } = body; // Array of { key, value }

        if (!Array.isArray(settings)) {
            // Check if it's a single setting update
            const { key, value, category } = body;
            if (key && value !== undefined) {
                const setting = await prisma.setting.upsert({
                    where: { key },
                    update: { value, category, updatedAt: new Date() },
                    create: {
                        id: Math.random().toString(36).substring(7),
                        key,
                        value,
                        category: category || "general",
                        updatedAt: new Date()
                    },
                });

                await logActivity("SETTINGS_UPDATE", `Setting ${key} updated`);

                return NextResponse.json(setting);
            }
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        // Batch update
        const updates = settings.map((s: any) =>
            prisma.setting.upsert({
                where: { key: s.key },
                update: { value: s.value, category: s.category, updatedAt: new Date() },
                create: {
                    id: Math.random().toString(36).substring(7),
                    key: s.key,
                    value: s.value,
                    category: s.category || "general",
                    updatedAt: new Date()
                },
            })
        );

        await Promise.all(updates);

        await logActivity("SETTINGS_UPDATE", "Batch settings update performed");

        return NextResponse.json({ message: "Settings updated successfully" });
    } catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
