// prisma/seed.ts
// Скрипт заполнения БД тестовыми товарами. Запускается вручную: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Сначала чистим таблицу, чтобы можно было запускать скрипт повторно без дублей
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      {
        name: 'Nike Air Max 90',
        description: 'Классические кроссовки с видимой амортизацией Air',
        price: 12990,
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        sizes: '40,41,42,43,44',
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Беговые кроссовки с технологией Boost',
        price: 15990,
        brand: 'Adidas',
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
        sizes: '39,40,41,42',
      },
      {
        name: 'New Balance 574',
        description: 'Универсальные повседневные кроссовки',
        price: 9990,
        brand: 'New Balance',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
        sizes: '38,39,40,41,42,43',
      },
      {
        name: 'Nike Air Force 1',
        description: 'Легендарная модель, подходит под любой образ',
        price: 11490,
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
        sizes: '40,41,42,43',
      },
      {
        name: 'Puma RS-X',
        description: 'Массивные кроссовки в стиле ретро-футуризм',
        price: 8990,
        brand: 'Puma',
        imageUrl: 'https://images.unsplash.com/photo-1608379743498-53a6f4c6a7f6?w=500',
        sizes: '39,40,41,42,43',
      },
      {
        name: 'Adidas Stan Smith',
        description: 'Минималистичные кожаные кеды, классика с 1965 года',
        price: 7990,
        brand: 'Adidas',
        imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
        sizes: '38,39,40,41,42',
      },
    ],
  })

  console.log('База заполнена тестовыми товарами ✅')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())