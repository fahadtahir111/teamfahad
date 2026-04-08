import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Try to get session, but don't fail if it's not available
        let session;
        try {
            session = await getServerSession();
        } catch (sessionError) {
            console.error("Session error:", sessionError);
            // Continue without session check - middleware handles auth
        }

        // If session check passed but user is not admin, return empty array (middleware handles blocking)
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json([]);
        }

        const settings = await prisma.setting.findMany({
            orderBy: { category: "asc" },
        });

        // Always return an array, never an object
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { key, value, category } = await request.json();
        const now = new Date();

        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value, updatedAt: now },
            create: { 
                id: `${key}_${Date.now()}`,
                key, 
                value, 
                category: category || "general",
                updatedAt: now
            },
        });

        return NextResponse.json(setting);
    } catch (error) {
        console.error("Error saving setting:", error);
        return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
    }
}

