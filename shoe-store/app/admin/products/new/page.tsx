// app/admin/products/new/page.tsx
import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Новый товар</h2>
      <ProductForm />
    </div>
  )
}