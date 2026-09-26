import { NextRequest } from 'next/server'
import { authenticateRequest, JWTPayload } from '@/lib/jwt'
import { AuthenticationError, AuthorizationError } from '@/lib/errors/app-error'

/**
 * Requires an active authenticated session.
 * Throws AuthenticationError (401) if not logged in.
 */
export function requireAuth(req: NextRequest): JWTPayload {
  const user = authenticateRequest(req)
  if (!user) {
    throw new AuthenticationError('Authentication required to access this endpoint')
  }
  return user
}

/**
 * Requires specific role(s) (e.g. ['admin'], ['admin', 'seller']).
 * Throws AuthorizationError (403) if role doesn't match.
 */
export function requireRole(req: NextRequest, allowedRoles: Array<'user' | 'seller' | 'admin'>): JWTPayload {
  const user = requireAuth(req)
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError(
      `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
    )
  }
  return user
}

/**
 * Optional authentication: Returns user if authenticated, or null otherwise.
 */
export function getOptionalAuth(req: NextRequest): JWTPayload | null {
  return authenticateRequest(req)
}
