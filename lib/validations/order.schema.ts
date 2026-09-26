import { z } from 'zod'

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(50, 'Quantity cannot exceed 50 units per item'),
  selectedColor: z.string().max(50).optional(),
  selectedSize: z.string().max(50).optional(),
})

export const createOrderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name is required (at least 2 characters)')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255),
  phone: z
    .string()
    .trim()
    .min(7, 'Valid contact phone number is required')
    .max(20),
  address: z
    .string()
    .trim()
    .min(5, 'Delivery street address is required')
    .max(255),
  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(100),
  state: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default(''),
  zipCode: z
    .string()
    .trim()
    .min(3, 'Postal or PIN code is required')
    .max(12),
  country: z
    .string()
    .trim()
    .min(2, 'Country is required')
    .max(100)
    .default('India'),
  paymentMethod: z
    .enum(['credit_card', 'cod', 'apple_pay', 'paypal', 'upi'])
    .default('credit_card'),
  items: z
    .array(orderItemInputSchema)
    .min(1, 'Order must contain at least one product item'),
  promoCode: z
    .string()
    .trim()
    .max(30)
    .optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
