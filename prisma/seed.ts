const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')

async function main() {
    // Create Default Admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@bubbloe.com' }
    })
    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@bubbloe.com',
                password: adminPassword,
                role: 'ADMIN',
            },
        })
    }

    let energyDrinks = await prisma.category.findUnique({
        where: { name: 'Energy Drinks' }
    })
    if (!energyDrinks) {
        energyDrinks = await prisma.category.create({
            data: {
                name: 'Energy Drinks',
            },
        })
    }

    const products = [
        {
            name: 'PURE VANILLA',
            description: 'A smooth and creamy vanilla energy experience.',
            price: 3.99,
            image: '/images/vanilla.png',
            color: '#FFFDD0',
            categoryId: energyDrinks.id,
            inventory: 100,
            sku: 'VAN-001',
            slug: 'pure-vanilla'
        },
        {
            name: 'PEACH SURGE',
            description: 'An explosive burst of juicy peach flavor.',
            price: 4.49,
            image: '/images/peach.png',
            color: '#FFDAB9',
            categoryId: energyDrinks.id,
            inventory: 100,
            sku: 'PEA-001',
            slug: 'peach-surge'
        },
        {
            name: 'MINTY MOTION',
            description: 'Cool and refreshing mint for focused energy.',
            price: 4.49,
            image: '/images/mint.png',
            color: '#98FFED',
            categoryId: energyDrinks.id,
            inventory: 100,
            sku: 'MIN-001',
            slug: 'minty-motion'
        },
        {
            name: 'BERRY BLAST',
            description: 'A powerful mix of wild berries.',
            price: 3.99,
            image: '/images/berryblast.png',
            color: '#D8B4FE',
            categoryId: energyDrinks.id,
            inventory: 100,
            sku: 'BER-001',
            slug: 'berry-blast'
        },
    ]

    for (const product of products) {
        const existing = await prisma.product.findFirst({
            where: { name: product.name }
        })
        if (!existing) {
            await prisma.product.create({
                data: product,
            })
        }
    }

    // Seed Initial Settings
    const defaultSettings = [
        { key: "HERO_TITLE", value: "UNLEASH THE POWER WITHIN", category: "hero" },
        { key: "HERO_SUBTITLE", value: "Premium Energy Drinks for those who never stop. Zero sugar, natural ingredients, explosive flavors.", category: "hero" },
        { key: "HERO_CTA_TEXT", value: "SHOP COLLECTIONS", category: "hero" },
        { key: "ABOUT_TITLE", value: "FUELING HUMAN POTENTIAL", category: "about" },
        { key: "BRAND_MANIFESTO", value: "At BUBBLOE, we believe energy is more than just a drink—it is the catalyst for greatness. Our mission is to provide clean, explosive energy that fuels your passion without the crash.", category: "about" },
        { key: "CONTACT_EMAIL", value: "support@bubbloe.com", category: "contact" },
        { key: "LOCATION", value: "ENERGY DISTRICT, NY 10001", category: "contact" },
    ]

    for (const s of defaultSettings) {
        const existing = await prisma.setting.findUnique({
            where: { key: s.key }
        })
        if (!existing) {
            await prisma.setting.create({
                data: s,
            })
        }
    }

    console.log('Seed data created successfully!')
}

main()
    .catch((e) => {
        console.error('An error occurred while running the seed command:')
        if (e.message) console.error('Error message:', e.message)
        if (e.code) console.error('Error code:', e.code)
        if (e.meta) console.error('Error meta:', e.meta)
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
