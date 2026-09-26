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
    const { text, sender } = body

    if (!text || typeof text !== 'string') {
      throw new ValidationError('Message text is required')
    }

    const room = squadRoomService.sendMessage(code, sender || 'Friend', text)

    return apiSuccess({
      message: 'Chat message sent',
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}
