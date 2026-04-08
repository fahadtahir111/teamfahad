import { prisma } from "./prisma";

export type ActivityType = "ORDER_PLACED" | "LOGIN" | "SETTINGS_UPDATE" | "PRODUCT_ADD" | "PRODUCT_UPDATE" | "INVENTORY_LOW";

export async function logActivity(type: ActivityType, message: string, metadata?: any, userId?: string) {
    try {
        // Using raw query as a fallback while Prisma Client regeneration is blocked by file locks
        const meta = metadata ? JSON.stringify(metadata) : null;

        const activity = await prisma.activity.create({
            data: {
                id: undefined as any,
                type,
                message,
                metadata: meta,
                userId: userId || null
            }
        });
        return { id: activity.id, type, message };
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
