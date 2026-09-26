'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Order } from '@/types'
import { formatINR } from '@/lib/format'
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react'

export default function OrderConfirmationPage() {
  const params = useParams()
  const id = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadOrder() {
      if (!id) return
      try {
        const res = await fetch(`/api/orders/${id}`)
        const data = await res.json()
        if (data.success && data.order) {
          setOrder(data.order)
        }
      } catch (err) {
        console.error('Failed to load order', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#143e2e] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-stone-500">Retrieving order telemetry...</span>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-serif">Order Not Located</h2>
          <p className="text-xs text-stone-500">Order #{id} could not be retrieved from the central Indian ledger.</p>
          <Link href="/orders" className="inline-block px-6 py-2.5 rounded-full bg-[#143e2e] text-white font-bold text-xs shadow-md">
            View All Orders
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const steps = [
    { title: 'Authorized', desc: 'UPI / Payment confirmed', done: true },
    { title: 'Processing', desc: 'Bengaluru / Delhi Hub', done: order.status !== 'cancelled' },
    { title: 'Dispatched', desc: 'Delhivery / BlueDart Priority', done: order.status === 'shipped' || order.status === 'delivered' },
    { title: 'Delivered', desc: 'White-glove verification complete', done: order.status === 'delivered' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#143e2e] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#143e2e] bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
            Order Confirmation Protocol
          </div>
          <h1 className="text-3xl font-extrabold text-stone-950 font-serif">
            Dispatch Successfully Authorized
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Order <strong className="text-stone-900 font-mono">#{order.id}</strong> has been logged. An encrypted GST tax invoice has been sent to <strong className="text-stone-900">{order.email}</strong>.
          </p>
        </div>

        {/* Tracking & Timeline Card */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase font-semibold">Courier Tracking (BlueDart / Delhivery Priority)</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold font-mono text-stone-900">{order.trackingNumber}</span>
                <button
                  onClick={copyTracking}
                  className="p-1 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="Copy tracking number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print GST Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Step Progress Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={i} className="relative space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      st.done
                        ? 'bg-[#143e2e] text-white'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-xs font-bold ${st.done ? 'text-stone-900' : 'text-stone-400'}`}>
                    {st.title}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 pl-8">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Items In Order */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold border-b border-stone-100 pb-2">
              Items in Dispatch ({order.items.length})
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id || item.productId} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</h4>
                    <span className="text-[11px] font-mono text-stone-500">Qty: {item.quantity} × {formatINR(item.price)}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-stone-950">
                    {formatINR(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient & Financials */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold border-b border-stone-100 pb-2">
              Destination & Tax Invoice
            </h3>

            <div className="text-xs text-stone-700 space-y-1">
              <p className="font-bold text-stone-950">{order.name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.zipCode}, {order.country}</p>
              <p className="text-stone-500 font-mono mt-1">{order.email} • {order.phone}</p>
              <p className="text-[11px] text-stone-500 font-mono pt-1">Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal (Inclusive of 18% GST)</span>
                <span className="font-mono font-medium text-stone-900">{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Discount</span>
                  <span className="font-mono">-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Freight</span>
                <span className="font-mono">
                  {order.shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Total Paid</span>
                <span className="font-mono text-[#143e2e] text-base">{formatINR(order.total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="flex justify-center pt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <span>Continue Exploring Master Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#c5a059]" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
