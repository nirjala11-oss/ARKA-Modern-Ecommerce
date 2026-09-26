'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { ProductCard } from '@/components/ProductCard'
import { INITIAL_PRODUCTS } from '@/lib/products-data'
import { formatINR } from '@/lib/format'
import {
  Flame,
  Timer,
  Tag,
  Sparkles,
  Percent,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react'

export default function DealsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 24, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Filter products with originalPrice discounts
  const dealProducts = INITIAL_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Hero Banner with Countdown Timer */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c2b1e] via-[#143e2e] to-[#0a1f16] text-white p-8 sm:p-12 shadow-xl border border-emerald-900/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-[#c5a059]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PAN-INDIA ATELIER PRIVILEGE DROPS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight leading-tight">
              Exclusive Luxury Drops & Seasonal Privilege
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Limited-allotment references with preferential pricing, complimentary Pan-India express delivery, and additional 10% Squad room checkout perks.
            </p>

            {/* Countdown Box */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs font-mono uppercase text-[#c5a059] font-bold flex items-center gap-1.5">
                <Timer className="w-4 h-4" />
                <span>Drop Ends In:</span>
              </span>
              <div className="flex items-center gap-2 font-mono font-extrabold text-base">
                <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Promo Coupons Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#e8e6e1] shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#143e2e] font-bold">10% Off First Atelier Order</span>
              <h4 className="font-bold text-sm text-[#111315]">Code: ARKALUXE10</h4>
              <p className="text-[11px] text-[#6e747c]">Applicable on all orders above ₹4,999</p>
            </div>
            <button
              onClick={() => copyCoupon('ARKALUXE10')}
              className="px-3 py-1.5 rounded-xl bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8] text-xs font-mono font-bold hover:bg-[#d2e4d8] transition-colors cursor-pointer shrink-0"
            >
              {copiedCode === 'ARKALUXE10' ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e8e6e1] shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#c5a059] font-bold">Squad Room Consensus Perk</span>
              <h4 className="font-bold text-sm text-[#111315]">Code: SQUADWIN15</h4>
              <p className="text-[11px] text-[#6e747c]">Flat 15% off when friends vote COP IT</p>
            </div>
            <button
              onClick={() => copyCoupon('SQUADWIN15')}
              className="px-3 py-1.5 rounded-xl bg-[#fbf6ec] text-[#c5a059] border border-[#f0e3cc] text-xs font-mono font-bold hover:bg-[#f5ebd2] transition-colors cursor-pointer shrink-0"
            >
              {copiedCode === 'SQUADWIN15' ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e8e6e1] shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#143e2e] font-bold">Pan-India Express Free</span>
              <h4 className="font-bold text-sm text-[#111315]">Free Courier Delivery</h4>
              <p className="text-[11px] text-[#6e747c]">Auto-applied on all orders across 19,000+ PINs</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>

        {/* Featured Deals Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e8e6e1]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#111315]">
                Special Privilege Price Allotments ({dealProducts.length})
              </h2>
              <p className="text-xs text-[#6e747c]">
                Curated references currently enjoying special direct-from-atelier savings.
              </p>
            </div>
            <Link
              href="/squad"
              className="text-xs font-bold text-[#143e2e] hover:underline flex items-center gap-1"
            >
              <span>Ask Squad to vote on these</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
