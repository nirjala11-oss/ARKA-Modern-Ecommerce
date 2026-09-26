import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/security/rate-limiter'

interface TokenPayload {
  id: string
  email: string
  name: string
  role: 'user' | 'seller' | 'admin'
  exp?: number
}

function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Base64Url decode without node crypto dependency (Edge runtime compatible)
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload) as TokenPayload

    // Check expiration if present
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIp(request)
  const requestId = crypto.randomUUID()

  // 1. Rate Limiting for Sensitive API Endpoints
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    const rateCheck = checkRateLimit(`auth:${ip}`, RATE_LIMITS.AUTH)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again later.',
            retryAfterSeconds: rateCheck.resetSeconds,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateCheck.resetSeconds.toString(),
            'X-RateLimit-Limit': rateCheck.limit.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  } else if (pathname.startsWith('/api/orders') && request.method === 'POST') {
    const rateCheck = checkRateLimit(`orders:${ip}`, RATE_LIMITS.ORDERS)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many order requests. Please wait a moment.',
            retryAfterSeconds: rateCheck.resetSeconds,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateCheck.resetSeconds.toString(),
          },
        }
      )
    }
  } else if (pathname.startsWith('/api/chat')) {
    const rateCheck = checkRateLimit(`chat:${ip}`, RATE_LIMITS.CHAT)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Concierge is currently processing high volume. Please wait a moment.',
            retryAfterSeconds: rateCheck.resetSeconds,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateCheck.resetSeconds.toString(),
          },
        }
      )
    }
  }

  // 2. Token extraction
  const token =
    request.cookies.get('auth-token')?.value ||
    (request.headers.get('authorization')?.startsWith('Bearer ')
      ? request.headers.get('authorization')?.substring(7)
      : null)

  const user = token ? decodeJwtPayload(token) : null

  // 3. Route Protection: Admin Portal & Admin APIs
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isApi = pathname.startsWith('/api/')
    if (!user || user.role !== 'admin') {
      if (isApi) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Administrator authorization required to access this resource.',
            },
          },
          { status: 403 }
        )
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4. Route Protection: Seller Portal
  if (pathname.startsWith('/seller')) {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 5. Add security & tracing headers to response
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/api/:path*',
  ],
}
