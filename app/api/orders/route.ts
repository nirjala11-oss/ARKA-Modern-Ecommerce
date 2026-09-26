import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { createOrderSchema } from '@/lib/validations/order.schema'
import { calculateCanonicalOrderTotals } from '@/lib/security/order-pricing'
import { getOptionalAuth, requireAuth } from '@/lib/security/auth-guard'
import { apiSuccess, apiError } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const allOrders = await db.getOrders()

    // Admins see all orders; regular users only see their own orders
    if (user.role === 'admin') {
      return apiSuccess({
        count: allOrders.length,
        orders: allOrders,
      })
    }

    const userOrders = allOrders.filter(
      (order) => order.email?.toLowerCase() === user.email.toLowerCase() || order.userId === user.id
    )

    return apiSuccess({
      count: userOrders.length,
      orders: userOrders,
    })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    const validatedData = createOrderSchema.parse(rawBody)

    // Optional user association if logged in
    const currentUser = getOptionalAuth(request)

    // Server-side verification and recalculation of totals against database catalog
    // Prevents price tampering, negative quantities, or forged discounts
    const pricing = await calculateCanonicalOrderTotals(
      validatedData.items,
      validatedData.promoCode
    )

    const order = await db.createOrder({
      userId: currentUser?.id,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      zipCode: validatedData.zipCode,
      country: validatedData.country,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: validatedData.paymentMethod === 'cod' ? 'pending' : 'paid',
      items: pricing.items,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      tax: pricing.tax,
      shipping: pricing.shipping,
      total: pricing.total,
      promoCode: pricing.promoCode,
    })

    logger.info(`Order placed successfully: ${order.id} | Amount: ₹${order.total} | Customer: ${order.email}`)

    return apiSuccess(
      {
        message: 'Order created successfully',
        order,
      },
      201
    )
  } catch (error) {
    logger.error('Error creating order:', error)
    return apiError(error)
  }
}
