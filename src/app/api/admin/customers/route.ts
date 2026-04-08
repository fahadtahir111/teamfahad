import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // If session check passed but user is not admin, return empty array (middleware handles blocking)
        if (session && (session.user as any)?.role !== "ADMIN") {
            return NextResponse.json([]);
        }

        const orders = await prisma.order.findMany({
            include: {
                orderitem: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Group by customer email
        const customerMap = new Map<string, {
            id: string;
            email: string;
            name: string;
            totalOrders: number;
            totalSpent: number;
            lastOrderDate: string;
        }>();

        orders.forEach((order) => {
            const email = order.customerEmail || "unknown";
            if (!customerMap.has(email)) {
                customerMap.set(email, {
                    id: email,
                    email,
                    name: order.customerName || "Guest",
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: order.createdAt.toISOString(),
                });
            }

            const customer = customerMap.get(email)!;
            customer.totalOrders += 1;
            customer.totalSpent += Number(order.totalAmount) || 0;
            if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                customer.lastOrderDate = order.createdAt.toISOString();
            }
        });

        const customers = Array.from(customerMap.values());

        // Always return an array, never an object
        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        // Always return an array, never an object
        return NextResponse.json([]);
    }
}

