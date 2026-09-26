'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  Receipt,
  CreditCard,
  Send,
  Check,
  MapPin,
  Users,
  Flame,
  Info,
  Phone,
  Sparkles
} from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-28 border-t border-stone-200 bg-white text-stone-900">
      
      {/* Pan-India Trust & Guarantees Bar */}
      <div className="border-b border-stone-100 bg-[#fbfaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">100% Certified Authentic</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Direct luxury atelier sourcing with BIS certification across all hardware.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">19,000+ PIN Codes Covered</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Complimentary express shipping via BlueDart & Delhivery on orders ₹999+.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">GST Invoice & Tax Credit</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Prices inclusive of 18% GST with instant downloadable B2B GSTIN tax invoices.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">UPI, RuPay & No-Cost EMI</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Instant UPI QR, netbanking with 40+ banks, and 3-6 month No-Cost EMI.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#143e2e] to-[#0c261c] flex items-center justify-center text-[#c5a059] font-black text-xl shadow-md border border-[#d2e4d8]">
              A
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xl text-stone-950 font-serif">
                ARKA LUXE
              </span>
              <p className="text-[10px] tracking-widest uppercase font-mono text-stone-500">The Luxury Department Store of India</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
            Curating India&apos;s premier multi-department luxury portfolio across planar acoustics, horology, computing gear, designer apparel, and ergonomic workspaces.
          </p>

          <div className="text-xs text-stone-500 space-y-1 pt-1 font-mono">
            <p className="flex items-center gap-1.5 text-stone-800 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#143e2e]" />
              <span>Flagship Lounges & Operations:</span>
            </p>
            <p>• 100ft Road, Indiranagar, Bengaluru 560038, Karnataka</p>
            <p>• Maker Maxity, BKC, Mumbai 400051, Maharashtra</p>
          </div>

          <form onSubmit={handleSubscribe} className="pt-3">
            <label htmlFor="newsletter" className="block text-xs font-bold text-stone-800 mb-2">
              Subscribe to the ARKA Gazette & Exclusive Member Releases
            </label>
            <div className="flex gap-2 max-w-sm">
              <input
                id="newsletter"
                type="email"
                required
                placeholder="patron@domain.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#143e2e] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-4 py-2 bg-[#143e2e] hover:bg-[#0e2c20] text-[#c5a059] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] text-[#143e2e] mt-1.5 font-mono font-medium">Your subscription is registered with our concierge.</p>
            )}
          </form>
        </div>

        {/* Departments */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-900 mb-3">Departments</h4>
          <ul className="space-y-2 text-xs text-stone-600 font-medium">
            <li><Link href="/departments" className="hover:text-[#143e2e] transition-colors font-bold text-[#143e2e]">All Departments Overview</Link></li>
            <li><Link href="/products?category=Audio" className="hover:text-[#143e2e] transition-colors">Planar & Hi-Fi Audio</Link></li>
            <li><Link href="/products?category=Computing" className="hover:text-[#143e2e] transition-colors">Desk & Computing</Link></li>
            <li><Link href="/products?category=Wearables" className="hover:text-[#143e2e] transition-colors">Smart Wearables</Link></li>
            <li><Link href="/products?category=Workspace" className="hover:text-[#143e2e] transition-colors">Smart Workspace</Link></li>
            <li><Link href="/products?category=Timepieces+%26+Jewelry" className="hover:text-[#143e2e] transition-colors">Timepieces & Jewelry</Link></li>
            <li><Link href="/products?category=Lifestyle" className="hover:text-[#143e2e] transition-colors">Modular Carry</Link></li>
          </ul>
        </div>

        {/* Exclusive Experiences & Social */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-900 mb-3">Experiences</h4>
          <ul className="space-y-2 text-xs text-stone-600 font-medium">
            <li>
              <Link href="/squad" className="hover:text-[#143e2e] transition-colors flex items-center gap-1.5 font-semibold text-[#143e2e]">
                <Users className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>&ldquo;Should I Buy It?&rdquo; Squad</span>
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:text-amber-800 transition-colors flex items-center gap-1.5 text-amber-700 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>Privilege Deals & Drops</span>
              </Link>
            </li>
            <li><Link href="/products" className="hover:text-[#143e2e] transition-colors">Complete Master Catalog</Link></li>
            <li><Link href="/cart" className="hover:text-[#143e2e] transition-colors">Dedicated Shopping Bag</Link></li>
            <li><Link href="/orders" className="hover:text-[#143e2e] transition-colors">Track Consignment (BlueDart)</Link></li>
            <li><Link href="/about" className="hover:text-[#143e2e] transition-colors">Atelier Heritage & Craft</Link></li>
            <li><Link href="/contact" className="hover:text-[#143e2e] transition-colors">VIP Concierge & Lounges</Link></li>
            <li><Link href="/walkthrough" className="hover:text-[#143e2e] transition-colors">Architecture Tour & Specs</Link></li>
          </ul>
        </div>

        {/* Member Account & Security */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-900 mb-3">Security & Account</h4>
          <ul className="space-y-2 text-xs text-stone-600 font-medium">
            <li><Link href="/profile" className="hover:text-[#143e2e] transition-colors">Patron Profile & Orders</Link></li>
            <li><Link href="/login" className="hover:text-[#143e2e] transition-colors">JWT Secure Sign In</Link></li>
            <li><Link href="/register" className="hover:text-[#143e2e] transition-colors">Join Privilege Atelier</Link></li>
            <li><Link href="/admin" className="hover:text-[#143e2e] transition-colors">Atelier Admin Portal</Link></li>
          </ul>

          <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 font-mono space-y-1">
            <p>• BIS Certified (R-41009823)</p>
            <p>• 18% GST Invoicing with ITC</p>
            <p>• JWT HS256 Encrypted Session</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-[#143e2e] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pan-India Hubs Active
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-stone-200 py-6 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>© {new Date().getFullYear()} ARKA LUXURY COMMERCE INDIA PRIVATE LIMITED. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <span className="hover:text-stone-800 transition-colors">GSTIN: 29AAACA9922K1Z9</span>
            <Link href="/about" className="hover:text-stone-800 transition-colors">Patron Charter</Link>
            <Link href="/contact" className="hover:text-stone-800 transition-colors">Concierge Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
