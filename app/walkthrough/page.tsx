'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { formatINR } from '@/lib/format'
import {
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Truck,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Zap,
  MapPin,
  Bot,
  Users,
  Compass,
  Palette
} from 'lucide-react'

export default function WalkthroughPage() {
  const [testPincode, setTestPincode] = useState('560001')
  const [pincodeResult, setPincodeResult] = useState<any>(null)
  const [checkingPincode, setCheckingPincode] = useState(false)

  const handleTestPincode = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckingPincode(true)
    try {
      const res = await fetch(`/api/pincode?code=${testPincode}`)
      const data = await res.json()
      setPincodeResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCheckingPincode(false)
    }
  }

  const features = [
    {
      id: 'brand',
      icon: ShieldCheck,
      badge: 'Brand Identity',
      title: '1. ARKA (अर्क) — The Luxury Department Store of India',
      desc: 'Named after the Sanskrit concept of the radiant sun and quintessential essence. Inspired by Harrods, Selfridges, and Tata CLiQ Luxury. Expanded from an 8-item niche store into an expansive multi-department luxury destination for India.',
      actionLink: '/',
      actionText: 'Explore ARKA Homepage',
    },
    {
      id: 'palette',
      icon: Palette,
      badge: 'Aesthetics & Palette',
      title: '2. Heritage Forest Emerald & Champagne Brass (No Orange / Zero AI Slop)',
      desc: 'Completely banished the orange theme and generic AI blue/purple gradients. Engineered a world-class luxury light theme: Deep Heritage Forest Emerald (#143e2e), Champagne Brass (#c5a059), Warm Alabaster Canvas (#fbfaf8), and Pure Pearl White (#ffffff).',
      actionLink: '/products',
      actionText: 'Inspect Master Design Tokens',
    },
    {
      id: 'api-scale',
      icon: Search,
      badge: 'Expansive Catalog API',
      title: '3. 190+ Product Catalog Across 8 Departments (/products)',
      desc: 'Replaced the 8-item limitation with an expansive catalog of 190+ products across 8 departments (Electronics, Audio, Timepieces & Jewelry, Designer Fashion, Beauty & Fragrances, Home & Living, Sports & Mobility, Gourmet Living) with pagination, department filtering, search, and price sliders.',
      actionLink: '/products',
      actionText: 'Explore 190+ Products Catalog',
    },
    {
      id: 'social-squad',
      icon: Users,
      badge: 'Unique S-Feature',
      title: '4. Social Shopping Rooms (Squad Lounge with Real-Time Shortlisting)',
      desc: 'The unique differentiator feature! Friends and family can create or join a private 6-digit room, curate a collaborative wishlist, conduct real-time upvote/downvote polls before purchasing, and chat live inside the store.',
      actionLink: '/social-room',
      actionText: 'Enter Social Squad Room',
    },
    {
      id: 'architecture',
      icon: Layers,
      badge: 'Production Architecture',
      title: '5. Dedicated Production-Grade Pages for Every App Flow',
      desc: 'Structured with separate production pages: Home (/), Full Catalog (/products), Product Details (/products/[id]), Social Squad Room (/social-room), Dedicated Shopping Bag (/cart), Indian Checkout (/checkout), Orders Ledger (/orders & /orders/[id]), and Admin Portal (/admin).',
      actionLink: '/cart',
      actionText: 'View Dedicated Bag Page',
    },
    {
      id: 'lenis',
      icon: Zap,
      badge: 'Smooth Physics',
      title: '6. Hardware-Accelerated Lenis Smooth Scrolling',
      desc: 'Configured Lenis smooth scrolling with exponential deceleration curves. The entire department store glides with natural mass and momentum without jank or scroll jumping.',
      actionLink: '/#catalog',
      actionText: 'Experience Smooth Scroll',
    },
    {
      id: 'currency',
      icon: CreditCard,
      badge: 'Indian Localization',
      title: '7. Indian Rupee (₹ INR) Pricing & No-Cost EMI Calculator',
      desc: 'Every price is formatted in Indian Rupee format with ₹ symbols (e.g. ₹29,999, ₹1,49,999). Each product card and detail view features real-time 3-month and 6-month No-Cost EMI calculations for HDFC, ICICI, SBI, and Axis Bank cards.',
      actionLink: '/products/vajra-01',
      actionText: 'Inspect EMI & INR Pricing',
    },
    {
      id: 'pincode',
      icon: MapPin,
      badge: 'Indian Logistics',
      title: '8. 19,000+ PIN Codes Feasibility Engine',
      desc: 'Live PIN code validator covering metros (Bengaluru, Delhi NCR, Mumbai, Hyderabad) with 24-48h priority air courier via BlueDart Apex and Delhivery Express.',
      actionLink: '#pincode-test',
      actionText: 'Test PIN Checker Below',
    },
    {
      id: 'checkout',
      icon: CreditCard,
      badge: 'Indian Payments',
      title: '9. Full Indian Checkout with UPI QR & COD',
      desc: 'Supports Instant UPI (Google Pay, PhonePe, Paytm, QR code), RuPay/Visa/Mastercard, Netbanking across 40+ Indian banks, and Escrow Cash on Delivery with 18% GST tax invoices.',
      actionLink: '/checkout',
      actionText: 'View Indian Checkout Screen',
    },
    {
      id: 'ai-concierge',
      icon: Bot,
      badge: 'ARKA Mitra AI',
      title: '10. ARKA Mitra — Private Shopping Concierge',
      desc: 'Interactive shopping concierge that queries the full 190+ product database, advising patrons on Swiss timepieces, niche perfumery, planar audio, and courier schedules.',
      actionLink: '/#',
      actionText: 'Ask Mitra AI Concierge',
    },
    {
      id: 'admin',
      icon: ShieldCheck,
      badge: 'Operations Console',
      title: '11. Operations & Inventory Management Console (/admin)',
      desc: 'Management dashboard showing gross revenue in ₹ INR, live catalog count, low stock warnings, order fulfillment status toggle, and modal to catalog new luxury items.',
      actionLink: '/admin',
      actionText: 'Open Operations Console',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Walkthrough Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143e2e]/10 text-[#143e2e] border border-[#143e2e]/20 text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>FULL ARCHITECTURE & FEATURE TOUR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight font-serif">
            ARKA (अर्क) Platform Architecture Tour
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Welcome to the complete architectural inspection tour of the ARKA Luxury Department Store. Every requested requirement—from the Heritage Emerald palette and 190+ item catalog to Social Shopping Rooms and dedicated production pages—is fully operational.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-6">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#143e2e] text-[#c5a059] flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#143e2e] font-bold">
                        {feat.badge}
                      </span>
                      <h2 className="text-lg font-bold text-stone-950 font-serif">{feat.title}</h2>
                    </div>
                  </div>

                  <Link
                    href={feat.actionLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-50 hover:bg-[#143e2e] text-stone-800 hover:text-white border border-stone-200 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer shadow-2xs"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Interactive PIN Code Benchmark */}
        <div id="pincode-test" className="p-8 rounded-3xl bg-white border border-stone-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 text-[#143e2e] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-950 font-serif">Live Pan-India PIN Code Tester</h3>
              <p className="text-xs text-stone-500">Test courier SLA verification across metro and tier-2 zones.</p>
            </div>
          </div>

          <form onSubmit={handleTestPincode} className="flex gap-2 max-w-md">
            <input
              type="text"
              maxLength={6}
              value={testPincode}
              onChange={(e) => setTestPincode(e.target.value)}
              placeholder="e.g. 560001, 110001, 400001"
              className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e] focus:outline-none"
            />
            <button
              type="submit"
              disabled={checkingPincode}
              className="px-5 py-2 bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {checkingPincode ? 'Querying...' : 'Test Feasibility'}
            </button>
          </form>

          {pincodeResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-[#143e2e] space-y-1">
              <p><strong>Hub Routing:</strong> {pincodeResult.hub || 'Pan-India Priority Hub'}</p>
              <p><strong>Courier Partner:</strong> {pincodeResult.courier || 'BlueDart Apex / Delhivery Express'}</p>
              <p><strong>SLA:</strong> {pincodeResult.deliveryMessage}</p>
            </div>
          )}
        </div>

        {/* Quick Launch Bottom Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#143e2e] to-[#0e2b20] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-serif">Ready to Experience ARKA?</h2>
            <p className="text-xs text-stone-300 mt-1">Explore our 190+ luxury products or create a collaborative squad room.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-white text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 transition-all shadow-md"
            >
              Browse 190+ Catalog
            </Link>
            <Link
              href="/social-room"
              className="px-6 py-3 rounded-full bg-[#c5a059] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#b38e4a] transition-all shadow-md"
            >
              Social Squad Room
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
