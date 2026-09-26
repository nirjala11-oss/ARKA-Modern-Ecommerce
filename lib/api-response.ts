import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from '@/lib/errors/app-error'

export interface ApiResponseEnvelope<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  message?: string
  meta: {
    timestamp: string
    requestId?: string
  }
  [key: string]: unknown
}

export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse {
  const timestamp = new Date().toISOString()
  const payload: ApiResponseEnvelope<T> = {
    success: true,
    ...data,
    data,
    meta: {
      timestamp,
    },
  }
  return NextResponse.json(payload, { status, headers })
}

export function apiError(error: unknown, statusFallback = 500): NextResponse {
  const timestamp = new Date().toISOString()

  // Handle known operational AppError
  if (error instanceof AppError) {
    const payload: ApiResponseEnvelope = {
      success: false,
      message: error.message,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      meta: { timestamp },
    }
    return NextResponse.json(payload, { status: error.statusCode })
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))
    const firstErrorMessage = formattedErrors[0]?.message || 'Validation error'
    const payload: ApiResponseEnvelope = {
      success: false,
      message: firstErrorMessage,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: formattedErrors,
      },
      meta: { timestamp },
    }
    return NextResponse.json(payload, { status: 400 })
  }

  // Handle unexpected system/runtime errors
  const isProd = process.env.NODE_ENV === 'production'
  const message = error instanceof Error ? error.message : 'An unexpected server error occurred'

  const payload: ApiResponseEnvelope = {
    success: false,
    message: isProd ? 'Internal server error occurred' : message,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'Internal server error occurred' : message,
      details: isProd ? undefined : error instanceof Error ? error.stack : error,
    },
    meta: { timestamp },
  }

  return NextResponse.json(payload, { status: statusFallback })
}
