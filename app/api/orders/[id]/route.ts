import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { updateOrderStatusSchema } from '@/lib/validations/order.schema'
import { requireAuth, requireRole } from '@/lib/security/auth-guard'
import { apiSuccess, apiError } from '@/lib/api-response'
import { NotFoundError, AuthorizationError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = requireAuth(request)
    const order = await db.getOrderById(id)

    if (!order) {
      throw new NotFoundError(`Order with ID "${id}" was not found`)
    }

    // IDOR Protection: Customers may only view their own order; Admins can view any order
    const isOwner =
      order.email.toLowerCase() === user.email.toLowerCase() ||
      (order.userId && order.userId === user.id)

    if (user.role !== 'admin' && !isOwner) {
      logger.warn(`IDOR blocked: User ${user.email} attempted to access order ${id}`)
      throw new AuthorizationError('You do not have permission to view this order')
    }

    return apiSuccess({ order })
  } catch (error) {
    return apiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Only administrators or verified sellers can update order fulfillment status
    requireRole(request, ['admin', 'seller'])

    const rawBody = await request.json()
    const { status } = updateOrderStatusSchema.parse(rawBody)

    const updated = await db.updateOrderStatus(id, status)
    if (!updated) {
      throw new NotFoundError(`Order with ID "${id}" was not found`)
    }

    logger.info(`Order ${id} status updated to: ${status}`)

    return apiSuccess({
      message: `Order status updated to ${status}`,
      order: updated,
    })
  } catch (error) {
    return apiError(error)
  }
}
