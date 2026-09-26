import { NextRequest, NextResponse } from 'next/server'
import { usersDb } from '@/lib/users-store'
import { signJwtToken, getAuthCookieOptions } from '@/lib/jwt'
import { loginSchema } from '@/lib/validations/auth.schema'
import { apiSuccess, apiError } from '@/lib/api-response'
import { AuthenticationError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json()
    const validatedData = loginSchema.parse(rawBody)

    const user = await usersDb.findByEmail(validatedData.email)
    if (!user) {
      logger.warn(`Failed login attempt for non-existent email: ${validatedData.email}`)
      throw new AuthenticationError('Invalid email or password')
    }

    const isMatch = await usersDb.verifyPassword(validatedData.password, user.passwordHash)
    if (!isMatch) {
      logger.warn(`Failed password attempt for user: ${validatedData.email}`)
      throw new AuthenticationError('Invalid email or password')
    }

    // Generate JWT token
    const token = signJwtToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      storeName: user.storeName,
    })

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      storeName: user.storeName,
    }

    logger.info(`User successfully authenticated: ${user.email} (${user.role})`)

    const response = apiSuccess({
      message: 'Login successful',
      token,
      user: safeUser,
    })

    // Set secure HTTP-only cookie for protected server-side auth
    response.cookies.set({
      ...getAuthCookieOptions(),
      value: token,
    })

    return response
  } catch (error) {
    return apiError(error)
  }
}
