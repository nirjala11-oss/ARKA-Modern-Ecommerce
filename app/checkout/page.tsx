'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { formatINR } from '@/lib/format'
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  Lock,
  Tag,
  AlertCircle,
  Building2,
  QrCode,
  CheckCircle2,
  Smartphone
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    items,
    getSubtotal,
    getDiscount,
    getShipping,
    getGST,
    getTotalPrice,
    promoCode,
    applyPromo,
    removePromo,
    clearCart
  } = useCartStore()

  // Form states with Indian Defaults
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98450 12345',
    address: '402, Prestige Palms, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560038',
    country: 'India',
    paymentMethod: 'upi' as 'upi' | 'credit_card' | 'netbanking' | 'cod',
    upiId: 'aarav@okhdfcbank',
    gstin: '',
    wantsGstInvoice: false,
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
    }
  }, [user])

  const [promoInput, setPromoInput] = useState('')
  const [promoMsg, setPromoMsg] = useState<{ message: string; success: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = getShipping()
  const gst = getGST()
  const total = getTotalPrice()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput) return
    const res = applyPromo(promoInput)
    setPromoMsg(res)
    if (res.success) setPromoInput('')
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const orderPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          price: it.product.price,
          product: it.product,
        })),
        subtotal,
        discount,
        shipping,
        tax: gst,
        total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
        gstin: formData.wantsGstInvoice ? formData.gstin : undefined,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (data.success && data.order) {
        clearCart()
        router.push(`/orders/${data.order.id}`)
      } else {
        throw new Error(data.error || 'Failed to place order')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing checkout transaction')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto py-24 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 mx-auto shadow-sm">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">Checkout Bag is Empty</h2>
          <p className="text-xs text-stone-500">
            You do not have any items in your checkout bag. Explore our collection.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Explore Master Catalog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#143e2e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* Shipping Destination */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Truck className="w-4 h-4 text-[#143e2e]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-stone-900">
                    1. Pan-India Delivery Destination
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">Email Address (for GST invoice & tracking)</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-stone-700">Mobile Number (Indian +91 for courier OTP)</label>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-stone-700">Street Address & Landmark</label>
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">City</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">PIN Code (6 digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-stone-700">State / Union Territory</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#143e2e] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                </div>

                {/* GST Invoice Toggle for Indian B2B */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="wantsGstInvoice"
                      checked={formData.wantsGstInvoice}
                      onChange={handleInputChange}
                      className="rounded text-[#143e2e] focus:ring-[#143e2e]"
                    />
                    <span className="text-xs font-semibold text-stone-800">
                      Request Business GST Tax Invoice (18% Input Tax Credit)
                    </span>
                  </label>

                  {formData.wantsGstInvoice && (
                    <input
                      type="text"
                      name="gstin"
                      placeholder="e.g. 29AAACA9922K1Z9"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono uppercase text-stone-900"
                    />
                  )}
                </div>
              </div>

              {/* Payment Methods (Indian UPI, Cards, Netbanking, COD) */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Lock className="w-4 h-4 text-[#143e2e]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-stone-900">
                    2. Payment Protocol (Encrypted)
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'upi'
                        ? 'border-[#143e2e] bg-emerald-50 text-[#143e2e] font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#143e2e]" />
                    <span className="text-xs block">UPI / QR</span>
                    <span className="text-[10px] text-stone-400 font-normal">GPay, PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'credit_card'
                        ? 'border-[#143e2e] bg-emerald-50 text-[#143e2e] font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#143e2e]" />
                    <span className="text-xs block">Cards / EMI</span>
                    <span className="text-[10px] text-stone-400 font-normal">RuPay, Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'netbanking'
                        ? 'border-[#143e2e] bg-emerald-50 text-[#143e2e] font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-[#143e2e]" />
                    <span className="text-xs block">Net Banking</span>
                    <span className="text-[10px] text-stone-400 font-normal">HDFC, ICICI, SBI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#143e2e] bg-emerald-50 text-[#143e2e] font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1 text-[#143e2e]" />
                    <span className="text-xs block">Cash on Del.</span>
                    <span className="text-[10px] text-stone-400 font-normal">Doorstep pay</span>
                  </button>
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div className="space-y-3 pt-2 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                    <label className="text-[11px] font-semibold text-stone-700">Enter UPI Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="e.g. mobile@okhdfcbank or user@paytm"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e]"
                    />
                    <p className="text-[11px] text-stone-500">
                      A payment request will be triggered to your Google Pay / PhonePe / BHIM app upon clicking complete order.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'credit_card' && (
                  <div className="space-y-3 pt-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-700">Card Number (RuPay, Visa, Mastercard)</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-700">Valid Thru</label>
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-700">CVV</label>
                        <input
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#143e2e]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#143e2e]/25 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Order to Fulfillment Hub...' : `Confirm & Authorize Dispatch — ${formatINR(total)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-stone-900 border-b border-stone-100 pb-3">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{product.name}</h4>
                      <div className="text-[11px] text-stone-500 font-mono">Qty: {quantity}</div>
                    </div>
                    <span className="text-xs font-bold text-stone-950 font-mono">
                      {formatINR(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Input */}
              <form onSubmit={handleApplyPromo} className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. ARKALUXURY)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-[#143e2e] text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <p className={`text-[11px] font-medium ${promoMsg.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {promoMsg.message}
                  </p>
                )}
                {promoCode && (
                  <div className="flex justify-between items-center text-xs text-[#143e2e] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-semibold">Code: {promoCode}</span>
                    <button onClick={removePromo} className="underline text-[11px] cursor-pointer">Remove</button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
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
                  <span>Pan-India Courier</span>
                  <span className="font-mono">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 pt-3 border-t border-stone-200">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#143e2e] text-lg">{formatINR(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
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
