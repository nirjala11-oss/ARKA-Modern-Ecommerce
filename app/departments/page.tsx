'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react'

const DEPARTMENTS = [
  {
    name: 'Planar & Hi-Fi Audio',
    slug: 'Audio',
    count: '4 References',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    desc: 'Bespoke planar magnetic transducers, hybrid ANC over-ear monitors, spatial spheres, and pure silver-balanced audio gear.',
    tags: ['Aetheris Pro Planar', 'Aura SoundSphere', 'Serenade Open-Back', 'Echo Pods IEMs']
  },
  {
    name: 'Smart Wearables & Telemetry',
    slug: 'Wearables',
    count: '2 References',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    desc: 'Grade-5 aerospace titanium smartwatches with domed sapphire crystals and clinical physiological biometric smart rings.',
    tags: ['Chronos Horizon Titanium', 'Pulse Zero Smart Ring']
  },
  {
    name: 'Desk & Precision Computing',
    slug: 'Computing',
    count: '4 References',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    desc: 'Gasket-mounted CNC mechanical keyboards, 53g magnesium alloy gaming mice, 4K OLED creator monitors, and 140W GaN hubs.',
    tags: ['Nocturne 65 Gasket', 'Kinesis 53g Magnesium', 'Horizon 16 4K OLED', 'Quantum 140W GaN']
  },
  {
    name: 'Smart Workspace & Ergonomics',
    slug: 'Workspace',
    count: '3 References',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    desc: 'SunLike 98+ CRI circadian desk lights, Aeron-alloy executive ergonomic chairs, and single-block solid walnut MagSafe docks.',
    tags: ['Helios Halo Light', 'Apex Aeron Chair', 'Monolith MagSafe Dock']
  },
  {
    name: 'Timepieces & High Horology',
    slug: 'Timepieces & Jewelry',
    count: '1 Reference',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    desc: 'Classical mechanical complication movements with high-frequency automatic escapements and exhibition sapphire casebacks.',
    tags: ['Elysium Tourbillon Skeleton']
  },
  {
    name: 'Modular Carry & Bags',
    slug: 'Lifestyle',
    count: '2 References',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    desc: 'Weatherproof 1000D Cordura commuter packs with magnetic Fidlock hardware and vegetable-tanned Tuscan full-grain leather holdalls.',
    tags: ['Vanguard 24L Cordura', 'Tuscan Leather Holdall 45L']
  },
  {
    name: 'Designer Fashion & Tailoring',
    slug: 'Designer Fashion',
    count: '1 Reference',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    desc: '19.5-micron extrafine Australian Merino wool tailored overcoats treated with nanotech lotus-leaf weather-repellency.',
    tags: ['Aeroflex Merino Overcoat']
  },
  {
    name: 'Artisanal Niche Fragrances',
    slug: 'Beauty & Fragrances',
    count: '1 Reference',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    desc: 'Extrait de Parfum at 32% concentration featuring wild Assamese oud, Kashmiri saffron, and smoked green cardamom.',
    tags: ['Vesper Pure Parfum Extrait']
  }
]

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf5f0] border border-[#d2e4d8] text-xs font-mono font-bold text-[#143e2e]">
            <Layers className="w-3.5 h-3.5 text-[#143e2e]" />
            <span>MASTER DEPARTMENT ATELIER DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#111315] tracking-tight">
            Curated Departments of ARKA Luxe
          </h1>
          <p className="text-xs sm:text-sm text-[#6e747c] leading-relaxed">
            Explore our specialized divisions spanning acoustic transducers, horology, computing hardware, ergonomic workspaces, and artisanal luxury craftsmanship.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.slug}
              className="group rounded-3xl bg-white border border-[#e8e6e1] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                <Image
                  src={dept.image}
                  alt={dept.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                      {dept.count}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif">{dept.name}</h3>
                  </div>
                  <Link
                    href={`/products?category=${encodeURIComponent(dept.slug)}`}
                    className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center group-hover:bg-[#143e2e] group-hover:text-white transition-all shadow-md shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-[#6e747c] leading-relaxed">
                  {dept.desc}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f4f2ee]">
                  {dept.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#f4f2ee] text-[11px] font-medium text-[#33373b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/products?category=${encodeURIComponent(dept.slug)}`}
                    className="text-xs font-bold text-[#143e2e] hover:text-[#1b523d] flex items-center gap-1.5 transition-colors"
                  >
                    <span>View All in {dept.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/squad"
                    className="text-xs font-semibold text-[#6e747c] hover:text-[#143e2e]"
                  >
                    Ask Squad Opinion
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  )
}
