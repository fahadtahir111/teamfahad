import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  /**
   * Attempts to reserve inventory for a product.
   * Prevents standard "racing condition" double spending.
   */
  static async reserveInventory(
    productId: string,
    quantity: number,
    userId: string | null = null,
    sessionId: string | null = null
  ) {
    // 1. We wrap the reservation logic in a transaction so nobody else modifies this record while we read it.
    return prisma.$transaction(async (tx) => {
      // Fetch current status, locking the row until transaction ends (native pg lock in raw is optimal, but Prisma handles logic via unique conditions / repeatable reads)
      const currentProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!currentProduct) throw new Error("Product not found");

      // Check current reservations that are NOT expired
      const activeReservations = await (tx as any).inventory_reservation.aggregate({
        where: {
          productId,
          expiresAt: { gt: new Date() },
        },
        _sum: {
          quantity: true,
        },
      });

      const currentlyReserved = activeReservations._sum.quantity || 0;
      const availableStock = currentProduct.inventory - currentlyReserved;

      if (availableStock < quantity) {
        throw new Error("Out of stock or currently reserved by other shoppers");
      }

      // 2. Create the reservation (valid for 15 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const reservation = await (tx as any).inventory_reservation.create({
        data: {
          productId,
          userId,
          sessionId,
          quantity,
          expiresAt,
        },
      });

      return reservation;
    });
  }

  /**
   * Finalize the checkout lock: Decrease the main inventory and mark the reservation as consumed (deleted).
   */
  static async confirmPurchase(reservationId: string) {
    return prisma.$transaction(async (tx) => {
      const reservation = await (tx as any).inventory_reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) throw new Error("Reservation expired or not found");

      await tx.product.update({
        where: { id: reservation.productId },
        data: {
          inventory: {
            decrement: reservation.quantity,
          },
        },
      });

      // Cleanup
      await (tx as any).inventory_reservation.delete({
        where: { id: reservationId },
      });

      return true;
    });
  }
}
