'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart-store'
import { formatINR } from '@/lib/format'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Truck, ShieldCheck, ArrowUpRight } from 'lucide-react'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
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

  // Free shipping progress calculation for India (₹999 threshold)
  const freeShippingThreshold = 999
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  // Close drawer on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const res = applyPromo(promoInput)
    setPromoFeedback(res)
    if (res.success) {
      setPromoInput('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Department Bag</h2>
                <p className="text-xs text-stone-500 font-mono">{totalItems} {totalItems === 1 ? 'item' : 'items'} curated</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pan-India Free Delivery Progress Bar */}
          {items.length > 0 && (
            <div className="bg-emerald-50/70 px-6 py-3 border-b border-emerald-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#143e2e]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#143e2e] font-semibold">Complimentary Pan-India Courier Unlocked</span>
                  ) : (
                    <span>Add <strong className="text-stone-900 font-semibold">{formatINR(remainingForFreeShipping)}</strong> for Free Shipping</span>
                  )}
                </span>
                <span className="font-mono text-xs text-[#143e2e] font-bold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#143e2e] to-[#c5a059] transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore luxury electronics, Swiss timepieces, fine fragrances, and artisan goods.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
                >
                  Explore All 190+ Items
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 flex gap-4 items-center transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-stone-900 hover:text-[#143e2e] truncate transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-bold text-stone-900">
                        {formatINR(item.product.price)}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        (Incl. 18% GST)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                      <div className="flex items-center border border-stone-300 rounded-full bg-white p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-950 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-950 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-stone-800">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/50 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Coupon (ARKALUXURY, ARKA10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-[#143e2e] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p className={`text-[11px] font-medium ${promoFeedback.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {promoFeedback.message}
                  </p>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-[#143e2e] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-mono font-semibold">Active: {promoCode}</span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-stone-600 hover:text-stone-900 underline text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal (Inclusive of 18% GST)</span>
                  <span className="font-mono font-medium text-stone-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Privilege Discount</span>
                    <span className="font-mono">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier (Pan-India)</span>
                  <span className="font-mono">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Final Payable</span>
                  <span className="font-mono text-[#143e2e] text-base">{formatINR(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#143e2e]/25 group cursor-pointer"
                >
                  <span>Proceed to Indian Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-stone-600 hover:text-[#143e2e] text-xs font-semibold transition-colors"
                >
                  <span>View Full Bag Page with GST Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
