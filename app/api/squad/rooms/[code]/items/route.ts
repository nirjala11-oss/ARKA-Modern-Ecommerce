import { NextRequest } from 'next/server'
import { squadRoomService } from '@/lib/squad-room-service'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ValidationError } from '@/lib/errors/app-error'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await req.json()
    const { product, question, addedByName } = body

    if (!product || !product.id) {
      throw new ValidationError('A valid product object is required')
    }

    const room = squadRoomService.addItem(code, product, question, addedByName || 'You')

    return apiSuccess({
      message: 'Product dilemma added to Squad lounge',
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      throw new ValidationError('productId is required in query params')
    }

    const room = squadRoomService.removeItem(code, productId)

    return apiSuccess({
      message: `Product ${productId} removed from room`,
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}
