import { Product, Order, Review, OrderStatus } from '@/types'
import { INITIAL_PRODUCTS, SAMPLE_REVIEWS } from './products-data'

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const TMP_DATA_DIR = path.join('/tmp', 'data')
const TMP_ORDERS_FILE = path.join(TMP_DATA_DIR, 'orders.json')

const seedOrders: Order[] = [
  {
    id: 'VJ-84920',
    status: 'shipped',
    subtotal: 29999,
    discount: 0,
    tax: 4576, // 18% GST
    shipping: 0,
    total: 29999,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98201 45678',
    address: 'Flat 402, Prestige Palms, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560038',
    country: 'India',
    paymentMethod: 'apple_pay', // UPI/Card
    paymentStatus: 'paid',
    trackingNumber: 'BLUEDART-984210IN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: 'item-1',
        productId: 'vajra-01',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        price: 29999,
      }
    ]
  }
]

// Global process-level cache for orders
const globalDbStore = globalThis as unknown as {
  __arka_orders_store?: Order[]
  __arka_products_store?: Product[]
  __arka_reviews_store?: Review[]
}

function loadPersistedOrders(): Order[] {
  // 1. Check /tmp on serverless environments
  try {
    if (fs.existsSync(TMP_ORDERS_FILE)) {
      const content = fs.readFileSync(TMP_ORDERS_FILE, 'utf-8')
      const parsed = JSON.parse(content) as Order[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // fallback
  }

  // 2. Check bundled project data/orders.json
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8')
      const parsed = JSON.parse(content) as Order[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error loading orders.json:', err)
  }
  return [...seedOrders]
}

function persistOrdersToDisk(orders: Order[]) {
  // 1. Try local project data/ (works on dev/local machines)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const tempFile = `${ORDERS_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf-8')
    fs.renameSync(tempFile, ORDERS_FILE)
  } catch {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
    } catch {
      // non-fatal fallback
    }
  }

  // 2. Also persist to /tmp on serverless environments like Vercel
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true })
    }
    const tmpTemp = `${TMP_ORDERS_FILE}.tmp`
    fs.writeFileSync(tmpTemp, JSON.stringify(orders, null, 2), 'utf-8')
    fs.renameSync(tmpTemp, TMP_ORDERS_FILE)
  } catch {
    // non-fatal fallback
  }
}

if (!globalDbStore.__arka_orders_store) {
  globalDbStore.__arka_orders_store = loadPersistedOrders()
}
if (!globalDbStore.__arka_products_store) {
  globalDbStore.__arka_products_store = [...INITIAL_PRODUCTS]
}
if (!globalDbStore.__arka_reviews_store) {
  globalDbStore.__arka_reviews_store = [...SAMPLE_REVIEWS]
}

const productsStore = globalDbStore.__arka_products_store
const reviewsStore = globalDbStore.__arka_reviews_store
const getOrdersList = (): Order[] => {
  if (!globalDbStore.__arka_orders_store) {
    globalDbStore.__arka_orders_store = loadPersistedOrders()
  }
  return globalDbStore.__arka_orders_store
}

export const db = {
  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    let result = [...productsStore]

    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === params.category!.toLowerCase())
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          result.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))
          break
        default:
          break
      }
    }

    return result
  },

  async getProductById(id: string): Promise<Product | null> {
    return productsStore.find(p => p.id === id) || null
  },

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `vajra-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    }
    productsStore.unshift(newProduct)
    return newProduct
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = productsStore.findIndex(p => p.id === id)
    if (idx === -1) return null
    productsStore[idx] = { ...productsStore[idx], ...updates, updatedAt: new Date().toISOString() }
    return productsStore[idx]
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const orders = getOrdersList()
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = getOrdersList()
    return orders.find(o => o.id === id) || null
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'status'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `VJ-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'processing',
      trackingNumber: `DELHIVERY-${Math.random().toString(36).substring(2, 9).toUpperCase()}IN`,
      createdAt: new Date().toISOString()
    }

    // Decrement stock
    for (const item of newOrder.items) {
      const prod = productsStore.find(p => p.id === item.productId)
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity)
      }
    }

    const orders = getOrdersList()
    orders.unshift(newOrder)
    persistOrdersToDisk(orders)
    return newOrder
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = getOrdersList()
    const order = orders.find(o => o.id === orderId)
    if (!order) return null
    order.status = status
    persistOrdersToDisk(orders)
    return order
  },

  // Reviews
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return reviewsStore.filter(r => r.productId === productId)
  },

  async addReview(reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0
    }
    reviewsStore.unshift(newReview)

    const prodReviews = reviewsStore.filter(r => r.productId === reviewData.productId)
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length
    const prod = productsStore.find(p => p.id === reviewData.productId)
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1))
      prod.reviewCount = prodReviews.length
    }

    return newReview
  }
}
