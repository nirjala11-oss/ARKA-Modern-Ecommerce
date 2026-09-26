'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { ProductCard } from '@/components/ProductCard'
import { AIChatModal } from '@/components/AIChatModal'
import { INITIAL_PRODUCTS } from '@/lib/products-data'
import { useCartStore } from '@/stores/cart-store'
import { useSocialRoomStore } from '@/stores/social-room-store'
import { formatINR, calculateEMI } from '@/lib/format'
import {
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Truck,
  MapPin,
  Zap,
  CreditCard,
  Lock,
  Headphones,
  Watch,
  Keyboard,
  Users,
  Compass,
  Tag,
  Star,
  Layers,
  ShoppingBag,
  Flame,
  ThumbsDown,
  Trophy,
  HelpCircle,
  Clock,
  ArrowUp
} from 'lucide-react'

const DEPARTMENTS = [
  {
    name: 'Planar & Hi-Fi Audio',
    count: '4 References',
    slug: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    desc: 'Bespoke planar magnetic drivers, hybrid ANC monitors & spatial spheres',
  },
  {
    name: 'Desk & Computing',
    count: '4 References',
    slug: 'Computing',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    desc: 'Gasket-mounted CNC keyboards, magnesium mice & 4K OLED displays',
  },
  {
    name: 'Smart Wearables & Health',
    count: '2 References',
    slug: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    desc: 'Titanium kinetic smartwatches & biometric medical telemetry rings',
  },
  {
    name: 'Smart Workspace',
    count: '3 References',
    slug: 'Workspace',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    desc: 'SunLike circadian lighting, Aeron-alloy chairs & solid walnut docks',
  },
  {
    name: 'Timepieces & Horology',
    count: '1 Reference',
    slug: 'Timepieces & Jewelry',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    desc: 'Swiss skeleton automatic tourbillons & sapphire crystal dome cases',
  },
  {
    name: 'Modular Carry & Bags',
    count: '2 References',
    slug: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    desc: '1000D ballistic Cordura commuter packs & Tuscan full-grain leather holdalls',
  },
  {
    name: 'Designer Fashion',
    count: '1 Reference',
    slug: 'Designer Fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    desc: '19.5-micron Australian extrafine Merino wool tailored overcoats',
  },
  {
    name: 'Niche Perfumery',
    count: '1 Reference',
    slug: 'Beauty & Fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    desc: 'Extrait de Parfum at 32% with wild Assamese oud & Kashmiri saffron',
  },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [quickPincode, setQuickPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null)
  
  // Interactive Home Squad Demo State
  const [homeVotes, setHomeVotes] = useState({ up: 18, down: 3 })
  const [userHomeVote, setUserHomeVote] = useState<'up' | 'down' | null>('up')

  const { addItem } = useCartStore()
  const { inRoom, roomCode, createRoom, addSharedItem } = useSocialRoomStore()

  // Flagship product for hero spotlight
  const flagshipProduct = INITIAL_PRODUCTS[0]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...INITIAL_PRODUCTS]

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))
        break
      default:
        break
    }

    return list
  }, [selectedCategory, searchQuery, sortBy])

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickPincode || quickPincode.length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit PIN code')
      return
    }
    try {
      const res = await fetch(`/api/pincode?code=${quickPincode}`)
      const data = await res.json()
      if (data.success) {
        setPincodeStatus(`✓ ${data.deliveryMessage} | Priority Air Express Guaranteed`)
      } else {
        setPincodeStatus(data.message)
      }
    } catch {
      setPincodeStatus('Standard courier delivery in 24-48 business hours')
    }
  }

  const handleHomeVote = (vote: 'up' | 'down') => {
    if (userHomeVote === vote) return
    setUserHomeVote(vote)
    if (vote === 'up') {
      setHomeVotes((prev) => ({ up: prev.up + 1, down: Math.max(0, prev.down - (userHomeVote === 'down' ? 1 : 0)) }))
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#143e2e', '#c5a059', '#10b981'],
        })
      } catch {
        // ignore
      }
    } else {
      setHomeVotes((prev) => ({ down: prev.down + 1, up: Math.max(0, prev.up - (userHomeVote === 'up' ? 1 : 0)) }))
    }
  }

  const totalHomeVotes = homeVotes.up + homeVotes.down
  const homeWinPct = totalHomeVotes > 0 ? Math.round((homeVotes.up / totalHomeVotes) * 100) : 50

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-stone-900 selection:bg-[#143e2e] selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* AI Assistant Modal */}
      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Quick Scroll Link Animated Pill Bar */}
      <div className="sticky top-20 z-30 w-full bg-white/80 backdrop-blur-md border-b border-[#e8e6e1] py-2 px-4 shadow-2xs hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 overflow-x-auto text-[#6e747c]">
            <span className="text-[10px] font-mono uppercase text-[#143e2e] font-bold mr-2">Quick Navigation:</span>
            <a href="#hero" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] hover:text-[#111315] transition-colors">
              Maison Spotlight
            </a>
            <a href="#departments" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] hover:text-[#111315] transition-colors">
              All Departments
            </a>
            <a href="#squad-section" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] text-[#143e2e] font-bold transition-colors flex items-center gap-1">
              <Users className="w-3 h-3 text-[#c5a059]" />
              <span>Squad &ldquo;Should I Buy It?&rdquo;</span>
            </a>
            <a href="#catalog" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] hover:text-[#111315] transition-colors">
              Curated Selections
            </a>
            <a href="#pincode" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] hover:text-[#111315] transition-colors">
              PIN Code Check
            </a>
            <a href="#sustainability" className="px-3 py-1 rounded-full hover:bg-[#f4f2ee] hover:text-[#111315] transition-colors">
              Craft Manifesto
            </a>
          </div>

          <Link
            href="/deals"
            className="flex items-center gap-1 text-[#c5a059] font-mono text-[11px] font-bold bg-[#143e2e] px-3 py-1 rounded-full shrink-0"
          >
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Privilege Deals Active</span>
          </Link>
        </div>
      </div>

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative overflow-hidden pt-8 pb-16 sm:py-20 md:py-24 border-b border-stone-200/80 bg-gradient-to-b from-white via-[#fbfaf8] to-stone-100/50">
          
          {/* Subtle Ambient Heritage Glow */}
          <div className="absolute top-1/4 right-1/4 w-[550px] h-[350px] bg-[#c5a059]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute -top-12 left-10 w-[400px] h-[300px] bg-[#143e2e]/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143e2e]/10 text-[#143e2e] border border-[#143e2e]/20 text-xs font-mono font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>THE LUXURY DEPARTMENT STORE OF INDIA // ARKA (अर्क)</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 leading-[1.08] font-serif">
                  Distinguished Craft. <br />
                  <span className="text-[#143e2e] bg-gradient-to-r from-[#143e2e] to-[#256c52] bg-clip-text text-transparent">
                    Unbounded Luxury.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-stone-600 max-w-xl font-normal leading-relaxed">
                  Curating 200+ masterwork instruments, Swiss automatic tourbillons, planar magnetic headphones, tactile keyboards, and designer carry. Backed by certified BIS compliance, 18% GST invoices, and Pan-India priority dispatch.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/products"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#143e2e]/20 group cursor-pointer"
                  >
                    <span>Explore Master Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#c5a059]" />
                  </Link>

                  <Link
                    href="/squad"
                    className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold shadow-sm transition-all hover:border-[#143e2e]/40 group"
                  >
                    <Users className="w-4 h-4 text-[#143e2e]" />
                    <span>&ldquo;Should I Buy It?&rdquo; Squad</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-[#143e2e] font-bold">Live</span>
                  </Link>

                  <button
                    onClick={() => setIsAIChatOpen(true)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:text-[#143e2e]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Mitra AI</span>
                  </button>
                </div>

                {/* Pan-India Trust Metrics Bar */}
                <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-stone-950">200+</div>
                    <div className="text-xs text-stone-500 mt-0.5 font-medium">Verified References</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-stone-950">19,000+</div>
                    <div className="text-xs text-stone-500 mt-0.5 font-medium">Indian PIN Codes</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-[#143e2e]">18% GST</div>
                    <div className="text-xs text-stone-500 mt-0.5 font-medium">Corporate Tax Credit</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Flagship Spotlight Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xl space-y-4">
                  
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                    <span className="text-[#143e2e] uppercase tracking-wider font-bold">Maison Spotlight Reference</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#143e2e] font-semibold border border-emerald-200 text-[11px]">
                      Reserve Stock ({flagshipProduct.stock} left)
                    </span>
                  </div>

                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shadow-inner">
                    <Image
                      src={flagshipProduct.image}
                      alt={flagshipProduct.name}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-stone-200 text-xs font-mono font-bold text-stone-900 shadow-sm">
                      {formatINR(flagshipProduct.price)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-950">
                      {flagshipProduct.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {flagshipProduct.description}
                    </p>
                    
                    <div className="mt-2 text-[11px] font-mono text-stone-600 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>No Cost EMI from {formatINR(calculateEMI(flagshipProduct.price, 6))}/month</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => addItem(flagshipProduct)}
                      className="flex-1 py-3 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#143e2e]/20 cursor-pointer text-center"
                    >
                      Add to Bag — {formatINR(flagshipProduct.price)}
                    </button>
                    <Link
                      href={`/products/${flagshipProduct.id}`}
                      className="px-4 py-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      Inspect
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 8 GRAND LUXURY DEPARTMENTS SHOWCASE */}
        <section id="departments" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold mb-1">
                The Grand Portfolio
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
                Explore All Curated Departments
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                From planar acoustic mastering and haute horlogerie to ergonomic workstations and luxury carry.
              </p>
            </div>
            <Link
              href="/departments"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#143e2e] hover:underline"
            >
              <span>Explore Department Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.name}
                href={`/products?category=${encodeURIComponent(dept.slug)}`}
                className="group relative rounded-2xl overflow-hidden border border-stone-200/90 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-stone-800 shadow-2xs">
                    {dept.count}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-stone-950 group-hover:text-[#143e2e] transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {dept.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* INTERACTIVE SQUAD DECISION ENGINE SPOTLIGHT */}
        <section id="squad-section" className="py-16 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-12 bg-gradient-to-br from-[#0a2016] via-[#143e2e] to-[#081810] text-white shadow-2xl relative overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="lg:col-span-7 space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#c5a059] border border-[#c5a059]/30 text-xs font-mono font-bold tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>INDUSTRY-FIRST SOCIAL DECISION ENGINE</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif leading-tight">
                  &ldquo;Should I Buy It?&rdquo; <br />
                  <span className="text-[#c5a059]">Let Your Squad Decide with Real-Time Votes.</span>
                </h2>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl">
                  Add any product you are contemplating, invite 2-3 friends via a quick private link, and have them vote <strong className="text-emerald-300">COP IT (Win Upward)</strong> or <strong className="text-rose-300">DROP IT (Demote)</strong>. If Upward wins, unlock a 10% Squad Discount!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                    <div className="font-bold text-[#c5a059]">1. Add Dilemma</div>
                    <div className="text-[11px] text-stone-300">Pick any product from the catalog with your question.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                    <div className="font-bold text-[#c5a059]">2. Friends Vote</div>
                    <div className="text-[11px] text-stone-300">Friends vote Upward or Demote with custom advice.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm space-y-1">
                    <div className="font-bold text-[#c5a059]">3. Squad Consensus</div>
                    <div className="text-[11px] text-stone-300">Whichever has more votes decides if you cop or pass!</div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href="/squad"
                    className="px-6 py-3.5 rounded-full bg-[#c5a059] hover:bg-[#b38e4a] text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    Open Squad Lounge & Invite Friends
                  </Link>
                  <span className="text-xs text-stone-300 font-mono">
                    Zero app installs required • Real-time vote tallying
                  </span>
                </div>
              </div>

              {/* Live Interactive Dilemma Card on Homepage */}
              <div className="lg:col-span-5 relative z-10">
                <div className="rounded-3xl bg-white text-stone-900 p-5 sm:p-6 shadow-2xl border border-white/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#143e2e] text-[#c5a059] flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-950">Aarav&apos;s Live Dilemma</div>
                        <div className="text-[10px] text-stone-500 font-mono">4 friends active now</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#143e2e] text-[10px] font-bold">
                      Voting Live
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                        <Image
                          src={INITIAL_PRODUCTS[0].image}
                          alt={INITIAL_PRODUCTS[0].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase">Planar Audio</span>
                        <h4 className="text-xs font-bold text-stone-950 truncate">Vajra Aetheris Pro ANC</h4>
                        <span className="text-xs font-mono font-bold text-[#143e2e]">{formatINR(INITIAL_PRODUCTS[0].price)}</span>
                      </div>
                    </div>
                    <p className="text-xs italic text-stone-600">
                      &ldquo;Should I buy this for my coding workstation? Is ₹29,999 worth it?&rdquo;
                    </p>
                  </div>

                  {/* Consensus Meter */}
                  <div className="space-y-1.5 bg-stone-100/70 p-3 rounded-2xl border border-stone-200">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>SQUAD WINS! ({homeWinPct}% Cop)</span>
                      </span>
                      <span className="font-mono text-[11px] text-stone-600">
                        {homeVotes.up} Up / {homeVotes.down} Down
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden flex">
                      <div style={{ width: `${homeWinPct}%` }} className="bg-emerald-600 transition-all duration-300" />
                      <div style={{ width: `${100 - homeWinPct}%` }} className="bg-rose-500 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Interactive Voting Buttons Right on Homepage */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleHomeVote('up')}
                      className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        userHomeVote === 'up'
                          ? 'bg-[#143e2e] text-white shadow-xs'
                          : 'bg-emerald-50 text-[#143e2e] border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>COP IT ({homeVotes.up})</span>
                    </button>

                    <button
                      onClick={() => handleHomeVote('down')}
                      className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        userHomeVote === 'down'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                      <span>DEMOTE ({homeVotes.down})</span>
                    </button>
                  </div>

                  <div className="text-center pt-1 border-t border-stone-100">
                    <Link
                      href="/squad"
                      className="text-xs font-bold text-[#143e2e] hover:underline flex items-center justify-center gap-1"
                    >
                      <span>Create Your Own Squad Dilemma & Share Link</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PIN CODE SERVICEABILITY CHECKER WIDGET */}
        <section id="pincode" className="py-6 bg-[#fbfaf8] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 text-[#143e2e] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-950">Direct Courier & White-Glove Dispatch to Your City</h4>
                  <p className="text-[11px] text-stone-600">Check priority delivery across Bengaluru, Delhi NCR, Mumbai, Hyderabad, and 19,000+ Indian PIN codes.</p>
                </div>
              </div>

              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={quickPincode}
                  onChange={(e) => setQuickPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 w-36 focus:border-[#143e2e] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#143e2e] hover:bg-[#0e2c20] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Verify Speed
                </button>
              </form>
            </div>
            {pincodeStatus && (
              <p className="text-xs text-[#143e2e] font-medium font-mono mt-2 pl-2">{pincodeStatus}</p>
            )}
          </div>
        </section>

        {/* CURATED HIGHLIGHTS CATALOG SECTION */}
        <section id="catalog" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold mb-1">
                Curated Department Highlights
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
                Featured Atelier References ({filteredProducts.length})
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                Explore our signature electronics, planar audio monitors, titanium smartwatches, and tactile keyboards with authentic Indian Rupee pricing and BIS certification.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Browse All 200+ Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Master Catalog Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-stone-100/80 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
            <div>
              <h3 className="text-base font-bold text-stone-950 font-serif">
                Looking for Specific Designer Brands or Fragrances?
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-md">
                Our complete catalog contains 200+ items across all 8 departments, with live search, price filtering, and department categorization.
              </p>
            </div>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#143e2e] hover:bg-[#0e2c20] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all shrink-0"
            >
              Open Master Catalog (200+ Products)
            </Link>
          </div>

        </section>

        {/* SUSTAINABILITY & CRAFT MANIFESTO */}
        <section id="sustainability" className="py-20 border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[#143e2e] font-bold">
                  Indigenous Craft & Sustainability
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 leading-tight font-serif">
                  Conscious Luxury. <br />Machined for Generations.
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  In a market inundated with disposable short-lived goods, ARKA curates pieces crafted from aerospace 6063-T6 aluminum billets, medical titanium, organic Nilgiri botanicals, and certified sustainable textiles.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#143e2e] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Sub-Micron CNC Aluminum & Titanium</h4>
                      <p className="text-xs text-stone-500">Milled for 3.5+ hours to eliminate internal acoustic standing waves and electromagnetic interference.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#143e2e] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Bureau of Indian Standards (BIS) Verified</h4>
                      <p className="text-xs text-stone-500">All lithium battery cells, Bluetooth radios, and electrical transformers are certified for Indian power grids.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#143e2e] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Pan-India Doorstep Replacement</h4>
                      <p className="text-xs text-stone-500">1-Year full replacement warranty managed directly from our Bengaluru and Gurugram tech centers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Box Visuals */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
                      alt="Machined keyboard"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 rounded-2xl bg-[#fbfaf8] border border-stone-200 space-y-1">
                    <div className="text-xl font-black font-mono text-stone-950">6063-T6</div>
                    <div className="text-xs text-stone-500">Aerospace bead-blasted alloy</div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="text-xl font-black font-mono text-[#143e2e]">100%</div>
                    <div className="text-xs text-[#143e2e]">GST Input Tax Credit Eligible</div>
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
                      alt="Titanium watch"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
