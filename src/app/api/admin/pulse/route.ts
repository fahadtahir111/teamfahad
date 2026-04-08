import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    let isClosed = false;

    const sendPulse = async () => {
        if (isClosed) return;
        try {
            // Check if Prisma is connected before querying
            await prisma.$connect();

            // Use raw query because the generated client might be lagging due to file locks on Windows
            const activities = await prisma.activity.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10
            });

            // Result from findMany already has nested user object
            const formattedActivities = activities;

            const data = JSON.stringify(formattedActivities);

            // Check if stream is still open before writing
            if (!isClosed) {
                try {
                    await writer.write(encoder.encode(`data: ${data}\n\n`));
                } catch (writeError: any) {
                    // Stream was closed, stop sending pulses
                    if (writeError.code === 'ERR_INVALID_STATE' || writeError.message?.includes('closed')) {
                        isClosed = true;
                    } else {
                        throw writeError;
                    }
                }
            }
        } catch (error: any) {
            // Only log connection errors once, not repeatedly
            if (error.code === 'P2010' || error.message?.includes('Server selection timeout')) {
                console.error("Database connection issue - pulse disabled temporarily");
                isClosed = true;
            } else if (error.code !== 'ERR_INVALID_STATE') {
                // Don't log closed stream errors
                console.error("Pulse error:", error);
            }
        }
    };

    // Send initial pulse
    sendPulse();

    // Poll for new activities every 5 seconds (simulated real-time)
    let interval: NodeJS.Timeout | null = setInterval(sendPulse, 5000);

    req.signal.addEventListener("abort", () => {
        isClosed = true;
        if (interval) clearInterval(interval);
        writer.close();
    });

    return new Response(responseStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
