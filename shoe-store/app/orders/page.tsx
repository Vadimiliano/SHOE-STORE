// app/orders/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'

export default async function OrdersPage() {
  const user = await getCurrentUser()

  // Если не залогинен — отправляем на страницу входа
  if (!user) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const statusLabels: Record<string, string> = {
    PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Мои заказы</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">У вас пока нет заказов.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Заказ от {order.createdAt.toLocaleDateString('ru-RU')}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">
                {statusLabels[order.status]}
              </span>
            </div>

            <ul className="text-sm text-gray-700 space-y-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} · размер {item.size} · {item.quantity} шт. · {item.price} ₽
                </li>
              ))}
            </ul>

            <p className="text-right font-semibold mt-2">Итого: {order.total} ₽</p>
          </div>
        ))}
      </div>
    </div>
  )
}