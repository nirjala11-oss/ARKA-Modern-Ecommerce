import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema, strongPasswordRegex } from '@/lib/validations/auth.schema'
import { signJwtToken, verifyJwtToken } from '@/lib/jwt'

describe('Authentication & Security Validation', () => {
  describe('Password Policy', () => {
    it('should reject weak passwords', () => {
      expect(strongPasswordRegex.test('short')).toBe(false)
      expect(strongPasswordRegex.test('alllowercase123!')).toBe(false)
      expect(strongPasswordRegex.test('ALLUPPERCASE123!')).toBe(false)
      expect(strongPasswordRegex.test('NoSpecialChar123')).toBe(false)
      expect(strongPasswordRegex.test('NoNumberSpecial!@#')).toBe(false)
    })

    it('should accept strong passwords meeting all complexity criteria', () => {
      expect(strongPasswordRegex.test('SecureP@ssw0rd!2025')).toBe(true)
      expect(strongPasswordRegex.test('ArkaLuxe#9820')).toBe(true)
      expect(strongPasswordRegex.test('Atelier$Director1')).toBe(true)
    })
  })

  describe('Registration Schema', () => {
    it('should successfully validate well-formed registration data', () => {
      const validPayload = {
        name: 'Aarav Sharma',
        email: 'AARAV@EXAMPLE.COM',
        password: 'ValidP@ssw0rd!',
        phone: '+91 98201 45678',
        role: 'user' as const,
      }

      const parsed = registerSchema.safeParse(validPayload)
      expect(parsed.success).toBe(true)
      if (parsed.success) {
        expect(parsed.data.email).toBe('aarav@example.com') // Normalized lowercase
        expect(parsed.data.name).toBe('Aarav Sharma')
      }
    })

    it('should reject registration when email is invalid', () => {
      const invalidPayload = {
        name: 'Test User',
        email: 'not-an-email',
        password: 'ValidP@ssw0rd!',
      }

      const parsed = registerSchema.safeParse(invalidPayload)
      expect(parsed.success).toBe(false)
    })

    it('should reject registration with names shorter than 2 characters', () => {
      const invalidPayload = {
        name: 'A',
        email: 'test@example.com',
        password: 'ValidP@ssw0rd!',
      }

      const parsed = registerSchema.safeParse(invalidPayload)
      expect(parsed.success).toBe(false)
    })
  })

  describe('Login Schema', () => {
    it('should validate valid login credentials', () => {
      const payload = {
        email: 'admin@ecommerce.com',
        password: 'adminPassword123',
      }
      const parsed = loginSchema.safeParse(payload)
      expect(parsed.success).toBe(true)
    })

    it('should reject login without password', () => {
      const payload = {
        email: 'admin@ecommerce.com',
        password: '',
      }
      const parsed = loginSchema.safeParse(payload)
      expect(parsed.success).toBe(false)
    })
  })

  describe('JWT Generation & Verification', () => {
    it('should sign and verify valid JWT tokens', () => {
      const userPayload = {
        id: 'user-test-123',
        email: 'test@atelier.com',
        name: 'Test Atelier',
        role: 'admin' as const,
      }

      const token = signJwtToken(userPayload)
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)

      const verified = verifyJwtToken(token)
      expect(verified).not.toBeNull()
      expect(verified?.id).toBe(userPayload.id)
      expect(verified?.email).toBe(userPayload.email)
      expect(verified?.role).toBe('admin')
    })

    it('should reject tampered or corrupted tokens', () => {
      const token = signJwtToken({
        id: 'user-1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
      })

      const tampered = token.slice(0, -6) + 'abc123'
      const verified = verifyJwtToken(tampered)
      expect(verified).toBeNull()
    })
  })

  describe('User Persistence & Relogin Engine', () => {
    it('should create, persist, and verify registered users for relogin', async () => {
      const { usersDb } = await import('@/lib/users-store')
      const uniqueEmail = `tester-${Date.now()}@example.in`
      const user = await usersDb.createUser({
        name: 'Persistence Tester',
        email: uniqueEmail,
        password: 'mypassword123',
      })

      expect(user).toBeDefined()
      expect(user.email).toBe(uniqueEmail)

      const fetched = await usersDb.findByEmail(uniqueEmail)
      expect(fetched).not.toBeNull()
      expect(fetched?.name).toBe('Persistence Tester')

      const validPass = await usersDb.verifyPassword('mypassword123', fetched!.passwordHash)
      expect(validPass).toBe(true)

      const invalidPass = await usersDb.verifyPassword('wrongPassword!', fetched!.passwordHash)
      expect(invalidPass).toBe(false)
    })
  })
})
