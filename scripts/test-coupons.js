const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Testing Coupon Logic ---');

    // 1. Create a test category and product if they don't exist
    let category = await prisma.category.findFirst({ where: { name: 'Test Category' } });
    if (!category) {
        category = await prisma.category.create({
            data: { name: 'Test Category' }
        });
    }

    let product = await prisma.product.findFirst({ where: { name: 'Test Product' } });
    if (!product) {
        product = await prisma.product.create({
            data: {
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                image: 'test.jpg',
                categoryId: category.id,
                inventory: 10
            }
        });
    }

    // 2. Create a test coupon
    const couponCode = 'SAVE20-' + Math.random().toString(36).substring(7).toUpperCase();
    const coupon = await prisma.coupon.create({
        data: {
            code: couponCode,
            type: 'PERCENTAGE',
            value: 20,
            minPurchase: 50,
            isActive: true,
            validFrom: new Date(Date.now() - 86400000), // yesterday
            validUntil: new Date(Date.now() + 86400000), // tomorrow
        }
    });
    console.log(`Created coupon: ${coupon.code}`);

    // 3. Simulate order creation logic (as in orders/route.ts)
    const cartItems = [{ productId: product.id, quantity: 2 }];
    let subtotal = 0;
    for (const item of cartItems) {
        const p = await prisma.product.findUnique({ where: { id: item.productId } });
        subtotal += p.price * item.quantity;
    }
    console.log(`Subtotal: ${subtotal}`);

    let discountAmount = 0;
    if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil && subtotal >= (coupon.minPurchase || 0)) {
            discountAmount = (subtotal * coupon.value) / 100;
        }
    }
    const totalAmount = subtotal - discountAmount;
    console.log(`Discount: ${discountAmount}, Final Total: ${totalAmount}`);

    if (totalAmount === 160) {
        console.log('✅ Coupon calculation correct!');
    } else {
        console.error('❌ Coupon calculation FAILED!');
    }

    // 4. Cleanup test data (optional, but keep it for now)
    // await prisma.coupon.delete({ where: { id: coupon.id } });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
