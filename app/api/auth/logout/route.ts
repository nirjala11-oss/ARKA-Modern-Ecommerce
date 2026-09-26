import { NextResponse } from 'next/server'
import { apiSuccess } from '@/lib/api-response'

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production'

  const response = apiSuccess({
    message: 'Logged out successfully',
  })

  // Invalidate auth-token cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
