'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { AIChatModal } from '@/components/AIChatModal'
import { ProductCard } from '@/components/ProductCard'
import { useCartStore } from '@/stores/cart-store'
import { useSocialRoomStore } from '@/stores/social-room-store'
import { Product, Review } from '@/types'
import { INITIAL_PRODUCTS, SAMPLE_REVIEWS } from '@/lib/products-data'
import { formatINR, calculateEMI } from '@/lib/format'
import {
  Star,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Zap,
  MapPin,
  Receipt,
  Award,
  Users,
  Flame,
  Share2,
  Copy,
  Sparkles
} from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [squadModalOpen, setSquadModalOpen] = useState(false)
  const [squadQuestion, setSquadQuestion] = useState('Should I buy this? Need squad votes before checking out!')
  const [squadCopied, setSquadCopied] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs')

  // Pincode checker state
  const [pincode, setPincode] = useState('')
  const [pincodeResult, setPincodeResult] = useState<any>(null)
  const [checkingPincode, setCheckingPincode] = useState(false)

  const { addItem, openCart } = useCartStore()
  const { inRoom, roomCode, createRoom, addSharedItem } = useSocialRoomStore()

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        if (data.success && data.product) {
          setProduct(data.product)
          setSelectedImage(data.product.image)
          setReviews(data.reviews || [])
        } else {
          const fallback = INITIAL_PRODUCTS.find((p) => p.id === id)
          if (fallback) {
            setProduct(fallback)
            setSelectedImage(fallback.image)
            setReviews(SAMPLE_REVIEWS.filter((r) => r.productId === fallback.id))
          }
        }
      } catch {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === id)
        if (fallback) {
          setProduct(fallback)
          setSelectedImage(fallback.image)
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.length !== 6) return
    setCheckingPincode(true)
    try {
      const res = await fetch(`/api/pincode?code=${pincode}`)
      const data = await res.json()
      setPincodeResult(data)
    } catch {
      setPincodeResult({ success: true, deliveryMessage: 'Express air dispatch in 24-48 hours' })
    } finally {
      setCheckingPincode(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!product) return
    addItem(product, quantity)
    router.push('/checkout')
  }

  const handleOpenSquadModal = () => {
    if (!product) return
    if (!inRoom) {
      createRoom('You')
    }
    addSharedItem(product, squadQuestion, 'You')
    setSquadModalOpen(true)
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#143e2e', '#c5a059', '#10b981'],
      })
    } catch {
      // ignore
    }
  }

  const handleCopySquadLink = () => {
    const link = typeof window !== 'undefined'
      ? `${window.location.origin}/squad?product=${product?.id}&room=${roomCode}`
      : `/squad?product=${product?.id}`
    navigator.clipboard.writeText(link)
    setSquadCopied(true)
    setTimeout(() => setSquadCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#143e2e] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-stone-500">Retrieving atelier specifications...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex flex-col justify-between">
        <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
        <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-serif">Product Not Found</h2>
          <p className="text-xs text-stone-500">The requested luxury reference does not exist or has been reserved.</p>
          <Link href="/products" className="inline-block px-5 py-2.5 rounded-full bg-[#143e2e] text-white font-bold text-xs">
            Return to Master Catalog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  const galleryImages = [product.image, ...(product.gallery || [])]
  const emiPerMonth = calculateEMI(product.price, 6)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white pb-24 sm:pb-0">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
      <CartDrawer />
      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Squad Share Modal */}
      {squadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#e8e6e1] shadow-2xl relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center border border-[#d2e4d8]">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-[#111315]">
                  Added to Squad &ldquo;Should I Buy It?&rdquo;
                </h3>
                <p className="text-xs text-[#6e747c]">
                  Your friends can now vote <strong className="text-[#143e2e]">COP IT</strong> or <strong className="text-rose-700">DROP IT</strong>!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#e8e6e1] space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#111315] truncate">{product.name}</h4>
                  <span className="text-xs font-mono font-extrabold text-[#143e2e]">{formatINR(product.price)}</span>
                </div>
              </div>
              <div className="text-xs italic text-[#6e747c] pt-1">
                &ldquo;{squadQuestion}&rdquo;
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopySquadLink}
                className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {squadCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{squadCopied ? 'Squad Link Copied to Clipboard!' : 'Copy Voting Link for Friends'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hey! Should I buy ${product.name} (${formatINR(product.price)})? Give your vote on our Squad room: ${
                      typeof window !== 'undefined' ? `${window.location.origin}/squad?product=${product.id}&room=${roomCode}` : ''
                    }`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <Link
                  href={`/squad?product=${product.id}`}
                  className="py-3 rounded-full bg-[#111315] hover:bg-[#22252a] text-[#c5a059] font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Open Squad Room</span>
                </Link>
              </div>
            </div>

            <button
              onClick={() => setSquadModalOpen(false)}
              className="w-full text-center text-xs text-[#6e747c] hover:underline pt-1 cursor-pointer"
            >
              Continue Browsing Atelier
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-semibold text-stone-500 hover:text-[#143e2e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All References</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenSquadModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8] font-bold hover:bg-[#d2e4d8] transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ask Squad: &ldquo;Should I Buy It?&rdquo;</span>
            </button>
          </div>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-3 border border-stone-200/90 shadow-sm">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
                <Image
                  src={selectedImage || product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                />

                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#143e2e] text-white shadow-md">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border transition-all cursor-pointer shadow-sm shrink-0 ${
                      selectedImage === img
                        ? 'border-[#143e2e] ring-2 ring-[#143e2e]/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} angle ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details / Buy Box Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-500">
              <span className="uppercase tracking-wider text-[#143e2e] font-bold">{product.category}</span>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-stone-500">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif leading-tight">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-sm text-stone-600 font-normal leading-relaxed">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-stone-950">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm line-through text-stone-400 font-mono">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#143e2e]">
                      Save {formatINR(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Inclusive of all taxes (18% GST) • Free Pan-India Courier on ₹999+
              </p>

              {/* No-Cost EMI */}
              <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-800 font-medium">
                <Zap className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>No-Cost EMI from <strong className="font-mono text-stone-950">{formatINR(emiPerMonth)}/month</strong> on Indian credit cards</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* PIN Code Delivery Estimator */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-[#143e2e]" />
                <span>Pan-India Courier Feasibility (19,000+ PIN Codes)</span>
              </div>
              
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:border-[#143e2e] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-1.5 bg-[#143e2e] hover:bg-[#0e2c20] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeResult && (
                <p className="text-xs font-mono text-[#143e2e] font-medium pt-1">
                  ✓ {pincodeResult.deliveryMessage}
                </p>
              )}
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-full bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-950 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-950 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-stone-600 font-mono">
                  Subtotal: <strong className="text-stone-950">{formatINR(product.price * quantity)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3.5 rounded-full bg-stone-900 hover:bg-[#143e2e] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#143e2e]/25 cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>

                {/* SQUAD ROOM "SHOULD I BUY IT?" PROMINENT BUTTON */}
                <button
                  onClick={handleOpenSquadModal}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#143e2e] to-[#1c553f] hover:from-[#1b523d] hover:to-[#236b50] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group border border-emerald-500/30"
                >
                  <Users className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform" />
                  <span>Ask Squad: &ldquo;Should I Buy It?&rdquo; (Invite Friends to Vote)</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-3 gap-3 text-center text-[11px] text-stone-600">
              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                <Award className="w-4 h-4 text-[#143e2e] mx-auto mb-1" />
                <span>100% Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                <RotateCcw className="w-4 h-4 text-[#143e2e] mx-auto mb-1" />
                <span>7-Day Return</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
                <Shield className="w-4 h-4 text-[#143e2e] mx-auto mb-1" />
                <span>Brand Warranty</span>
              </div>
            </div>

          </div>

        </div>

        {/* SPECIFICATIONS & REVIEWS TABS */}
        <div className="mt-16 pt-10 border-t border-stone-200">
          <div className="flex border-b border-stone-200 gap-8 mb-8">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#143e2e] text-[#143e2e]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Atelier Engineering & Specs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-[#143e2e] text-[#143e2e]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>Verified Patron Reviews</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                {reviews.length || product.reviewCount}
              </span>
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-stone-900">Engineering Highlights</h3>
                <ul className="space-y-3">
                  {product.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#143e2e] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold font-serif text-stone-900">Technical Datasheet</h3>
                <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 text-xs shadow-sm">
                  {product.specs &&
                    Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-3.5">
                        <span className="text-stone-500 font-medium">{key}</span>
                        <span className="font-mono font-semibold text-stone-900 text-right">{val}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                    <span className="text-[11px] font-mono text-stone-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                      />
                    ))}
                    {rev.verified && (
                      <span className="ml-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">{rev.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-stone-200 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Related References in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-xs font-mono text-stone-500 block">Total</span>
          <span className="text-base font-extrabold font-mono text-stone-950">{formatINR(product.price * quantity)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSquadModal}
            className="p-3 rounded-full bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8] cursor-pointer"
            title="Ask Squad"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="px-5 py-3 rounded-full bg-[#143e2e] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            {added ? 'Added ✓' : 'Add to Bag'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
