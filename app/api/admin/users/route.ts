import { NextRequest } from 'next/server'
import { usersDb } from '@/lib/users-store'
import { apiSuccess, apiError } from '@/lib/api-response'

const DEMO_CREDENTIALS: Record<string, string> = {
  'admin@ecommerce.com': 'admin123',
  'seller@ecommerce.com': 'seller123',
  'user@example.com': 'user123',
  'aarav.sharma@example.in': 'user123',
}

export async function GET(request: NextRequest) {
  try {
    const rawUsers = await usersDb.getAllUsers()

    const users = rawUsers.map((u) => {
      const lowerEmail = u.email.toLowerCase()
      const isDemo = Boolean(DEMO_CREDENTIALS[lowerEmail])
      return {
        ...u,
        isDemo,
        demoPassword: DEMO_CREDENTIALS[lowerEmail] || undefined,
      }
    })

    return apiSuccess({
      users,
      totalCount: users.length,
      demoCount: users.filter((u) => u.isDemo).length,
      customerCount: users.filter((u) => u.role === 'user').length,
      sellerCount: users.filter((u) => u.role === 'seller').length,
      adminCount: users.filter((u) => u.role === 'admin').length,
    })
  } catch (error) {
    return apiError(error)
  }
}
