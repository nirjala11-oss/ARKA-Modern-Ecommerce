type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt',
  'secret',
  'authorization',
  'cookie',
  'creditcard',
  'cardnumber',
  'cvv',
  'cvc',
])

function maskSensitiveData(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return obj
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveData)
  }

  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '***REDACTED***'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = maskSensitiveData(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: unknown) {
    const timestamp = new Date().toISOString()
    const sanitizedContext = context ? maskSensitiveData(context) : undefined

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        context: sanitizedContext,
      })
    }

    const contextStr = sanitizedContext ? `\n${JSON.stringify(sanitizedContext, null, 2)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${contextStr}`
  }

  debug(message: string, context?: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: unknown) {
    console.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: unknown) {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, context?: unknown) {
    console.error(this.formatMessage('error', message, context))
  }
}

export const logger = new Logger()
