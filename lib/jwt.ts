import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

function getValidatedJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('CRITICAL: JWT_SECRET or NEXTAUTH_SECRET is not set in production!')
      throw new Error('JWT_SECRET must be configured in production')
    }
    return 'arka-luxe-jwt-secret-key-development-minimum-32-chars-long'
  }

  if (secret.length < 32 && process.env.NODE_ENV === 'production') {
    logger.warn('WARNING: JWT_SECRET is shorter than 32 characters in production. Consider using a 256-bit key.')
  }

  return secret
}

const TOKEN_EXPIRY = '7d'

export interface JWTPayload {
  id: string
  email: string
  name: string
  role: 'user' | 'seller' | 'admin'
  phone?: string
  avatar?: string
  storeName?: string
}

/**
 * Sign a new JWT token for a user
 */
export function signJwtToken(payload: JWTPayload): string {
  const secret = getValidatedJwtSecret()
  return jwt.sign(payload, secret, {
    expiresIn: TOKEN_EXPIRY,
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyJwtToken(token: string): JWTPayload | null {
  try {
    const secret = getValidatedJwtSecret()
    const decoded = jwt.verify(token, secret) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

/**
 * Extract token from Next.js request (Authorization header or auth-token cookie)
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookieToken = req.cookies.get('auth-token')?.value
  if (cookieToken) {
    return cookieToken
  }

  return null
}

/**
 * Authenticate request using JWT and return decoded user
 */
export function authenticateRequest(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyJwtToken(token)
}

/**
 * Standard secure cookie attributes for production
 */
export function getAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: 'auth-token',
    httpOnly: true, // Prevents XSS cookie theft
    secure: isProd, // Only sent over HTTPS in production
    sameSite: 'lax' as const, // Protects against CSRF on top-level navigations
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
}
