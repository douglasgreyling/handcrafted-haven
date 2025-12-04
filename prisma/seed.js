const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const products = [
  {
    name: "Handwoven Wool Blanket",
    description: "A cozy, handwoven wool blanket perfect for chilly evenings. Made from 100% organic wool.",
    priceCents: 12999, // $129.99
    category: "Home & Living",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Beautiful handcrafted ceramic mugs, perfect for your morning coffee. Set of 2.",
    priceCents: 3499, // $34.99
    category: "Kitchen & Dining",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Macrame Wall Hanging",
    description: "Elegant macrame wall art to add a boho touch to your space. Handmade with cotton cord.",
    priceCents: 4599, // $45.99
    category: "Home Decor",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Wooden Cutting Board",
    description: "Durable bamboo cutting board with a sleek design. Perfect for food preparation.",
    priceCents: 2899, // $28.99
    category: "Kitchen & Dining",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Leather Journal",
    description: "Premium leather-bound journal with handmade paper. Perfect for writing or sketching.",
    priceCents: 5999, // $59.99
    category: "Stationery",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Scented Soy Candles",
    description: "Set of 3 hand-poured soy candles with natural fragrances. Burns for 40+ hours each.",
    priceCents: 3999, // $39.99
    category: "Home & Living",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Knitted Scarf",
    description: "Soft, chunky knit scarf in neutral tones. Hand-knitted with premium yarn.",
    priceCents: 4299, // $42.99
    category: "Fashion & Accessories",
    imageUrl: "https://picsum.photos/500",
    inStock: false
  },
  {
    name: "Pottery Vase",
    description: "Unique ceramic vase with a rustic glaze finish. Perfect for fresh or dried flowers.",
    priceCents: 6799, // $67.99
    category: "Home Decor",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Handmade Soap Set",
    description: "Natural soap bars made with organic ingredients. Set includes 4 different scents.",
    priceCents: 2499, // $24.99
    category: "Bath & Body",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Wicker Basket",
    description: "Handwoven storage basket perfect for organizing or as a decorative piece.",
    priceCents: 3799, // $37.99
    category: "Storage & Organization",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Embroidered Pillow Cover",
    description: "Beautiful hand-embroidered pillow cover with floral design. Cotton fabric.",
    priceCents: 2999, // $29.99
    category: "Home & Living",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  },
  {
    name: "Artisan Bread Bowl",
    description: "Hand-carved wooden bread bowl, perfect for serving or display.",
    priceCents: 8999, // $89.99
    category: "Kitchen & Dining",
    imageUrl: "https://picsum.photos/500",
    inStock: true
  }
]

async function main() {
  console.log('Starting seed...')

  // Clear existing data - delete products first (they reference users via foreign key)
  await prisma.product.deleteMany({})
  console.log('Cleared existing products')

  // Now safe to delete the user
  await prisma.user.deleteMany({
    where: { email: 'test@example.com' }
  })

  // Create test user
  const hashedPassword = await bcrypt.hash('foobarbazA1', 10)

  const testUser = await prisma.user.create({
    data: {
      username: 'tester',
      email: 'test@example.com',
      password: hashedPassword
    }
  })

  console.log('Seeded test user (username: tester, email: test@example.com)')

  // Insert seed data
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        userId: testUser.id
      }
    })
  }

  console.log(`Seeded ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })