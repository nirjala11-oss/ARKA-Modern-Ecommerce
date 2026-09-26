'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCartStore } from '@/stores/cart-store'
import { formatINR } from '@/lib/format'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscount,
    getShipping,
    getGST,
    getTotalPrice,
    promoCode,
    applyPromo,
    removePromo,
    getTotalItems
  } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; success: boolean } | null>(null)

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = getShipping()
  const gst = getGST()
  const total = getTotalPrice()
  const totalItems = getTotalItems()

  const freeShippingThreshold = 999
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const res = applyPromo(promoInput)
    setPromoFeedback(res)
    if (res.success) setPromoInput('')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto py-24 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#e8e6e1] flex items-center justify-center text-[#d6d3cb] mx-auto shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#111315]">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-[#6e747c] max-w-sm mx-auto">
            You have not added any department instruments or apparel yet. Explore our 190+ catalog products.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Browse Department Catalog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e6e1]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#143e2e] font-bold">
              Review Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111315]">
              Shopping Bag ({totalItems} items)
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143e2e] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free shipping progress bar */}
        <div className="p-4 rounded-2xl bg-[#edf5f0] border border-[#d2e4d8] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#143e2e] font-bold">
              <Truck className="w-4 h-4" />
              {remainingForFreeShipping === 0 ? (
                <span>Free Express Pan-India Courier Unlocked!</span>
              ) : (
                <span>Add <strong className="font-mono">{formatINR(remainingForFreeShipping)}</strong> more for Free Pan-India Delivery</span>
              )}
            </span>
            <span className="font-mono font-bold text-[#143e2e]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-[#d2e4d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#143e2e] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Cart items list (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-5 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#f4f2ee] shrink-0 border border-[#e8e6e1]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#c5a059] font-bold">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`} className="text-sm font-bold text-[#111315] hover:text-[#143e2e] block truncate">
                      {product.name}
                    </Link>
                    <div className="text-xs font-mono text-[#6e747c]">
                      Unit Price: {formatINR(product.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f4f2ee]">
                  <div className="flex items-center border border-[#e8e6e1] rounded-xl bg-[#fbfaf8] p-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#6e747c] hover:text-[#111315] hover:bg-[#eae7e1] rounded-lg cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-mono text-xs font-bold text-[#111315]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#6e747c] hover:text-[#111315] hover:bg-[#eae7e1] rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-extrabold font-mono text-[#111315] min-w-[90px] text-right">
                    {formatINR(product.price * quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-[#6e747c] hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-[#6e747c] hover:text-rose-600 underline cursor-pointer"
              >
                Clear entire bag
              </button>
              <Link href="/social-room" className="text-xs font-semibold text-[#143e2e] hover:underline">
                Share Bag with Social Squad Room →
              </Link>
            </div>
          </div>

          {/* Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111315] border-b border-[#f4f2ee] pb-3">
                Order Ledger
              </h3>

              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. ARKA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111315] hover:bg-[#143e2e] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p className={`text-[11px] font-semibold ${promoFeedback.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {promoFeedback.message}
                  </p>
                )}
                {promoCode && (
                  <div className="flex justify-between items-center text-xs text-[#143e2e] bg-[#edf5f0] px-3 py-1.5 rounded-lg border border-[#d2e4d8]">
                    <span className="font-semibold font-mono">Active: {promoCode}</span>
                    <button onClick={removePromo} className="underline text-[11px] cursor-pointer">Remove</button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#6e747c] pt-3 border-t border-[#f4f2ee]">
                <div className="flex justify-between">
                  <span>Subtotal (Inclusive of 18% GST)</span>
                  <span className="font-mono font-medium text-[#111315]">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Courier</span>
                  <span className="font-mono">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#111315] pt-3 border-t border-[#e8e6e1]">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#143e2e] text-xl">{formatINR(total)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#143e2e]/20 group cursor-pointer"
              >
                <span>Proceed to Indian Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#6e747c] font-mono justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted Indian Banking Gateway</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
