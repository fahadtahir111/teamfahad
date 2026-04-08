import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await prisma.setting.findMany({
            where: {
                category: "theme",
            },
        });

        const theme: Record<string, string> = {};
        settings.forEach((s) => {
            const key = s.key.replace("theme_", "");
            theme[key] = s.value;
        });

        return NextResponse.json({
            primaryColor: theme.primaryColor || "#FF4500",
            secondaryColor: theme.secondaryColor || "#FFFDD0",
            backgroundColor: theme.backgroundColor || "#0a0a0a",
            textColor: theme.textColor || "#ffffff",
            fontFamily: theme.fontFamily || "Inter",
            logo: theme.logo || "",
            favicon: theme.favicon || "",
        });
    } catch (error) {
        console.error("Error fetching theme:", error);
        return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const theme = await request.json();

        const now = new Date();
        await Promise.all([
            prisma.setting.upsert({
                where: { key: "theme_primaryColor" },
                update: { value: theme.primaryColor, updatedAt: now },
                create: { 
                    id: `theme_primaryColor_${Date.now()}`,
                    key: "theme_primaryColor", 
                    value: theme.primaryColor, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_secondaryColor" },
                update: { value: theme.secondaryColor, updatedAt: now },
                create: { 
                    id: `theme_secondaryColor_${Date.now()}`,
                    key: "theme_secondaryColor", 
                    value: theme.secondaryColor, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_backgroundColor" },
                update: { value: theme.backgroundColor, updatedAt: now },
                create: { 
                    id: `theme_backgroundColor_${Date.now()}`,
                    key: "theme_backgroundColor", 
                    value: theme.backgroundColor, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_textColor" },
                update: { value: theme.textColor, updatedAt: now },
                create: { 
                    id: `theme_textColor_${Date.now()}`,
                    key: "theme_textColor", 
                    value: theme.textColor, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_fontFamily" },
                update: { value: theme.fontFamily, updatedAt: now },
                create: { 
                    id: `theme_fontFamily_${Date.now()}`,
                    key: "theme_fontFamily", 
                    value: theme.fontFamily, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_logo" },
                update: { value: theme.logo, updatedAt: now },
                create: { 
                    id: `theme_logo_${Date.now()}`,
                    key: "theme_logo", 
                    value: theme.logo, 
                    category: "theme",
                    updatedAt: now
                },
            }),
            prisma.setting.upsert({
                where: { key: "theme_favicon" },
                update: { value: theme.favicon, updatedAt: now },
                create: { 
                    id: `theme_favicon_${Date.now()}`,
                    key: "theme_favicon", 
                    value: theme.favicon, 
                    category: "theme",
                    updatedAt: now
                },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving theme:", error);
        return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
    }
}

