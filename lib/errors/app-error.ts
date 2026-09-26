export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown, isOperational = true) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_REQUIRED')
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden: Insufficient permissions') {
    super(message, 403, 'PERMISSION_DENIED')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'RESOURCE_CONFLICT')
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please slow down', retryAfterSeconds?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfterSeconds })
  }
}
