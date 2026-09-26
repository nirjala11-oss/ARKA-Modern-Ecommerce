/**
 * Utility functions for sanitizing inputs to prevent XSS and injection attacks.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
}

/**
 * Escapes dangerous HTML characters to prevent XSS injection in raw outputs.
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input.replace(/[&<>"'`/]/g, (match) => HTML_ESCAPE_MAP[match] || match)
}

/**
 * Strips HTML tags from input string.
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}

/**
 * Normalizes email address to lower case and removes surrounding whitespace.
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  return email.toLowerCase().trim()
}

/**
 * Recursively sanitizes string values in an object or array.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return stripHtml(obj).trim() as unknown as T
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    result[key] = sanitizeObject(value)
  }
  return result as T
}
