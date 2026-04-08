/**
 * Database Connection Verification Script
 * This script verifies that all database relationships are properly connected
 * Run with: node scripts/verify-db-connections.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyConnections() {
    console.log('🔍 Verifying Database Connections...\n');

    try {
        // 1. Test Category -> Product relationship
        console.log('1. Testing Category -> Product relationship...');
        const categories = await prisma.category.findMany({
            include: {
                product: {
                    take: 1
                }
            }
        });
        console.log(`   ✅ Found ${categories.length} categories`);
        categories.forEach(cat => {
            console.log(`   - ${cat.name}: ${cat.product.length} products`);
        });

        // 2. Test Product -> Category relationship
        console.log('\n2. Testing Product -> Category relationship...');
        const products = await prisma.product.findMany({
            include: {
                category: true
            },
            take: 5
        });
        console.log(`   ✅ Found ${products.length} products`);
        products.forEach(prod => {
            console.log(`   - ${prod.name}: Category: ${prod.category?.name || 'None'}`);
        });

        // 3. Test Order -> OrderItem -> Product relationship
        console.log('\n3. Testing Order -> OrderItem -> Product relationship...');
        const orders = await prisma.order.findMany({
            include: {
                orderitem: {
                    include: {
                        product: true
                    }
                }
            },
            take: 3
        });
        console.log(`   ✅ Found ${orders.length} orders`);
        orders.forEach(order => {
            console.log(`   - Order ${order.id}: ${order.orderitem.length} items`);
            order.orderitem.forEach(item => {
                console.log(`     • ${item.quantity}x ${item.product.name}`);
            });
        });

        // 4. Test User -> Cart -> CartItem -> Product relationship
        console.log('\n4. Testing User -> Cart -> CartItem -> Product relationship...');
        const carts = await prisma.cart.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            },
            take: 3
        });
        console.log(`   ✅ Found ${carts.length} carts`);
        carts.forEach(cart => {
            console.log(`   - Cart ${cart.id}: ${cart.items.length} items`);
            cart.items.forEach(item => {
                console.log(`     • ${item.quantity}x ${item.product.name}`);
            });
        });

        // 5. Test Coupon -> Order relationship
        console.log('\n5. Testing Coupon -> Order relationship...');
        const coupons = await prisma.coupon.findMany({
            include: {
                orders: {
                    take: 3
                }
            },
            take: 3
        });
        console.log(`   ✅ Found ${coupons.length} coupons`);
        coupons.forEach(coupon => {
            console.log(`   - ${coupon.code}: ${coupon.orders.length} orders`);
        });

        // 6. Test Shipping Zone -> Shipping Method relationship
        console.log('\n6. Testing Shipping Zone -> Shipping Method relationship...');
        const zones = await prisma.shipping_zone.findMany({
            include: {
                methods: true
            },
            take: 3
        });
        console.log(`   ✅ Found ${zones.length} shipping zones`);
        zones.forEach(zone => {
            console.log(`   - ${zone.name}: ${zone.methods.length} methods`);
        });

        // 7. Test Product -> Reviews relationship
        console.log('\n7. Testing Product -> Reviews relationship...');
        const productsWithReviews = await prisma.product.findMany({
            include: {
                reviews: {
                    include: {
                        user: true
                    },
                    take: 2
                }
            },
            where: {
                reviews: {
                    some: {}
                }
            },
            take: 3
        });
        console.log(`   ✅ Found ${productsWithReviews.length} products with reviews`);
        productsWithReviews.forEach(prod => {
            console.log(`   - ${prod.name}: ${prod.reviews.length} reviews`);
        });

        console.log('\n✅ All database relationships are properly connected!');
        console.log('\n📊 Summary:');
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Orders: ${orders.length}`);
        console.log(`   - Carts: ${carts.length}`);
        console.log(`   - Coupons: ${coupons.length}`);
        console.log(`   - Shipping Zones: ${zones.length}`);

    } catch (error) {
        console.error('❌ Error verifying connections:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

verifyConnections()
    .catch((error) => {
        console.error('Failed to verify connections:', error);
        process.exit(1);
    });




