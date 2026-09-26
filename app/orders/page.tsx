'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Order } from '@/types'
import { formatINR } from '@/lib/format'
import { Package, ArrowRight, Clock, ChevronRight } from 'lucide-react'

export default function OrdersArchivePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        if (data.success && data.orders) {
          setOrders(data.orders)
        }
      } catch (err) {
        console.error('Failed to load orders archive', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const statusBadges: Record<string, string> = {
    pending: 'bg-stone-100 text-stone-700',
    processing: 'bg-emerald-50 text-[#143e2e] border border-emerald-200',
    shipped: 'bg-blue-50 text-blue-800 border border-blue-200',
    delivered: 'bg-emerald-100 text-[#143e2e] border border-emerald-300',
    cancelled: 'bg-rose-50 text-rose-800 border border-rose-200',
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold mb-1">
              Indian Dispatch Ledger
            </div>
            <h1 className="text-2xl font-extrabold text-stone-950 font-serif">Order Archive & BlueDart / Delhivery Tracking</h1>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#143e2e] hover:underline flex items-center gap-1"
          >
            <span>Browse Master Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#143e2e] border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-stone-500">Loading ledger dispatches...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-white border border-stone-200 shadow-sm">
            <Package className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800 font-serif">No Orders Recorded</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our reference planar audio, horology, and fine perfumery.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 rounded-full bg-[#143e2e] text-white font-bold text-xs shadow-md"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <Link
                key={ord.id}
                href={`/orders/${ord.id}`}
                className="block p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#143e2e]/40 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-stone-900">#{ord.id}</span>
                      <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold ${statusBadges[ord.status] || 'bg-stone-100 text-stone-700'}`}>
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{new Date(ord.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      <span>•</span>
                      <span>{ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}</span>
                      <span>•</span>
                      <span className="font-mono">{ord.city}, {ord.state}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <div className="text-xs text-stone-400 uppercase font-mono">Total Paid</div>
                      <div className="text-base font-bold font-mono text-[#143e2e]">{formatINR(ord.total)}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#143e2e] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100 overflow-x-auto">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 shrink-0">
                      <div className="relative w-6 h-6 rounded overflow-hidden bg-white">
                        <Image src={it.product.image} alt={it.product.name} fill className="object-cover" />
                      </div>
                      <span className="text-[11px] font-medium text-stone-800 max-w-[140px] truncate">{it.product.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">×{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
