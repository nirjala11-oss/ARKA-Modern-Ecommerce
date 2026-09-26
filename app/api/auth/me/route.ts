import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/security/auth-guard'
import { usersDb } from '@/lib/users-store'
import { apiSuccess, apiError } from '@/lib/api-response'
import { NotFoundError } from '@/lib/errors/app-error'

export async function GET(req: NextRequest) {
  try {
    const payload = requireAuth(req)

    const user = await usersDb.findById(payload.id)
    if (!user) {
      throw new NotFoundError('User profile not found')
    }

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        storeName: user.storeName,
      },
    })
  } catch (error) {
    return apiError(error)
  }
}
