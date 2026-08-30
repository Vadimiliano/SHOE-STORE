// app/page.tsx
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 12

// Next.js передаёт параметры URL (?search=...&brand=...&size=...&page=...) через searchParams
type Props = {
  searchParams: Promise<{
    search?: string
    brand?: string | string[]
    size?: string | string[]
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }>
}

function toArray(value?: string | string[]) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

// Аккуратно парсим число из query-параметра: если там мусор (не число), просто игнорируем фильтр,
// а не роняем страницу с ошибкой Prisma
function toNumber(value?: string) {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  const brands = toArray(params.brand)
  const sizes = toArray(params.size)
  const minPrice = toNumber(params.minPrice)
  const maxPrice = toNumber(params.maxPrice)
  const page = Math.max(1, Math.trunc(Number(params.page)) || 1)

  // Списки доступных брендов и размеров для фильтров собираем из ВСЕХ товаров в базе
  // (а не только уже отфильтрованных), чтобы фильтры не "исчезали" друг за другом
  const allProducts = await prisma.product.findMany({ select: { brand: true, sizes: true } })
  const availableBrands = Array.from(new Set(allProducts.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, 'ru')
  )
  const availableSizes = Array.from(
    new Set(allProducts.flatMap((p) => p.sizes.split(',').map((s) => s.trim()).filter(Boolean)))
  ).sort((a, b) => Number(a) - Number(b))

  // Условия фильтрации, которые можно применить на уровне SQL через Prisma
  const where: Prisma.ProductWhereInput = {
    ...(params.search && {
      name: { contains: params.search }, // поиск по вхождению подстроки в название
    }),
    ...(brands.length > 0 && {
      brand: { in: brands },
    }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }), // gte = больше или равно
            ...(maxPrice !== undefined && { lte: maxPrice }), // lte = меньше или равно
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

  const matchedProducts = await prisma.product.findMany({ where, orderBy })

  // Размер хранится строкой через запятую ("40,41,42"), поэтому точное совпадение
  // надёжнее проверить в JS после выборки, чем ловить подстроку в SQL (иначе "4" найдёт и "40", и "41")
  const filteredProducts =
    sizes.length > 0
      ? matchedProducts.filter((p) => {
          const productSizes = p.sizes.split(',').map((s) => s.trim())
          return sizes.some((s) => productSizes.includes(s))
        })
      : matchedProducts

  const total = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const products = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Каталог обуви</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Сайдбар с фильтрами */}
        <aside className="md:col-span-1">
          <ProductFilters availableBrands={availableBrands} availableSizes={availableSizes} />
        </aside>

        {/* Сетка товаров */}
        <div className="md:col-span-3">
          <p className="text-sm text-gray-400 mb-4">Найдено товаров: {total}</p>

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

          <Pagination currentPage={safePage} totalPages={totalPages} searchParams={params} />
        </div>
      </div>
    </div>
  )
}
