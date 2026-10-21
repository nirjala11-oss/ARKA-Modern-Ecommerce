import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

function getPrismaInstance(): PrismaClient | null {
  if (globalForPrisma.prisma !== undefined) {
    return globalForPrisma.prisma
  }

  if (!process.env.DATABASE_URL) {
    globalForPrisma.prisma = null
    return null
  }

  try {
    const client = new PrismaClient()
    globalForPrisma.prisma = client
    return client
  } catch (err) {
    console.warn('PrismaClient could not be initialized:', err)
    globalForPrisma.prisma = null
    return null
  }
}

export const prisma = getPrismaInstance() as unknown as PrismaClient

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}
