'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Product, Order, OrderStatus } from '@/types'
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
  ExternalLink,
  ShieldAlert,
  Trash2,
  Store,
  Users,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Database
} from 'lucide-react'

interface SellerMetric {
  id: string
  name: string
  email: string
  phone?: string
  storeName: string
  activeListings: number
  totalInventoryUnits: number
  catalogValuation: number
  verified: boolean
  joinedDate: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'seller' | 'admin'
  avatar?: string
  storeName?: string
  isDemo?: boolean
  demoPassword?: string
}

export default function AdminConsolePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [sellers, setSellers] = useState<SellerMetric[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'sellers' | 'users'>('inventory')
  const [filterSearch, setFilterSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Form for adding new product
  const [newProd, setNewProd] = useState({
    name: '',
    subtitle: '',
    category: 'Timepieces & Jewelry',
    price: 34999,
    originalPrice: 42999,
    description: '',
    stock: 15,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  })
  const [isSubmittingProd, setIsSubmittingProd] = useState(false)

  const showNotification = (msg: string) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(null), 3500)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pRes, oRes, sRes, uRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders'),
        fetch('/api/admin/sellers'),
        fetch('/api/admin/users'),
      ])
      const pData = await pRes.json()
      const oData = await oRes.json()
      const sData = await sRes.json()
      const uData = await uRes.json()

      if (pData.success && pData.products) setProducts(pData.products)
      if (oData.success && oData.orders) setOrders(oData.orders)
      if (sData.success && sData.sellers) setSellers(sData.sellers)
      if (uData.success && uData.users) setUsers(uData.users)
    } catch (err) {
      console.error('Failed to load admin telemetry', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`ADMIN OVERRIDE: Permanently delete "${name}" from the ARKA platform?`)) {
      return
    }
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        showNotification(`✓ Product "${name}" was permanently removed by Admin.`)
      }
    } catch (err) {
      console.error('Admin delete failed', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleQuickStockUpdate = async (id: string, delta: number) => {
    const item = products.find((p) => p.id === id)
    if (!item) return
    const newStock = Math.max(0, (item.stock || 0) + delta)

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    )

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })
      showNotification(`Stock adjusted to ${newStock} units`)
    } catch (err) {
      console.error('Stock patch failed', err)
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProd.name || !newProd.price) return
    setIsSubmittingProd(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          sellerId: 'admin-curated',
          sellerName: 'ARKA Heritage Reserve',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => [data.product, ...prev])
        setIsAddModalOpen(false)
        showNotification(`✓ New reference "${data.product.name}" published globally!`)
        setNewProd({
          name: '',
          subtitle: '',
          category: 'Timepieces & Jewelry',
          price: 34999,
          originalPrice: 42999,
          description: '',
          stock: 15,
          badge: 'New',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
        })
      }
    } catch (err) {
      console.error('Failed to catalog product', err)
    } finally {
      setIsSubmittingProd(false)
    }
  }

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
  const lowStockProductsCount = products.filter((p) => p.stock < 10).length

  // Filtered lists
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(filterSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(filterSearch.toLowerCase())
  )

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
    o.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    o.city.toLowerCase().includes(filterSearch.toLowerCase())
  )

  const filteredSellers = sellers.filter((s) =>
    s.storeName.toLowerCase().includes(filterSearch.toLowerCase()) ||
    s.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(filterSearch.toLowerCase())
  )

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(filterSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(filterSearch.toLowerCase()) ||
    (u.storeName && u.storeName.toLowerCase().includes(filterSearch.toLowerCase()))
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Toast Notification */}
        {actionMessage && (
          <div className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-[#143e2e] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-right-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Bengaluru Central Headquarters • Full Platform Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
              ARKA Atelier Operations & Control Desk
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/seller"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>Seller Studio Preview</span>
            </Link>
            <button
              onClick={() => fetchData()}
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer shadow-xs"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#c5a059]" />
              <span>Catalog Master Item</span>
            </button>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Gross Merch Value</span>
              <IndianRupee className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{formatINR(totalRevenue)}</div>
            <div className="text-[11px] text-stone-400 font-mono">Pan-India confirmed sales</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Total Dispatches</span>
              <ShoppingBag className="w-4 h-4 text-[#143e2e]" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{orders.length}</div>
            <div className="text-[11px] text-stone-400 font-mono">Managed via BlueDart / Delhivery</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Master Catalog</span>
              <Layers className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{products.length}</div>
            <div className="text-[11px] text-stone-400 font-mono">{lowStockProductsCount} low stock alerts</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-mono uppercase font-semibold">Artisan Partners</span>
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950">{sellers.length || 1}</div>
            <div className="text-[11px] text-amber-700 font-medium">Verified Merchant Boutiques</div>
          </div>
        </div>

        {/* Tab Controls & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setActiveTab('inventory'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              Master Catalog ({products.length})
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              All India Orders ({orders.length})
            </button>
            <button
              onClick={() => { setActiveTab('sellers'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sellers'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              Seller Boutiques ({sellers.length || 1})
            </button>
            <button
              onClick={() => { setActiveTab('users'); setFilterSearch('') }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#143e2e] text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              Users & Demo Accounts ({users.length || 4})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#143e2e] focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* TAB 1: MASTER INVENTORY WITH DELETE & STOCK MANAGEMENT */}
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
                    <th className="py-4 px-4">Seller Boutique</th>
                    <th className="py-4 px-6 text-right">Admin Actions</th>
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
                          <span className="text-[10px] text-stone-400 font-mono">ID: {p.id}</span>
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
                            onClick={() => handleQuickStockUpdate(p.id, 10)}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                            title="Admin Stock Boost: +10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, -1)}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                            title="Decrement 1 unit"
                          >
                            -1
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-stone-600 truncate max-w-[140px]">
                        {p.sellerName || 'ARKA Reserve'}
                      </td>
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
                            title="Admin: Delete product permanently"
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

        {/* TAB 2: GLOBAL ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500 font-bold">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-4">Customer & City</th>
                    <th className="py-4 px-4">Booking Date</th>
                    <th className="py-4 px-4">Order Value</th>
                    <th className="py-4 px-4">Courier Lifecycle</th>
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
                          <option value="pending">Pending</option>
                          <option value="processing">Processing Hub</option>
                          <option value="shipped">BlueDart Dispatched</option>
                          <option value="delivered">Delivered to Doorstep</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-[11px]">
                        <Link href={`/orders/${ord.id}`} className="text-[#143e2e] hover:underline font-bold">
                          View Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SELLER BOUTIQUES & PARTNER MANAGEMENT */}
        {activeTab === 'sellers' && (
          <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500 font-bold">
                  <tr>
                    <th className="py-4 px-6">Boutique & Artisan</th>
                    <th className="py-4 px-4">Contact & Email</th>
                    <th className="py-4 px-4">Active Listings</th>
                    <th className="py-4 px-4">Inventory Units</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center font-bold text-xs border border-[#d2e4d8]">
                            <Store className="w-5 h-5 text-[#143e2e]" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-950">{seller.storeName}</div>
                            <div className="text-[11px] text-stone-500">{seller.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="text-stone-900">{seller.email}</div>
                        <div className="text-stone-400 text-[11px]">{seller.phone || '+91 Verified'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-950">
                        {seller.activeListings} items
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-700">
                        {seller.totalInventoryUnits} units
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Authorized</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          href="/seller"
                          className="text-[11px] font-bold text-[#143e2e] hover:underline"
                        >
                          Audit Studio →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS & DEMO ACCOUNTS GOVERNANCE */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Demo Accounts Quick-Reference Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#f5f3ef] to-[#ebe7de] border border-[#d8d3c5] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#143e2e]">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Self-Contained File Database Engine</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    Pre-Seeded Demo Personas (Instant 1-Click Access)
                  </h3>
                  <p className="text-xs text-stone-600">
                    All accounts are persisted in <code className="px-1.5 py-0.5 rounded bg-white/80 font-mono text-[11px] text-stone-800 border border-stone-300">data/users.json</code>. No external database or setup required. Works seamlessly on any local computer and in Vercel serverless deployments.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold whitespace-nowrap self-start sm:self-auto">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>JSON File DB Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#c5a059] uppercase">Atelier Admin</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Full Access</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">admin@ecommerce.com</div>
                  <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-stone-400" />
                    <span>Password: <strong className="text-stone-900">admin123</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">Artisan Seller</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Seller Studio</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">seller@ecommerce.com</div>
                  <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-stone-400" />
                    <span>Password: <strong className="text-stone-900">seller123</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#143e2e] uppercase">VIP Client</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">Customer</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">user@example.com</div>
                  <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-stone-400" />
                    <span>Password: <strong className="text-stone-900">user123</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Master Registry Table */}
            <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono uppercase text-stone-500 font-bold">
                    <tr>
                      <th className="py-4 px-6">User / Identity</th>
                      <th className="py-4 px-4">Email & Phone</th>
                      <th className="py-4 px-4">Role</th>
                      <th className="py-4 px-4">Account Type</th>
                      <th className="py-4 px-4">Database Source</th>
                      <th className="py-4 px-6 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-stone-400">
                          No users matched &quot;{filterSearch}&quot;
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#143e2e] text-[#c5a059] flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                                {u.avatar || u.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-stone-950 flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.isDemo && (
                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                      DEMO
                                    </span>
                                  )}
                                </div>
                                {u.storeName && (
                                  <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                                    <Store className="w-3 h-3" />
                                    <span>{u.storeName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <div className="text-stone-900 font-medium">{u.email}</div>
                            <div className="text-stone-400 text-[11px]">{u.phone || 'No phone set'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                u.role === 'admin'
                                  ? 'bg-[#edf5f0] text-[#143e2e] border-[#d2e4d8]'
                                  : u.role === 'seller'
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-stone-100 text-stone-800 border-stone-200'
                              }`}
                            >
                              {u.role === 'admin' ? '👑 Atelier Director (Admin)' : u.role === 'seller' ? '🏪 Artisan Seller' : '👤 VIP Customer'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {u.isDemo ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800">
                                  <Sparkles className="w-3 h-3 text-[#c5a059]" />
                                  <span>Pre-Seeded Demo</span>
                                </span>
                                <div className="text-[10px] font-mono text-stone-500">
                                  Pass: <span className="font-bold text-stone-800">{u.demoPassword || 'user123'}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Active Registered</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                            data/users.json
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <Link
                              href="/login"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#143e2e] hover:underline"
                            >
                              Test Login →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Admin Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-950 font-serif">Catalog Reference (Admin Authority)</h3>
                <p className="text-[11px] text-stone-500 font-mono">Global direct release to all 19,000+ PIN codes</p>
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
                  placeholder="e.g. ARKA Grand Royal Tourbillon"
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
                    <option value="Timepieces & Jewelry">Timepieces & Jewelry</option>
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Designer Fashion">Designer Fashion</option>
                    <option value="Beauty & Fragrances">Beauty & Fragrances</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Sports & Mobility">Sports & Mobility</option>
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
                    <option value="Eco">Eco</option>
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
                  placeholder="e.g. Swiss automatic tourbillon with sapphire crystal"
                  value={newProd.subtitle}
                  onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:border-[#143e2e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Craft, materials, provenance..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 resize-none focus:border-[#143e2e]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingProd}
                  className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSubmittingProd ? 'Publishing...' : 'Publish to Live Indian Catalog'}
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
