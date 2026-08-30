// app/admin/layout.tsx
import Link from 'next/link'
import { requireAdminPage } from '@/lib/requireAdmin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage() // если не админ — редирект сработает здесь, и ни один дочерний код не выполнится

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-lg font-semibold text-gray-900">Админ-панель</h1>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/admin/products" className="hover:text-gray-900">Товары</Link>
          <Link href="/admin/orders" className="hover:text-gray-900">Заказы</Link>
        </nav>
      </div>
      {children}
    </div>
  )
}