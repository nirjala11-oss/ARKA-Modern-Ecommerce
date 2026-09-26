import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { User } from '@/types'

export interface StoredUser extends User {
  passwordHash: string
}

// Durable file database storage configuration
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// In-memory fallback users for development and testing
const initialUsers: StoredUser[] = [
  {
    id: 'user-admin-01',
    email: 'admin@ecommerce.com',
    name: 'Atelier Director (Admin)',
    phone: '+91 98201 11223',
    role: 'admin',
    avatar: 'AD',
    passwordHash: bcrypt.hashSync('admin123', 10),
  },
  {
    id: 'user-seller-01',
    email: 'seller@ecommerce.com',
    name: 'Vikramaditya Oberoi',
    phone: '+91 98112 33445',
    role: 'seller',
    avatar: 'VO',
    storeName: 'Saffron & Stone Atelier',
    passwordHash: bcrypt.hashSync('seller123', 10),
  },
  {
    id: 'user-vip-02',
    email: 'aarav.sharma@example.in',
    name: 'Aarav Sharma',
    phone: '+91 98201 45678',
    role: 'user',
    avatar: 'AS',
    passwordHash: bcrypt.hashSync('user123', 10),
  },
  {
    id: 'user-demo-03',
    email: 'user@example.com',
    name: 'Priya Sundaram',
    phone: '+91 99402 78901',
    role: 'user',
    avatar: 'PS',
    passwordHash: bcrypt.hashSync('user123', 10),
  },
]

// Global process-level cache to survive Next.js module reloads
const globalStore = globalThis as unknown as {
  __arka_users_store?: StoredUser[]
}

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {
    // Non-fatal if read-only environment
  }
}

function persistUsersToDisk(users: StoredUser[]) {
  ensureDataDir()
  try {
    const tempFile = `${USERS_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8')
    fs.renameSync(tempFile, USERS_FILE)
  } catch {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
    } catch {
      // Non-fatal fallback
    }
  }
}

function loadPersistedUsers(): StoredUser[] {
  ensureDataDir()
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8')
      const parsed = JSON.parse(content) as StoredUser[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mergedMap = new Map<string, StoredUser>()
        // Ensure seed users exist
        initialUsers.forEach((u) => mergedMap.set(u.email.toLowerCase(), u))
        // Layer in persisted registered users
        parsed.forEach((u) => mergedMap.set(u.email.toLowerCase(), u))
        return Array.from(mergedMap.values())
      }
    }
  } catch (err) {
    console.error('Error loading users.json:', err)
  }

  // If no file exists yet, create it with seed users
  persistUsersToDisk(initialUsers)
  return [...initialUsers]
}

function getActiveUsers(): StoredUser[] {
  if (!globalStore.__arka_users_store || globalStore.__arka_users_store.length === 0) {
    globalStore.__arka_users_store = loadPersistedUsers()
  }
  return globalStore.__arka_users_store
}

function setActiveUsers(users: StoredUser[]) {
  globalStore.__arka_users_store = users
  persistUsersToDisk(users)
}

// Fast circuit breaker to avoid 4-second TCP timeouts when local Postgres is not running
let dbCircuitBreaker = {
  isOperational: true,
  lastFailureTime: 0,
  cooldownPeriodMs: 60000, // Recheck DB after 60s
}

async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 800): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('DB_TIMEOUT')), timeoutMs)
  )
  return Promise.race([promise, timeoutPromise])
}

function canAttemptDbQuery(): boolean {
  if (dbCircuitBreaker.isOperational) return true
  const now = Date.now()
  if (now - dbCircuitBreaker.lastFailureTime > dbCircuitBreaker.cooldownPeriodMs) {
    dbCircuitBreaker.isOperational = true
    return true
  }
  return false
}

function recordDbFailure() {
  dbCircuitBreaker.isOperational = false
  dbCircuitBreaker.lastFailureTime = Date.now()
}

export const usersDb = {
  /**
   * Find a user by normalized email address
   */
  async findByEmail(email: string): Promise<StoredUser | null> {
    if (!email) return null
    const cleanEmail = email.toLowerCase().trim()

    // 1. Try Prisma first if database circuit breaker is open
    if (canAttemptDbQuery()) {
      try {
        const dbUser = await withDbTimeout(
          prisma.user.findUnique({
            where: { email: cleanEmail },
          })
        )
        if (dbUser) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            phone: dbUser.phone || undefined,
            role: (dbUser.role as 'user' | 'seller' | 'admin') || 'user',
            passwordHash: dbUser.password,
            avatar: dbUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
          }
        }
      } catch {
        recordDbFailure()
      }
    }

    // 2. Check active in-memory cache
    let users = getActiveUsers()
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail)

    // 3. If not found in cache, re-sync from disk in case another worker saved it
    if (!found) {
      users = loadPersistedUsers()
      globalStore.__arka_users_store = users
      found = users.find((u) => u.email.toLowerCase() === cleanEmail)
    }

    return found || null
  },

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<StoredUser | null> {
    if (!id) return null

    if (canAttemptDbQuery()) {
      try {
        const dbUser = await withDbTimeout(
          prisma.user.findUnique({
            where: { id },
          })
        )
        if (dbUser) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            phone: dbUser.phone || undefined,
            role: (dbUser.role as 'user' | 'seller' | 'admin') || 'user',
            passwordHash: dbUser.password,
            avatar: dbUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
          }
        }
      } catch {
        recordDbFailure()
      }
    }

    let users = getActiveUsers()
    let found = users.find((u) => u.id === id)

    if (!found) {
      users = loadPersistedUsers()
      globalStore.__arka_users_store = users
      found = users.find((u) => u.id === id)
    }

    return found || null
  },

  /**
   * List all registered sellers
   */
  async getAllSellers(): Promise<User[]> {
    const users = getActiveUsers()
    return users
      .filter((u) => u.role === 'seller')
      .map(({ passwordHash, ...rest }) => rest)
  },

  /**
   * List all registered users (for admin governance)
   */
  async getAllUsers(): Promise<User[]> {
    const users = getActiveUsers()
    return users.map(({ passwordHash, ...rest }) => rest)
  },

  /**
   * Create a new user with bcrypt password hashing and durable disk persistence
   */
  async createUser(data: {
    name: string
    email: string
    password: string
    phone?: string
    role?: 'user' | 'seller' | 'admin'
    storeName?: string
  }): Promise<User> {
    const cleanEmail = data.email.toLowerCase().trim()
    const passwordHash = await bcrypt.hash(data.password, 10)
    const role = data.role || 'user'
    const initials =
      data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'

    // 1. If PostgreSQL is reachable, persist to relational DB
    if (canAttemptDbQuery()) {
      try {
        const dbUser = await withDbTimeout(
          prisma.user.create({
            data: {
              name: data.name.trim(),
              email: cleanEmail,
              password: passwordHash,
              phone: data.phone?.trim() || null,
              role,
            },
          })
        )
        const safeUser: User = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          phone: dbUser.phone || undefined,
          role: (dbUser.role as 'user' | 'seller' | 'admin') || 'user',
          avatar: initials,
          storeName: data.storeName,
        }

        // Keep local storage synchronized with database user
        const currentUsers = getActiveUsers()
        const existingIdx = currentUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail)
        const storedRecord: StoredUser = { ...safeUser, passwordHash }
        if (existingIdx !== -1) {
          currentUsers[existingIdx] = storedRecord
        } else {
          currentUsers.push(storedRecord)
        }
        setActiveUsers(currentUsers)

        return safeUser
      } catch {
        recordDbFailure()
      }
    }

    // 2. Durable Local Storage & Global Cache
    const newUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      name: data.name.trim(),
      phone: data.phone?.trim(),
      role,
      avatar: initials,
      storeName: data.storeName,
      passwordHash,
    }

    const currentUsers = getActiveUsers()
    const existingIdx = currentUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail)

    if (existingIdx !== -1) {
      currentUsers[existingIdx] = newUser
    } else {
      currentUsers.push(newUser)
    }

    setActiveUsers(currentUsers)

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar,
      storeName: newUser.storeName,
    }
  },

  /**
   * Verify plain password against hashed password with fallback
   */
  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    if (!plain || !hash) return false
    try {
      const match = await bcrypt.compare(plain, hash)
      if (match) return true
    } catch {
      // ignore
    }
    // Direct string match fallback (for plain demo seeds or emergency overrides)
    return plain === hash
  },
}
