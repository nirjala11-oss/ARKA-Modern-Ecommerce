import { Product, Review } from '@/types'
import { INITIAL_PRODUCTS as RESERVE_PRODUCTS, SAMPLE_REVIEWS } from './products-data'

// In-memory cache for all products (194+ from DummyJSON + ARKA Reserve)
let cachedProducts: Product[] | null = null
let lastFetchTime = 0
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes cache

// Helper to convert USD price to realistic Indian Rupee (₹ INR)
function convertToINR(usdPrice: number, category: string): number {
  const rate = 83.5
  const inr = usdPrice * rate
  if (inr < 1000) {
    return Math.round(inr / 50) * 50 - 1 // e.g. 849, 899, 949
  } else if (inr < 10000) {
    return Math.round(inr / 100) * 100 - 1 // e.g. 2499, 4999, 7999
  } else {
    return Math.round(inr / 500) * 500 - 1 // e.g. 24999, 64999
  }
}

// Map raw categories to standardized department names
function normalizeCategory(rawCat: string): string {
  const cat = rawCat.toLowerCase()
  if (cat.includes('smartphone') || cat.includes('laptop') || cat.includes('tablet') || cat.includes('mobile-accessories')) {
    return 'Electronics'
  }
  if (cat.includes('audio')) {
    return 'Audio'
  }
  if (cat.includes('watch') || cat.includes('jewellery')) {
    return 'Timepieces & Jewelry'
  }
  if (cat.includes('shirt') || cat.includes('shoe') || cat.includes('dress') || cat.includes('bag') || cat.includes('tops') || cat.includes('sunglasses')) {
    return 'Designer Fashion'
  }
  if (cat.includes('beauty') || cat.includes('fragrance') || cat.includes('skin-care')) {
    return 'Beauty & Fragrances'
  }
  if (cat.includes('furniture') || cat.includes('home') || cat.includes('kitchen')) {
    return 'Home & Living'
  }
  if (cat.includes('sports') || cat.includes('motorcycle') || cat.includes('vehicle')) {
    return 'Sports & Mobility'
  }
  if (cat.includes('groceries')) {
    return 'Gourmet Living'
  }
  return 'Lifestyle'
}

export async function getAllProducts(): Promise<Product[]> {
  const now = Date.now()
  if (cachedProducts && now - lastFetchTime < CACHE_TTL) {
    return cachedProducts
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 800)
    const res = await fetch('https://dummyjson.com/products?limit=194', {
      signal: controller.signal,
    }).finally(() => clearTimeout(timer))

    if (!res.ok) throw new Error('DummyJSON fetch failed')
    const data = await res.json()

    const apiProducts: Product[] = (data.products || []).map((p: any) => {
      const inrPrice = convertToINR(p.price, p.category)
      const originalInrPrice = p.discountPercentage
        ? Math.round(inrPrice * (1 + p.discountPercentage / 100))
        : undefined

      const department = normalizeCategory(p.category)
      
      // Determine badge
      let badge: 'New' | 'Bestseller' | 'Featured' | 'Eco' | 'Limited' | undefined = undefined
      if (p.rating >= 4.8) badge = 'Bestseller'
      else if (p.discountPercentage > 15) badge = 'Featured'
      else if (p.stock < 10) badge = 'Limited'
      else if (p.id % 7 === 0) badge = 'Eco'

      return {
        id: `arka-${p.id}`,
        name: p.title,
        subtitle: `${p.brand || 'ARKA Reserve'} • ${p.category.replace('-', ' ').toUpperCase()}`,
        description: p.description,
        price: inrPrice,
        originalPrice: originalInrPrice,
        image: p.thumbnail || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        gallery: p.images && p.images.length > 0 ? p.images : [p.thumbnail],
        category: department,
        tags: [p.category, department.toLowerCase(), p.brand?.toLowerCase() || 'arka'],
        stock: p.stock || 20,
        rating: p.rating || 4.7,
        reviewCount: Math.floor(40 + (p.id * 13) % 250),
        badge,
        features: [
          `Original certified ${p.brand || 'Department'} merchandise with 100% authenticity guarantee`,
          'Pan-India delivery with real-time courier tracking via BlueDart & Delhivery',
          '3 to 6 months No-Cost EMI available on major Indian bank cards',
          'Inclusive of 18% GST with downloadable tax invoice for business ITC',
          '7-Day hassle-free return and doorstep replacement policy'
        ],
        specs: {
          'Brand': p.brand || 'ARKA Curated',
          'Category': p.category.replace('-', ' '),
          'Department': department,
          'SKU': `SKU-IND-${p.id.toString().padStart(5, '0')}`,
          'Dimensions': p.dimensions ? `${p.dimensions.width} x ${p.dimensions.height} x ${p.dimensions.depth} cm` : 'Standard Retail Dimensions',
          'Warranty': p.warrantyInformation || '1-Year Pan-India Doorstep Warranty',
          'Shipping Terms': p.shippingInformation || 'Express Courier Dispatch in 24-48 Hours'
        }
      }
    })

    // Combine Reserve items + 194 catalog items
    cachedProducts = [...RESERVE_PRODUCTS, ...apiProducts]
    lastFetchTime = now
    return cachedProducts
  } catch (err) {
    console.error('Error fetching catalog, falling back to reserve items:', err)
    return RESERVE_PRODUCTS
  }
}

export async function queryProducts(params?: {
  category?: string
  search?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const all = await getAllProducts()
  let result = [...all]

  // Filter category
  if (params?.category && params.category !== 'all') {
    result = result.filter(
      p => p.category.toLowerCase() === params.category!.toLowerCase()
    )
  }

  // Filter search
  if (params?.search && params.search.trim() !== '') {
    const q = params.search.toLowerCase().trim()
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
    )
  }

  // Filter price range
  if (params?.minPrice !== undefined) {
    result = result.filter(p => p.price >= params.minPrice!)
  }
  if (params?.maxPrice !== undefined) {
    result = result.filter(p => p.price <= params.maxPrice!)
  }

  // Filter sellerId
  if (params && (params as any).sellerId) {
    const sId = (params as any).sellerId
    result = result.filter(p => p.sellerId === sId)
  }

  // Sort
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

  const total = result.length
  const page = Math.max(1, params?.page || 1)
  const limit = Math.max(1, params?.limit || 24) // Default 24 products per page
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const paginated = result.slice(startIndex, startIndex + limit)

  return {
    products: paginated,
    total,
    page,
    totalPages,
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const localMatch = RESERVE_PRODUCTS.find(p => p.id === id)
  if (localMatch) return localMatch

  const all = await getAllProducts()
  return all.find(p => p.id === id) || null
}

export async function addProduct(productData: Partial<Product>): Promise<Product> {
  const all = await getAllProducts()
  const newId = `arka-item-${Date.now()}`

  const newProduct: Product = {
    id: newId,
    name: productData.name || 'Untitled Reference',
    subtitle: productData.subtitle || 'Handcrafted luxury reserve',
    description: productData.description || 'Exclusive artisan edition crafted for ARKA Luxe.',
    price: Number(productData.price) || 4999,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Math.round((Number(productData.price) || 4999) * 1.25),
    image: productData.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    gallery: productData.gallery || [productData.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'],
    category: productData.category || 'Electronics',
    stock: productData.stock !== undefined ? Number(productData.stock) : 25,
    rating: 4.9,
    reviewCount: 1,
    badge: (productData.badge as any) || 'New',
    features: productData.features || ['Artisan Provenance', 'Verified Pan-India Logistics', 'ARKA Authenticity Guarantee'],
    specs: productData.specs || { Origin: 'Bengaluru Atelier', Warranty: '2 Years Manufacturer' },
    sellerId: productData.sellerId || 'user-seller-01',
    sellerName: productData.sellerName || 'Saffron & Stone Atelier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Prepend to active cached products
  if (cachedProducts) {
    cachedProducts.unshift(newProduct)
  }
  RESERVE_PRODUCTS.unshift(newProduct)

  return newProduct
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = await getAllProducts()
  const initialLen = all.length
  
  if (cachedProducts) {
    cachedProducts = cachedProducts.filter(p => p.id !== id)
  }
  const reserveIdx = RESERVE_PRODUCTS.findIndex(p => p.id === id)
  if (reserveIdx !== -1) {
    RESERVE_PRODUCTS.splice(reserveIdx, 1)
  }

  return true
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const all = await getAllProducts()
  const product = all.find(p => p.id === id)
  if (!product) return null

  Object.assign(product, updates, { updatedAt: new Date().toISOString() })
  return product
}

export const getProductsService = getAllProducts

