import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('System Health API', () => {
  it('should return 200 OK with system telemetry and uptime', async () => {
    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('healthy')
    expect(data.timestamp).toBeDefined()
    expect(typeof data.uptimeSeconds).toBe('number')
    expect(data.services.database).toBeDefined()
    expect(data.system.heapUsedMb).toBeGreaterThan(0)
  })
})
