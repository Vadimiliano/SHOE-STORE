// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminApi } from '@/lib/requireAdmin'
import { saveUploadedImage, UploadError } from '@/lib/uploadImage'
import { normalizeSizes } from '@/lib/normalizeSizes'

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  // Форма приходит как multipart/form-data, потому что вместе с текстовыми полями
  // передаётся файл фотографии
  const formData = await request.formData()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const price = Number(formData.get('price'))
  const brand = String(formData.get('brand') ?? '').trim()
  const sizes = normalizeSizes(String(formData.get('sizes') ?? ''))
  const imageFile = formData.get('image')

  if (!name || !brand || !sizes || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: 'Заполните все обязательные поля корректно' }, { status: 400 })
  }

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return NextResponse.json({ error: 'Загрузите фото товара' }, { status: 400 })
  }

  let imageUrl: string
  try {
    imageUrl = await saveUploadedImage(imageFile)
  } catch (e) {
    const message = e instanceof UploadError ? e.message : 'Не удалось загрузить фото'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, description, price, brand, imageUrl, sizes },
  })

  return NextResponse.json(product)
}
