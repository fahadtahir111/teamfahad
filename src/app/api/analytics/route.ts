import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Enterprise SaaS Analytics Endpoint
 * Native, non-intrusive telemetry pipeline for tracking user behavior,
 * converting this to an actual scalable analytics platform.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventType, metadata, sessionId } = body;

        if (!eventType) {
            return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id || null;

        await prisma.analytics_event.create({
            data: {
                eventType,
                userId,
                sessionId: sessionId || "anonymous",
                metadata: metadata ? JSON.stringify(metadata) : null,
            }
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e) {
        console.error("Analytics Error:", e);
        // We never return a 500 for analytics failure to prevent blocking the client UI
        return NextResponse.json({ ok: false }, { status: 200 }); 
    }
}
