import { Product, OrderItem } from '@/types'
import { getProductById } from '@/lib/products-service'
import { ValidationError } from '@/lib/errors/app-error'

export interface VerifiedOrderItem extends OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  selectedColor?: string
  selectedSize?: string
}

export interface VerifiedOrderCalculation {
  items: VerifiedOrderItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  promoCode?: string
}

interface RawOrderItemInput {
  productId: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

// Configurable promo discounts
const VALID_PROMOS: Record<string, { percent: number; maxDiscount: number; freeShipping?: boolean }> = {
  ARKA10: { percent: 10, maxDiscount: 5000 },
  ROYAL20: { percent: 20, maxDiscount: 10000 },
  FREESHIP: { percent: 0, maxDiscount: 0, freeShipping: true },
}

const TAX_RATE = 0.18 // 18% GST standard
const FREE_SHIPPING_THRESHOLD = 999
const STANDARD_SHIPPING_FEE = 149

/**
 * Validates inventory and securely computes canonical order totals on the server.
 * Completely immune to client-side price tampering.
 */
export async function calculateCanonicalOrderTotals(
  rawItems: RawOrderItemInput[],
  promoCode?: string
): Promise<VerifiedOrderCalculation> {
  if (!rawItems || rawItems.length === 0) {
    throw new ValidationError('Order must contain at least one item')
  }

  const verifiedItems: VerifiedOrderItem[] = []
  let subtotal = 0

  for (let idx = 0; idx < rawItems.length; idx++) {
    const item = rawItems[idx]
    if (!item.productId || typeof item.productId !== 'string') {
      throw new ValidationError('Each order item requires a valid product ID')
    }

    const qty = Math.floor(Number(item.quantity))
    if (isNaN(qty) || qty <= 0) {
      throw new ValidationError(`Invalid quantity for item: ${item.productId}`)
    }

    const product = await getProductById(item.productId)
    if (!product) {
      throw new ValidationError(`Product with ID "${item.productId}" is not available in catalog`)
    }

    if (product.stock < qty) {
      throw new ValidationError(
        `Insufficient inventory for "${product.name}". Requested: ${qty}, Available: ${product.stock}`
      )
    }

    const itemTotal = product.price * qty
    subtotal += itemTotal

    verifiedItems.push({
      id: `item-${Date.now()}-${idx}`,
      productId: product.id,
      product,
      quantity: qty,
      price: product.price,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    })
  }

  // Calculate promotional discount securely
  let discount = 0
  let isFreeShippingByPromo = false

  if (promoCode) {
    const cleanPromo = promoCode.trim().toUpperCase()
    const promo = VALID_PROMOS[cleanPromo]
    if (promo) {
      if (promo.percent > 0) {
        const calculatedDiscount = Math.round((subtotal * promo.percent) / 100)
        discount = Math.min(calculatedDiscount, promo.maxDiscount)
      }
      if (promo.freeShipping) {
        isFreeShippingByPromo = true
      }
    }
  }

  // Shipping calculation
  let shipping = 0
  if (subtotal < FREE_SHIPPING_THRESHOLD && !isFreeShippingByPromo) {
    shipping = STANDARD_SHIPPING_FEE
  }

  // Tax calculation on post-discount amount
  const taxableAmount = Math.max(0, subtotal - discount)
  const tax = Math.round(taxableAmount * TAX_RATE)

  // Final Total
  const total = Math.max(0, taxableAmount + tax + shipping)

  return {
    items: verifiedItems,
    subtotal: Math.round(subtotal),
    discount,
    tax,
    shipping,
    total,
    promoCode: promoCode ? promoCode.trim().toUpperCase() : undefined,
  }
}
