import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '../../../../lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You do not own this product' },
        { status: 403 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (existingProduct.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You do not own this product' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, price, category, imageUrl, inStock } = body

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    if (!category || category.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    if (imageUrl && imageUrl.length > 0) {
      try {
        new URL(imageUrl)
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid image URL' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        priceCents: Math.round(price * 100),
        category: category.trim(),
        imageUrl: imageUrl && imageUrl.trim().length > 0 ? imageUrl.trim() : null,
        inStock: inStock === true || inStock === 'true'
      }
    })

    revalidatePath('/my-products')
    revalidatePath('/products')

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (existingProduct.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You do not own this product' },
        { status: 403 }
      )
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath('/my-products')
    revalidatePath('/products')

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
