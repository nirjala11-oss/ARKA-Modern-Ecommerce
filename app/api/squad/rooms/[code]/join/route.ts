import { NextRequest } from 'next/server'
import { squadRoomService } from '@/lib/squad-room-service'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await req.json()
    const { name } = body

    const room = squadRoomService.joinRoom(code, name || 'Friend')

    return apiSuccess({
      message: `${name || 'Friend'} joined room ${code}`,
      room,
    })
  } catch (error) {
    return apiError(error)
  }
}
