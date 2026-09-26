import { NextRequest } from 'next/server'
import { usersDb } from '@/lib/users-store'
import { signJwtToken, getAuthCookieOptions } from '@/lib/jwt'
import { registerSchema } from '@/lib/validations/auth.schema'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ConflictError } from '@/lib/errors/app-error'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json()
    const validatedData = registerSchema.parse(rawBody)

    const existing = await usersDb.findByEmail(validatedData.email)
    if (existing) {
      logger.warn(`Registration rejected: Email already registered: ${validatedData.email}`)
      throw new ConflictError('An account with this email address already exists')
    }

    const newUser = await usersDb.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
      role: validatedData.role,
      storeName: validatedData.storeName,
    })

    const token = signJwtToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
      storeName: newUser.storeName,
    })

    logger.info(`New user registered: ${newUser.email} [role: ${newUser.role}]`)

    const response = apiSuccess(
      {
        message: 'Account created successfully',
        token,
        user: newUser,
      },
      201
    )

    response.cookies.set({
      ...getAuthCookieOptions(),
      value: token,
    })

    return response
  } catch (error) {
    return apiError(error)
  }
}
