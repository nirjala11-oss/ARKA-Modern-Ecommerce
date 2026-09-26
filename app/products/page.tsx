'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { AIChatModal } from '@/components/AIChatModal'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Sparkles,
  ArrowRight,
  Layers,
  X,
  Flame,
  Check
} from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [priceFilter, setPriceFilter] = useState('all')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'Audio', name: 'Planar & Hi-Fi Audio' },
    { id: 'Computing', name: 'Desk & Computing' },
    { id: 'Wearables', name: 'Smart Wearables' },
    { id: 'Workspace', name: 'Smart Workspace' },
    { id: 'Timepieces & Jewelry', name: 'Timepieces & Jewelry' },
    { id: 'Lifestyle', name: 'Modular Carry & Bags' },
    { id: 'Designer Fashion', name: 'Designer Fashion' },
    { id: 'Beauty & Fragrances', name: 'Beauty & Fragrances' },
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      if (sortBy !== 'featured') params.append('sort', sortBy)
      params.append('page', page.toString())
      params.append('limit', '20')

      if (priceFilter === 'under-10000') {
        params.append('maxPrice', '10000')
      } else if (priceFilter === '10000-25000') {
        params.append('minPrice', '10000')
        params.append('maxPrice', '25000')
      } else if (priceFilter === '25000-50000') {
        params.append('minPrice', '25000')
        params.append('maxPrice', '50000')
      } else if (priceFilter === 'above-50000') {
        params.append('minPrice', '50000')
      }

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('Error fetching catalog:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const cat = urlParams.get('category')
      if (cat) setSelectedCategory(cat)
      const q = urlParams.get('search')
      if (q) setSearchQuery(q)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, priceFilter, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
      <CartDrawer />
      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Banner with Squad Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0c2b1e] via-[#143e2e] to-[#0a2016] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-bold">
              ARKA MASTER CATALOG ARCHIVE • 200+ REFERENCES
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-tight">
              Curated Luxury Hardware & Horology
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Every reference is BIS safety certified, includes 18% GST invoice for corporate ITC, and delivers nationwide via BlueDart Air Priority.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/squad"
              className="px-5 py-3 rounded-full bg-[#c5a059] hover:bg-[#b38e4a] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-zinc-950" />
              <span>&ldquo;Should I Buy It?&rdquo; Squad</span>
            </Link>
            <Link
              href="/deals"
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Privilege Drops</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e6e1] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e747c]" />
              <input
                type="text"
                placeholder="Search titanium, planar audio, 65% keyboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] placeholder:text-[#6e747c] focus:border-[#143e2e] focus:bg-white focus:outline-none"
              />
            </form>

            {/* Quick Sort & Price Desktop Filters */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e747c]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:outline-none"
                >
                  <option value="featured">Featured Atelier Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated (4.8+)</option>
                  <option value="newest">Newly Introduced</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6e747c]">Price:</span>
                <select
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="under-10000">Under ₹10,000</option>
                  <option value="10000-25000">₹10,000 – ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value="above-50000">₹50,000+ Luxury Complication</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="sm:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#f4f2ee] text-[#111315] text-xs font-bold border border-[#e8e6e1]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#143e2e]" />
              <span>Filters & Sort</span>
            </button>
          </div>

          {/* Mobile Filter Panel (Collapsible) */}
          {mobileFilterOpen && (
            <div className="sm:hidden pt-3 border-t border-[#f4f2ee] space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-[#6e747c] block mb-1">Sort By:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setPage(1)
                    }}
                    className="w-full px-2.5 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price Low-High</option>
                    <option value="price-desc">Price High-Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#6e747c] block mb-1">Price Bracket:</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => {
                      setPriceFilter(e.target.value)
                      setPage(1)
                    }}
                    className="w-full px-2.5 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-10000">&lt; ₹10k</option>
                    <option value="10000-25000">₹10k - ₹25k</option>
                    <option value="25000-50000">₹25k - ₹50k</option>
                    <option value="above-50000">&gt; ₹50k</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Category Horizontal Scrolling Filter Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1">
            {departments.map((dept) => {
              const isSelected = selectedCategory === dept.id
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedCategory(dept.id)
                    setPage(1)
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#143e2e] text-white shadow-xs'
                      : 'bg-[#f4f2ee] hover:bg-[#eae7e1] text-[#33373b]'
                  }`}
                >
                  {dept.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#6e747c] px-1">
          <span>
            Displaying <strong className="text-[#111315]">{products.length}</strong> of{' '}
            <strong className="text-[#111315]">{total}</strong> Verified Luxury References
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all')
                setPage(1)
              }}
              className="text-[#143e2e] font-bold hover:underline flex items-center gap-1"
            >
              <span>Reset to All</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-[#143e2e] border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-[#6e747c]">Curating atelier catalogue...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white border border-[#e8e6e1] text-center space-y-4 shadow-sm">
            <Filter className="w-12 h-12 text-[#d6d3cb] mx-auto" />
            <h3 className="text-lg font-bold font-serif text-[#111315]">No Matches Found</h3>
            <p className="text-xs text-[#6e747c] max-w-sm mx-auto">
              No references matched your search query or price criteria. Try clearing filters or consult our AI concierge.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
                setPriceFilter('all')
                setPage(1)
              }}
              className="px-5 py-2.5 rounded-full bg-[#143e2e] text-white text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2.5 rounded-xl border border-[#e8e6e1] bg-white text-[#111315] hover:bg-[#f4f2ee] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-[#111315] px-3">
              Page <strong className="font-bold">{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-2.5 rounded-xl border border-[#e8e6e1] bg-white text-[#111315] hover:bg-[#f4f2ee] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
