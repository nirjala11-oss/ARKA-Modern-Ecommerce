import { NextRequest } from 'next/server'
import { INDIAN_PINCODES } from '@/lib/products-data'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ValidationError } from '@/lib/errors/app-error'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.trim()

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new ValidationError('Please provide a valid 6-digit Indian PIN code (e.g. 560001, 110001)')
    }

    // Check known pincode or calculate standard pan-India delivery
    const match = INDIAN_PINCODES[code]
    if (match) {
      return apiSuccess({
        serviceable: true,
        pincode: code,
        city: match.city,
        state: match.state,
        estimatedDays: match.days,
        deliveryMessage: `Delivery in ${match.days} business ${match.days === 1 ? 'day' : 'days'} to ${match.city}`,
        codAvailable: true,
        freeDelivery: true,
      })
    }

    // Generic serviceable pan-India fallback
    return apiSuccess({
      serviceable: true,
      pincode: code,
      city: 'Direct Pan-India Dispatch',
      state: 'India',
      estimatedDays: 3,
      deliveryMessage: 'Standard Express Courier Delivery in 2-4 business days',
      codAvailable: true,
      freeDelivery: true,
    })
  } catch (error) {
    return apiError(error)
  }
}
