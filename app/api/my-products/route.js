import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '../../../lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        userId: session.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        priceCents: Math.round(price * 100),
        category: category.trim(),
        imageUrl: imageUrl && imageUrl.trim().length > 0 ? imageUrl.trim() : null,
        inStock: inStock === true || inStock === 'true',
        userId: session.userId
      }
    })

    revalidatePath('/my-products')
    revalidatePath('/products')

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
