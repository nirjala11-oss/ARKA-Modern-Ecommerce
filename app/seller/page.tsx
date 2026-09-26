'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Product, Order, OrderStatus } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import { formatINR } from '@/lib/format'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  RefreshCw,
  X,
  Trash2,
  Store,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'

export default function SellerStudioPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory')
  const [filterSearch, setFilterSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // New product form for seller
  const [newProd, setNewProd] = useState({
    name: '',
    subtitle: '',
    category: 'Audio',
    price: 14999,
    originalPrice: 19999,
    description: '',
    stock: 30,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders'),
      ])
      const pData = await pRes.json()
      const oData = await oRes.json()

      if (pData.success && pData.products) {
        // In our demo, show all products or filtered by sellerId
        const sellerId = user?.id || 'user-seller-01'
        const myItems = pData.products.filter(
          (p: Product) => p.sellerId === sellerId || p.sellerName === user?.storeName || p.id.startsWith('arka-item-')
        )
        // If empty, show first 12 items for rich demo
        setProducts(myItems.length > 0 ? myItems : pData.products.slice(0, 12))
      }
      if (oData.success && oData.orders) {
        setOrders(oData.orders)
      }
    } catch (err) {
      console.error('Failed to load seller telemetry', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const showNotification = (msg: string) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(null), 3500)
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProd.name || !newProd.price) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          sellerId: user?.id || 'user-seller-01',
          sellerName: user?.storeName || 'Saffron & Stone Atelier',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => [data.product, ...prev])
        setIsAddModalOpen(false)
        showNotification(`✓ Listing "${data.product.name}" is now live in the ARKA catalog!`)
        setNewProd({
          name: '',
          subtitle: '',
          category: 'Audio',
          price: 14999,
          originalPrice: 19999,
          description: '',
          stock: 30,
          badge: 'New',
          image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        })
      }
    } catch (err) {
      console.error('Error creating product', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from your catalog?`)) {
      return
    }
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        showNotification(`✓ "${name}" has been decommissioned from your store.`)
      }
    } catch (err) {
      console.error('Error deleting product', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleQuickStockUpdate = async (id: string, delta: number) => {
    const item = products.find((p) => p.id === id)
    if (!item) return
    const newStock = Math.max(0, (item.stock || 0) + delta)

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    )

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })
      showNotification(`Stock for ${item.name.slice(0, 16)}... updated to ${newStock} units`)
    } catch (err) {
      console.error('Failed to update stock', err)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        )
        showNotification(`Order #${orderId} marked as ${status.toUpperCase()}`)
      }
    } catch (err) {
      console.error('Failed to update order status', err)
    }
  }

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(filterSearch.toLowerCase())
  )

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      o.name.toLowerCase().includes(filterSearch.toLowerCase())
  )

  const totalStoreValue = products.reduce((acc, p) => acc + p.price * (p.stock || 1), 0)
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  const lowStockCount = products.filter((p) => p.stock < 10).length

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Toast Action Notification */}
        {actionMessage && (
          <div className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-[#143e2e] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-right-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Merchant Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#143e2e] to-[#0a2016] text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b523d] text-[#c5a059] text-[11px] font-mono font-bold">
                <Store className="w-3.5 h-3.5" />
                <span>VERIFIED ARTISAN MERCHANT PARTNER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-[#fbfaf8]">
                {user?.storeName || 'Saffron & Stone Atelier'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
                Merchant Operations Console: Manage boutique inventory, monitor customer dispatches across India, and publish handcrafted references.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fetchData()}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                title="Sync store inventory"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#c5a059] hover:bg-[#b38d45] text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Publish New Listing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Store Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Active Listings</span>
              <Package className="w-4 h-4 text-[#143e2e]" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{products.length}</div>
            <div className="text-[11px] text-emerald-700 font-medium">Published in ARKA Catalog</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Stock Valuation</span>
              <IndianRupee className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{formatINR(totalStoreValue)}</div>
            <div className="text-[11px] text-stone-400 font-mono">{totalUnits} units on shelves</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Store Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{orders.length}</div>
            <div className="text-[11px] text-stone-400 font-mono">Pan-India buyer bookings</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Low Stock Alerts</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{lowStockCount}</div>
            <div className="text-[11px] text-amber-700 font-medium">Items under 10 units</div>
          </div>
        </div>

        {/* Tab Controls & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('inventory'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              My Store Inventory ({products.length})
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              Orders & Dispatches ({orders.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#143e2e] focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* TAB 1: INVENTORY & STOCK MANAGEMENT TABLE */}
        {activeTab === 'inventory' && (
          <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500 font-bold">
                  <tr>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-4">Department</th>
                    <th className="py-4 px-4">Price (₹)</th>
                    <th className="py-4 px-4">Stock & Quick Replenish</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-6 flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link href={`/products/${p.id}`} className="font-bold text-stone-950 hover:text-[#143e2e] truncate block">
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-600">{p.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-950">{formatINR(p.price)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs px-2.5 py-0.5 rounded font-bold ${
                              p.stock < 10
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {p.stock} pcs
                          </span>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, 5)}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                            title="Quick replenish +5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, -1)}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                            title="Decrement -1 unit"
                          >
                            -1
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-600 font-bold">{p.rating} ★</td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            href={`/products/${p.id}`}
                            className="text-[11px] font-semibold text-[#143e2e] hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs transition-colors cursor-pointer disabled:opacity-50"
                            title="Permanently remove listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS FULFILLMENT TABLE */}
        {activeTab === 'orders' && (
          <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500 font-bold">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-4">Buyer & Destination</th>
                    <th className="py-4 px-4">Timestamp</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Courier Status</th>
                    <th className="py-4 px-6 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-stone-950">
                        <Link href={`/orders/${ord.id}`} className="hover:text-[#143e2e]">
                          #{ord.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{ord.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{ord.city}, {ord.state}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#143e2e]">
                        {formatINR(ord.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-900 focus:border-[#143e2e] cursor-pointer shadow-xs"
                        >
                          <option value="pending">Pending Courier</option>
                          <option value="processing">Packed in Atelier</option>
                          <option value="shipped">BlueDart In Transit</option>
                          <option value="delivered">Delivered to Buyer</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-[11px]">
                        <Link href={`/orders/${ord.id}`} className="text-[#143e2e] hover:underline font-bold">
                          View Slip
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add Product Modal for Seller */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-950 font-serif">Add Reference to Atelier</h3>
                <p className="text-[11px] text-stone-500 font-mono">Published under {user?.storeName || 'Saffron & Stone'}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Acoustic Heritage Turntable"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:border-[#143e2e] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Department</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:border-[#143e2e]"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Timepieces & Jewelry">Timepieces & Jewelry</option>
                    <option value="Designer Fashion">Designer Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Gourmet Living">Gourmet Living</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono focus:border-[#143e2e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono focus:border-[#143e2e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Badge</label>
                  <select
                    value={newProd.badge}
                    onChange={(e) => setNewProd({ ...newProd, badge: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:border-[#143e2e]"
                  >
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Featured">Featured</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono text-xs focus:border-[#143e2e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Subtitle / Provenance</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted walnut wood plinth with Ortofon cartridge"
                  value={newProd.subtitle}
                  onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:border-[#143e2e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Description</label>
                <textarea
                  rows={2}
                  placeholder="Materials, acoustic response, craftsmanship..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 resize-none focus:border-[#143e2e]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to ARKA Luxe Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
