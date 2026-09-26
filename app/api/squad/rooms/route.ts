import { NextRequest } from 'next/server'
import { squadRoomService } from '@/lib/squad-room-service'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const hostName = body.hostName || 'You (Host)'
    const generatedCode = `ARKA-${Math.floor(1000 + Math.random() * 9000)}`

    const room = squadRoomService.getOrCreateRoom(generatedCode, hostName)

    return apiSuccess({
      roomCode: room.code,
      room,
    }, 201)
  } catch (error) {
    return apiError(error)
  }
}
