// app/products/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartForm from '@/components/AddToCartForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  const sizes = product.sizes.split(',')

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
      </div>

      <div>
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">{product.name}</h1>
        <p className="text-xl font-semibold mb-4">{product.price.toLocaleString('ru-RU')} ₽</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <AddToCartForm
          productId={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          sizes={sizes}
        />
      </div>
    </div>
  )
}