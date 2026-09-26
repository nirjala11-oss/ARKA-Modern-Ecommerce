import { describe, it, expect } from 'vitest'
import { calculateCanonicalOrderTotals } from '@/lib/security/order-pricing'
import { createOrderSchema } from '@/lib/validations/order.schema'

describe('Order Pricing & Tamper-Proof Engine', () => {
  it('should accurately calculate totals for valid products in catalog', async () => {
    // vajra-01 is standard catalog item (e.g. ₹29,999)
    const calculation = await calculateCanonicalOrderTotals([
      { productId: 'vajra-01', quantity: 1 },
    ])

    expect(calculation.items.length).toBe(1)
    expect(calculation.subtotal).toBeGreaterThan(0)
    expect(calculation.tax).toBe(Math.round(calculation.subtotal * 0.18))
    expect(calculation.shipping).toBe(0) // > 999 qualifies for free express delivery
    expect(calculation.total).toBe(calculation.subtotal + calculation.tax)
  })

  it('should correctly apply ARKA10 promo discount', async () => {
    const rawResult = await calculateCanonicalOrderTotals([
      { productId: 'vajra-01', quantity: 1 },
    ])
    const promoResult = await calculateCanonicalOrderTotals(
      [{ productId: 'vajra-01', quantity: 1 }],
      'ARKA10'
    )

    expect(promoResult.discount).toBeGreaterThan(0)
    expect(promoResult.total).toBeLessThan(rawResult.total)
  })

  it('should reject orders with non-existent products', async () => {
    await expect(
      calculateCanonicalOrderTotals([{ productId: 'hacked-ghost-product-999', quantity: 1 }])
    ).rejects.toThrow(/not available in catalog/)
  })

  it('should reject orders with invalid or zero quantities', async () => {
    await expect(
      calculateCanonicalOrderTotals([{ productId: 'vajra-01', quantity: 0 }])
    ).rejects.toThrow(/Invalid quantity/)
  })

  it('should validate complete checkout order payloads with createOrderSchema', () => {
    const validOrder = {
      name: 'Priya Sundaram',
      email: 'priya@example.com',
      phone: '+91 99402 78901',
      address: '12th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      country: 'India',
      paymentMethod: 'credit_card' as const,
      items: [{ productId: 'vajra-01', quantity: 1 }],
    }

    const result = createOrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)
  })

  it('should reject checkout if required contact or address information is missing', () => {
    const incompleteOrder = {
      name: 'Priya Sundaram',
      // Missing email, address, phone
      items: [{ productId: 'vajra-01', quantity: 1 }],
    }

    const result = createOrderSchema.safeParse(incompleteOrder)
    expect(result.success).toBe(false)
  })
})
