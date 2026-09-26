export interface Product {
  id: string
  name: string
  subtitle?: string
  description: string
  price: number
  originalPrice?: number
  image: string
  gallery?: string[]
  category: string
  tags?: string[]
  stock: number
  rating: number
  reviewCount: number
  badge?: 'New' | 'Bestseller' | 'Eco' | 'Featured' | 'Limited'
  features?: string[]
  specs?: Record<string, string>
  createdAt?: string
  updatedAt?: string
  sellerId?: string
  sellerName?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'user' | 'seller' | 'admin'
  avatar?: string
  storeName?: string
}

export interface OrderItem {
  id: string
  orderId?: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId?: string
  status: OrderStatus
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  promoCode?: string

  // Customer Info
  name: string
  email: string
  phone: string
  address: string
  city: string
  state?: string
  zipCode: string
  country: string

  paymentMethod: 'credit_card' | 'cod' | 'apple_pay' | 'paypal' | 'upi'
  paymentStatus: 'paid' | 'pending'
  trackingNumber?: string
  createdAt: string
  items: OrderItem[]
}

export interface Review {
  id: string
  productId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpfulCount: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  recommendedProducts?: Product[]
}
