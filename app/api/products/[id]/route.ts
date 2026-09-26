import { NextRequest } from 'next/server'
import { getProductById, deleteProduct, updateProduct } from '@/lib/products-service'
import { db } from '@/lib/db'
import { updateProductSchema } from '@/lib/validations/product.schema'
import { requireRole } from '@/lib/security/auth-guard'
import { apiSuccess, apiError } from '@/lib/api-response'
import { NotFoundError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)
    if (!product) {
      throw new NotFoundError(`Product "${id}" was not found`)
    }
    const reviews = await db.getReviewsByProduct(id)
    return apiSuccess({ product, reviews })
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = requireRole(request, ['admin', 'seller'])

    const product = await getProductById(id)
    if (!product) {
      throw new NotFoundError(`Product "${id}" does not exist`)
    }

    // If seller, ensure they own the listing
    if (user.role === 'seller' && product.sellerId && product.sellerId !== user.id) {
      return apiError(new Error('You can only decommission your own product listings'), 403)
    }

    const success = await deleteProduct(id)
    if (!success) {
      return apiError(new Error('Product could not be removed'), 500)
    }

    logger.info(`Product ${id} decommissioned by ${user.email}`)

    return apiSuccess({
      message: `Product ${id} permanently decommissioned`,
    })
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
    const user = requireRole(request, ['admin', 'seller'])

    const product = await getProductById(id)
    if (!product) {
      throw new NotFoundError(`Product "${id}" does not exist`)
    }

    if (user.role === 'seller' && product.sellerId && product.sellerId !== user.id) {
      return apiError(new Error('You can only edit your own product listings'), 403)
    }

    const rawBody = await request.json()
    const validatedUpdates = updateProductSchema.parse(rawBody)

    const updated = await updateProduct(id, validatedUpdates)
    if (!updated) {
      throw new NotFoundError(`Product "${id}" could not be updated`)
    }

    logger.info(`Product ${id} updated by ${user.email}`)

    return apiSuccess({
      message: 'Product updated successfully',
      product: updated,
    })
  } catch (error) {
    return apiError(error)
  }
}
