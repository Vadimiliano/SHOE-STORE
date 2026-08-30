// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminApi } from '@/lib/requireAdmin'
import { saveUploadedImage, UploadError } from '@/lib/uploadImage'
import { normalizeSizes } from '@/lib/normalizeSizes'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
  }

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

  // Новое фото загружаем, только если админ реально выбрал файл — иначе оставляем прежнее
  let imageUrl = existing.imageUrl
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await saveUploadedImage(imageFile)
    } catch (e) {
      const message = e instanceof UploadError ? e.message : 'Не удалось загрузить фото'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price, brand, imageUrl, sizes },
  })

  return NextResponse.json(product)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 400 })
  }
}
