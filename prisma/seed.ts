import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // === ПЛАТФОРМЫ ===
  const ps5 = await prisma.platform.upsert({
    where: { slug: 'playstation' },
    update: {},
    create: { slug: 'playstation', name: 'PlayStation 5', isActive: true },
  })

  const steam = await prisma.platform.upsert({
    where: { slug: 'steam' },
    update: {},
    create: { slug: 'steam', name: 'Steam', isActive: true },
  })

  const ai = await prisma.platform.upsert({
    where: { slug: 'ai-services' },
    update: {},
    create: { slug: 'ai-services', name: 'ИИ-сервисы', isActive: true },
  })

  const other = await prisma.platform.upsert({
    where: { slug: 'other' },
    update: {},
    create: { slug: 'other', name: 'Другие сервисы', isActive: true },
  })

  console.log('✅ Platforms created')

  // === РЕГИОНЫ ===
  const turkey = await prisma.region.upsert({
    where: { code: 'TR' },
    update: {},
    create: { code: 'TR', name: 'Турция', flag: '🇹🇷', currency: 'TRY' },
  })

  const kazakhstan = await prisma.region.upsert({
    where: { code: 'KZ' },
    update: {},
    create: { code: 'KZ', name: 'Казахстан', flag: '🇰🇿', currency: 'KZT' },
  })

  const ukraine = await prisma.region.upsert({
    where: { code: 'UA' },
    update: {},
    create: { code: 'UA', name: 'Украина', flag: '🇺🇦', currency: 'UAH' },
  })

  const argentina = await prisma.region.upsert({
    where: { code: 'AR' },
    update: {},
    create: { code: 'AR', name: 'Аргентина', flag: '🇦🇷', currency: 'ARS' },
  })

  const global = await prisma.region.upsert({
    where: { code: 'GLOBAL' },
    update: {},
    create: { code: 'GLOBAL', name: 'Глобальный', flag: '🌍', currency: 'USD' },
  })

  console.log('✅ Regions created')

  // === КУРСЫ ВАЛЮТ ===
  // Приблизительные курсы — потом подключим живой API
  const currencies = [
    { code: 'TRY', rate: 2.8,  markup: 0.12 },
    { code: 'KZT', rate: 0.18, markup: 0.12 },
    { code: 'UAH', rate: 2.1,  markup: 0.12 },
    { code: 'ARS', rate: 0.08, markup: 0.15 },
    { code: 'USD', rate: 92.0, markup: 0.10 },
  ]

  for (const cur of currencies) {
    await prisma.currency.upsert({
      where: { code: cur.code },
      update: { rate: cur.rate, markup: cur.markup },
      create: cur,
    })
  }

  console.log('✅ Currencies created')

  // === ПРОДУКТЫ (номиналы) ===
  // PlayStation 5 — Турция
  const ps5Products = [
    { platformId: ps5.id, regionId: turkey.id, amount: 250 },
    { platformId: ps5.id, regionId: turkey.id, amount: 500 },
    { platformId: ps5.id, regionId: turkey.id, amount: 1000, isPopular: true },
    { platformId: ps5.id, regionId: turkey.id, amount: 2000 },
    // PlayStation 5 — Казахстан
    { platformId: ps5.id, regionId: kazakhstan.id, amount: 1000 },
    { platformId: ps5.id, regionId: kazakhstan.id, amount: 3000, isPopular: true },
    { platformId: ps5.id, regionId: kazakhstan.id, amount: 5000 },
    // PlayStation 5 — Аргентина
    { platformId: ps5.id, regionId: argentina.id, amount: 1000 },
    { platformId: ps5.id, regionId: argentina.id, amount: 3000, isPopular: true },
    { platformId: ps5.id, regionId: argentina.id, amount: 5000 },
    // Steam — Турция
    { platformId: steam.id, regionId: turkey.id, amount: 50 },
    { platformId: steam.id, regionId: turkey.id, amount: 100 },
    { platformId: steam.id, regionId: turkey.id, amount: 250, isPopular: true },
    { platformId: steam.id, regionId: turkey.id, amount: 500 },
    // Steam — Казахстан
    { platformId: steam.id, regionId: kazakhstan.id, amount: 500 },
    { platformId: steam.id, regionId: kazakhstan.id, amount: 1000, isPopular: true },
    { platformId: steam.id, regionId: kazakhstan.id, amount: 2000 },
    // ИИ-сервисы — USD (1 месяц подписки)
    { platformId: ai.id, regionId: global.id, amount: 20, isPopular: true },  // ChatGPT Plus
    { platformId: ai.id, regionId: global.id, amount: 10 },                    // Midjourney Basic
    { platformId: ai.id, regionId: global.id, amount: 30 },                    // Claude Pro
    // Другие — USD
    { platformId: other.id, regionId: global.id, amount: 10, isPopular: true }, // Spotify
    { platformId: other.id, regionId: global.id, amount: 14 },                  // YouTube Premium
    { platformId: other.id, regionId: global.id, amount: 55 },                  // Adobe CC
  ]

  for (const product of ps5Products) {
    await prisma.product.create({ data: product })
  }

  console.log('✅ Products created')
  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })