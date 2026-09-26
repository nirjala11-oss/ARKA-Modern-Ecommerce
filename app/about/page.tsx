'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ShieldCheck, Award, Truck, Sparkles, HeartHandshake, Compass, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf5f0] border border-[#d2e4d8] text-xs font-mono font-bold text-[#143e2e]">
            <Sparkles className="w-3.5 h-3.5 text-[#143e2e]" />
            <span>ESTABLISHED IN BENGALURU • PAN-INDIA ATELIER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#111315] tracking-tight leading-tight">
            Crafting the Modern Indian Department Store
          </h1>
          <p className="text-sm sm:text-base text-[#6e747c] leading-relaxed">
            ARKA Luxe was founded on a singular conviction: discerning patrons in India deserve hardware, horology, and lifestyle craft engineered without compromise — backed by transparent GST compliance and white-glove doorstep service across 19,000+ PIN codes.
          </p>
        </div>

        {/* Brand Story Imagery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm border border-[#e8e6e1]">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
              alt="Precision CNC Machining"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-sm">Precision Engineering in 6063 Aluminum</span>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm border border-[#e8e6e1]">
            <Image
              src="https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=800&auto=format&fit=crop&q=80"
              alt="Artisanal Handcrafting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-sm">Artisanal Vegetable-Tanned Leathers</span>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm border border-[#e8e6e1]">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              alt="Social Squad Shopping"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-sm">Pioneering Social Squad Consensus</span>
            </div>
          </div>
        </div>

        {/* Pillars of ARKA Luxe */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111315]">BIS & ISO Certified</h3>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Every electrical and wireless reference conforms strictly to BIS safety regulations (IS 13252).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf6ec] text-[#c5a059] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111315]">Pan-India GST Invoicing</h3>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Instant company GST invoices generated upon order dispatch for full corporate input tax credit.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111315]">19,000+ PIN Coverage</h3>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Direct express air-freight partnerships with BlueDart & Delhivery for 24-48 hour metro fulfillment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf6ec] text-[#c5a059] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111315]">Social Squad Voting</h3>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Industry-first collaborative room enabling friends to vote &ldquo;Should I Buy It?&rdquo; before checkout.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111315] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">Experience ARKA Luxe Today</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Discover our master catalog or invite your circle to an interactive Squad decision room.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Browse Catalog
            </Link>
            <Link
              href="/squad"
              className="px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#b38d45] text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Launch Squad
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
