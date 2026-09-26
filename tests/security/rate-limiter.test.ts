import { describe, it, expect } from 'vitest'
import { checkRateLimit } from '@/lib/security/rate-limiter'

describe('Rate Limiter', () => {
  it('should allow requests within rate limits', () => {
    const testKey = `test-ip-${Date.now()}`
    const config = { windowMs: 10000, maxRequests: 3 }

    const res1 = checkRateLimit(testKey, config)
    expect(res1.success).toBe(true)
    expect(res1.remaining).toBe(2)

    const res2 = checkRateLimit(testKey, config)
    expect(res2.success).toBe(true)
    expect(res2.remaining).toBe(1)

    const res3 = checkRateLimit(testKey, config)
    expect(res3.success).toBe(true)
    expect(res3.remaining).toBe(0)
  })

  it('should throttle and reject requests that exceed limit', () => {
    const testKey = `throttle-ip-${Date.now()}`
    const config = { windowMs: 10000, maxRequests: 2 }

    checkRateLimit(testKey, config)
    checkRateLimit(testKey, config)

    // 3rd hit should be throttled
    const blockedRes = checkRateLimit(testKey, config)
    expect(blockedRes.success).toBe(false)
    expect(blockedRes.remaining).toBe(0)
    expect(blockedRes.resetSeconds).toBeGreaterThan(0)
  })
})
