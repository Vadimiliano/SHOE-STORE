// app/admin/products/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Редактировать товар</h2>
      <ProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          brand: product.brand,
          imageUrl: product.imageUrl,
          sizes: product.sizes,
        }}
      />
    </div>
  )
}