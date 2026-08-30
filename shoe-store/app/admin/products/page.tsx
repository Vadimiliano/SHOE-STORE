// app/admin/products/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteProductButton from '@/components/DeleteProductButton'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Товары</h2>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          + Добавить товар
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Название</th>
            <th className="pb-2">Бренд</th>
            <th className="pb-2">Цена</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-50">
              <td className="py-3">{product.name}</td>
              <td className="py-3 text-gray-500">{product.brand}</td>
              <td className="py-3">{product.price.toLocaleString('ru-RU')} ₽</td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/admin/products/${product.id}`} className="text-gray-500 hover:text-gray-900">
                  Изменить
                </Link>
                <DeleteProductButton productId={product.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}