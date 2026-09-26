import { NextRequest } from 'next/server'

interface RateLimitRecord {
  timestamps: number[]
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

// In-memory sliding window cache
const rateLimitCache = new Map<string, RateLimitRecord>()

// Periodically purge stale entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let cleanupTimer: NodeJS.Timeout | null = null

function ensureCleanupScheduled() {
  if (!cleanupTimer && typeof setInterval !== 'undefined') {
    cleanupTimer = setInterval(() => {
      const now = Date.now()
      for (const [key, record] of rateLimitCache.entries()) {
        const validTimestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000)
        if (validTimestamps.length === 0) {
          rateLimitCache.delete(key)
        } else {
          record.timestamps = validTimestamps
        }
      }
    }, CLEANUP_INTERVAL_MS)

    if (cleanupTimer.unref) {
      cleanupTimer.unref()
    }
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetSeconds: number
}

/**
 * Check if the given key is within the rate limit.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 60 }
): RateLimitResult {
  ensureCleanupScheduled()

  const now = Date.now()
  const windowStart = now - config.windowMs

  let record = rateLimitCache.get(key)
  if (!record) {
    record = { timestamps: [] }
    rateLimitCache.set(key, record)
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

  const count = record.timestamps.length

  if (count >= config.maxRequests) {
    const oldestTimestamp = record.timestamps[0] || now
    const resetTime = oldestTimestamp + config.windowMs
    const resetSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000))

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSeconds,
    }
  }

  // Record this hit
  record.timestamps.push(now)

  return {
    success: true,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.timestamps.length),
    resetSeconds: Math.ceil(config.windowMs / 1000),
  }
}

/**
 * Extracts client IP from incoming Next.js request.
 */
export function getClientIp(req: NextRequest): string {
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const xRealIp = req.headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()

  return '127.0.0.1'
}

/**
 * Pre-configured rate limits for different route categories.
 */
export const RATE_LIMITS = {
  // Brute force protection on auth
  AUTH: { windowMs: 60 * 1000, maxRequests: 5 },
  // Prevent spam checkout submissions
  ORDERS: { windowMs: 60 * 1000, maxRequests: 15 },
  // Concierge AI interactions
  CHAT: { windowMs: 60 * 1000, maxRequests: 25 },
  // General API endpoints
  GENERAL: { windowMs: 60 * 1000, maxRequests: 60 },
}
