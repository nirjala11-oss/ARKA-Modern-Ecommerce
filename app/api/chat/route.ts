import { NextRequest } from 'next/server'
import { getAllProducts } from '@/lib/products-service'
import { Product } from '@/types'
import { chatMessageSchema } from '@/lib/validations/chat.schema'
import { stripHtml } from '@/lib/security/sanitize'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    const { message } = chatMessageSchema.parse(rawBody)

    // Sanitize user message against HTML/script injection
    const cleanMessage = stripHtml(message).toLowerCase().trim()
    const allProducts = await getAllProducts()
    let recommended: Product[] = []
    let responseText = ''

    if (
      cleanMessage.includes('fragrance') ||
      cleanMessage.includes('perfume') ||
      cleanMessage.includes('scent') ||
      cleanMessage.includes('beauty')
    ) {
      recommended = allProducts
        .filter((p) => p.category === 'Beauty & Fragrances' || p.category === 'fragrances')
        .slice(0, 4)
      responseText = `Namaste! Our Haute Parfumerie department features rare artisanal extracts, Arabian oud accords, and botanical elixirs. All flacons are certified authentic and shipped in climate-regulated protective packaging.`
    } else if (
      cleanMessage.includes('watch') ||
      cleanMessage.includes('timepiece') ||
      cleanMessage.includes('horology') ||
      cleanMessage.includes('jewel') ||
      cleanMessage.includes('ring')
    ) {
      recommended = allProducts
        .filter((p) => p.category === 'Timepieces & Jewelry' || p.category.includes('watch'))
        .slice(0, 4)
      responseText = `For horological connoisseurs, ARKA presents Swiss chronographs, automatic tourbillons, and medical-grade titanium smart rings engineered for biometric telemetry and discreet luxury.`
    } else if (
      cleanMessage.includes('fashion') ||
      cleanMessage.includes('dress') ||
      cleanMessage.includes('shirt') ||
      cleanMessage.includes('wear') ||
      cleanMessage.includes('bag') ||
      cleanMessage.includes('shoe')
    ) {
      recommended = allProducts.filter((p) => p.category === 'Designer Fashion').slice(0, 4)
      responseText = `Our Designer Fashion salon curates Italian merino knitwear, tailored outerwear, mulberry silk accessories, and handcrafted leather footwear designed for discerning wardrobes.`
    } else if (
      cleanMessage.includes('headphone') ||
      cleanMessage.includes('audio') ||
      cleanMessage.includes('sound') ||
      cleanMessage.includes('music') ||
      cleanMessage.includes('anc')
    ) {
      recommended = allProducts.filter((p) => p.category === 'Audio').slice(0, 4)
      responseText = `For acoustic purists, we showcase planar magnetic headphones with active noise cancellation, lossless LDAC streaming, and artisan acoustical calibration for studio-grade fidelity.`
    } else if (
      cleanMessage.includes('laptop') ||
      cleanMessage.includes('computer') ||
      cleanMessage.includes('keyboard') ||
      cleanMessage.includes('mouse') ||
      cleanMessage.includes('tech') ||
      cleanMessage.includes('electronic')
    ) {
      recommended = allProducts
        .filter((p) => p.category === 'Electronics' || p.category === 'Computing')
        .slice(0, 4)
      responseText = `In Personal Electronics, explore anodized aluminum workstations, gasket-mounted tactile keyboards, and ultralight magnesium peripherals engineered for uncompromising productivity.`
    } else if (
      cleanMessage.includes('pincode') ||
      cleanMessage.includes('delivery') ||
      cleanMessage.includes('shipping') ||
      cleanMessage.includes('cod') ||
      cleanMessage.includes('bangalore') ||
      cleanMessage.includes('delhi') ||
      cleanMessage.includes('mumbai')
    ) {
      recommended = allProducts.slice(0, 2)
      responseText = `ARKA dispatches across 19,000+ Indian PIN codes via BlueDart Apex and Delhivery Priority courier networks. Complimentary express shipping is automatically granted on all orders exceeding ₹999, with full Cash on Delivery and No-Cost EMI support.`
    } else {
      // General concierge recommendations
      recommended = allProducts.filter((p) => p.badge === 'Bestseller' || p.rating >= 4.8).slice(0, 4)
      responseText = `Welcome to ARKA (अर्क) — The Luxury Department Store of India. Across our 8 curated departments (Electronics, Audio, Timepieces, Designer Fashion, Fragrances, Home, and Gourmet Living), every instrument and atelier creation is backed by authentic brand warranties and GST invoices. How may I guide your selection today?`
    }

    if (recommended.length === 0) {
      recommended = allProducts.slice(0, 4)
    }

    return apiSuccess({
      reply: responseText,
      recommendations: recommended,
    })
  } catch (error) {
    return apiError(error)
  }
}
