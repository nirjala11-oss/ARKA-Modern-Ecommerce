import { NextRequest } from 'next/server'
import { queryProducts, addProduct } from '@/lib/products-service'
import { createProductSchema, queryProductSchema } from '@/lib/validations/product.schema'
import { requireRole } from '@/lib/security/auth-guard'
import { apiSuccess, apiError } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      sellerId: searchParams.get('sellerId') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    }

    const validatedQuery = queryProductSchema.parse(rawQuery)

    const result = await queryProducts({
      category: validatedQuery.category,
      search: validatedQuery.search,
      sort: validatedQuery.sort,
      minPrice: validatedQuery.minPrice,
      maxPrice: validatedQuery.maxPrice,
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      ...((validatedQuery.sellerId ? { sellerId: validatedQuery.sellerId } : {}) as any),
    })

    return apiSuccess({
      count: result.products.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      products: result.products,
    })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only verified administrators or sellers can add products
    const user = requireRole(request, ['admin', 'seller'])

    const rawBody = await request.json()
    const validatedData = createProductSchema.parse(rawBody)

    // Associate product with authenticating seller if applicable
    const productPayload = {
      ...validatedData,
      sellerId: user.role === 'seller' ? user.id : validatedData.sellerId,
      sellerName: user.role === 'seller' ? user.storeName || user.name : validatedData.sellerName,
    }

    const created = await addProduct(productPayload as any)

    logger.info(`Product cataloged: ${created.id} by ${user.email}`)

    return apiSuccess(
      {
        message: 'Product cataloged and published to live store',
        product: created,
      },
      201
    )
  } catch (error) {
    return apiError(error)
  }
}
