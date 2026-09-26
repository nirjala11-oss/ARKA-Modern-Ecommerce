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
    const { productId, itemId, vote, choice, voterName, userName, comment, reason } = body

    const targetId = productId || itemId
    const rawVote = String(vote || choice || '').toLowerCase().trim()
    const targetVote: 'up' | 'down' | null =
      rawVote === 'up' || rawVote === 'cop' || rawVote === 'win'
        ? 'up'
        : rawVote === 'down' || rawVote === 'drop' || rawVote === 'demote'
        ? 'down'
        : null

    if (!targetId || !targetVote) {
      throw new ValidationError(
        'Valid product identifier (productId or itemId) and vote ("up" | "down" | "cop" | "drop") are required'
      )
    }

    const voter = voterName || userName || 'Friend'
    const note = comment || reason

    const room = squadRoomService.castVote(code, targetId, targetVote, voter, note)
    const item = room.sharedItems.find(
      (i) => i.product.id === targetId || i.id === targetId
    )

    const totalVotes = item ? item.upvotes + item.downvotes : 0
    const copPercentage = totalVotes > 0 && item ? Math.round((item.upvotes / totalVotes) * 100) : 0

    return apiSuccess({
      message: `Vote successfully registered for ${voter}`,
      room,
      item,
      consensus: item
        ? {
            verdict: item.verdict,
            copPercentage,
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            totalVotes,
          }
        : null,
    })
  } catch (error) {
    return apiError(error)
  }
}
