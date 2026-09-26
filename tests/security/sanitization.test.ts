import { describe, it, expect } from 'vitest'
import { escapeHtml, stripHtml, sanitizeObject, normalizeEmail } from '@/lib/security/sanitize'

describe('Input Sanitization & Injection Defense', () => {
  it('should escape dangerous HTML characters to neutralize XSS', () => {
    const malicious = '<script>alert("xss")</script>'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain('<script>')
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
  })

  it('should strip HTML tags from input text', () => {
    const dirty = '<b onmouseover="alert(1)">Luxury Perfume</b>'
    const clean = stripHtml(dirty)
    expect(clean).toBe('Luxury Perfume')
    expect(clean).not.toContain('<')
  })

  it('should recursively sanitize nested objects', () => {
    const dirtyPayload = {
      title: '<h1>Fine Jewelry</h1>',
      meta: {
        comment: '<script>evil()</script>Pure Titanium',
      },
    }

    const cleaned = sanitizeObject(dirtyPayload)
    expect(cleaned.title).toBe('Fine Jewelry')
    expect(cleaned.meta.comment).toBe('evil()Pure Titanium')
  })

  it('should normalize and trim email addresses', () => {
    expect(normalizeEmail('  USER@Domain.COM  ')).toBe('user@domain.com')
  })
})
