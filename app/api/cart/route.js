import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '../../../lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let cart = await prisma.cart.findFirst({
      where: {
        userId: session.userId,
        status: 'active'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.userId,
          status: 'active'
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    return NextResponse.json({ cart }, { status: 200 })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
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

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    let cart = await prisma.cart.findFirst({
      where: {
        userId: session.userId,
        status: 'active'
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.userId,
          status: 'active'
        }
      })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        },
        include: {
          product: true
        }
      })

      return NextResponse.json(
        { message: 'Cart updated', item: updatedItem },
        { status: 200 }
      )
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: true
        }
      })

      return NextResponse.json(
        { message: 'Item added to cart', item: newItem },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'An error occurred while adding to cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true
      }
    })

    if (!item || item.cart.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true
      }
    })

    return NextResponse.json(
      { message: 'Quantity updated', item: updatedItem },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = parseInt(searchParams.get('itemId'))

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true
      }
    })

    if (!item || item.cart.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'An error occurred while removing item' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
