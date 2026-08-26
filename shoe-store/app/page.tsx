// app/page.tsx
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'

// Next.js передаёт параметры URL (?search=...&brand=...) через searchParams
type Props = {
  searchParams: Promise<{
    search?: string
    brand?: string | string[]
    minPrice?: string
    maxPrice?: string
    sort?: string
  }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  // Приводим brand к массиву в любом случае (в URL может быть один бренд или несколько)
  const brands = params.brand
    ? Array.isArray(params.brand)
      ? params.brand
      : [params.brand]
    : []

  // Собираем условия фильтрации для Prisma динамически
  const where: Prisma.ProductWhereInput = {
    ...(params.search && {
      name: { contains: params.search }, // поиск по вхождению подстроки в название
    }),
    ...(brands.length > 0 && {
      brand: { in: brands },
    }),
    ...(params.minPrice || params.maxPrice
      ? {
          price: {
            ...(params.minPrice && { gte: Number(params.minPrice) }), // gte = больше или равно
            ...(params.maxPrice && { lte: Number(params.maxPrice) }), // lte = меньше или равно
          },
        }
      : {}),
  }

  // Определяем сортировку
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === 'price_asc'
      ? { price: 'asc' }
      : params.sort === 'price_desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' } // по умолчанию — новизна

  const products = await prisma.product.findMany({ where, orderBy })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Каталог обуви</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Сайдбар с фильтрами */}
        <aside className="md:col-span-1">
          <ProductFilters />
        </aside>

        {/* Сетка товаров */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <p className="text-gray-500">Ничего не найдено, попробуйте изменить фильтры.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}