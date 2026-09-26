import { NextRequest } from 'next/server'
import { squadRoomService } from '@/lib/squad-room-service'
import { apiSuccess, apiError } from '@/lib/api-response'
import { NotFoundError } from '@/lib/errors/app-error'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const room = squadRoomService.getOrCreateRoom(code)

    return apiSuccess({
      roomCode: room.code,
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}
