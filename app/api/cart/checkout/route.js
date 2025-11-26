import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.userId,
        status: 'active'
      },
      include: {
        items: true
      }
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { status: 'completed' }
    })

    return NextResponse.json(
      { message: 'Checkout successful', orderId: cart.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during checkout' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
