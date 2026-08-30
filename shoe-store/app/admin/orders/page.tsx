// app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '@/components/OrderStatusSelect'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Заказы</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.user.email}</p>
                <p className="text-xs text-gray-400">
                  {order.createdAt.toLocaleDateString('ru-RU')}
                </p>
              </div>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>

            <ul className="text-sm text-gray-600 space-y-1 mb-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} · размер {item.size} · {item.quantity} шт.
                </li>
              ))}
            </ul>

            <p className="text-right text-sm font-semibold">{order.total.toLocaleString('ru-RU')} ₽</p>
          </div>
        ))}
      </div>
    </div>
  )
}