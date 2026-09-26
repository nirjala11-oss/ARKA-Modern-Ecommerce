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
    const { productId } = body

    if (!productId) {
      throw new ValidationError('productId is required')
    }

    const room = squadRoomService.simulateFriendVotes(code, productId)

    return apiSuccess({
      message: 'Simulated friend votes cast',
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}
