import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product title must be at least 2 characters')
    .max(150, 'Product title cannot exceed 150 characters'),
  subtitle: z.string().trim().max(200).optional(),
  description: z
    .string()
    .trim()
    .min(5, 'Product description must be at least 5 characters')
    .max(5000, 'Product description cannot exceed 5000 characters'),
  price: z
    .number()
    .nonnegative('Price cannot be negative'),
  originalPrice: z
    .number()
    .nonnegative('Original price cannot be negative')
    .optional(),
  image: z
    .string()
    .trim()
    .min(1, 'Product image URL or path is required'),
  gallery: z.array(z.string().trim()).optional().default([]),
  category: z
    .string()
    .trim()
    .min(2, 'Category name is required')
    .max(100),
  tags: z.array(z.string().trim()).optional().default([]),
  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
    .default(0),
  badge: z
    .enum(['New', 'Bestseller', 'Eco', 'Featured', 'Limited'])
    .optional(),
  features: z.array(z.string().trim()).optional().default([]),
  specs: z.record(z.string(), z.string()).optional().default({}),
  sellerId: z.string().optional(),
  sellerName: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const queryProductSchema = z.object({
  category: z.string().trim().optional(),
  search: z.string().trim().max(100).optional(),
  sort: z.enum(['price-asc', 'price-desc', 'rating', 'newest']).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  sellerId: z.string().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type QueryProductInput = z.infer<typeof queryProductSchema>
