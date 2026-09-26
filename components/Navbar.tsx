'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import { useSocialRoomStore } from '@/stores/social-room-store'
import { useAuthStore } from '@/stores/auth-store'
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Users,
  Truck,
  Flame,
  User,
  Shield,
  Layers,
  Phone,
  Info,
  LogOut,
  Compass,
  Store
} from 'lucide-react'

import { ArkaCrest } from '@/components/icons/ArkaCrest'

interface NavbarProps {
  onOpenAIChat?: () => void
}

export function Navbar({ onOpenAIChat }: NavbarProps) {
  const pathname = usePathname()
  const { getTotalItems, openCart } = useCartStore()
  const { sharedItems, inRoom } = useSocialRoomStore()
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const totalItems = getTotalItems()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const navLinks = [
    { name: 'Departments', href: '/departments' },
    { name: 'Shop All (18+)', href: '/products' },
    { name: 'Squad Dilemmas', href: '/squad', badge: sharedItems.length > 0 ? `${sharedItems.length}` : 'Vote', highlight: true },
    { name: 'Deals & Drops', href: '/deals', badge: 'Sale', hot: true },
    { name: 'Track Orders', href: '/orders' },
    { name: 'Atelier Story', href: '/about' },
    { name: 'Concierge', href: '/contact' },
    { name: 'Architecture', href: '/walkthrough' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full glass-nav-luxury transition-all duration-300">
      
      {/* Top Pan-India Announcement Bar */}
      <div className="bg-[#0c2b1e] text-[#fbfaf8] py-2 px-4 text-center text-[11px] font-mono tracking-wide flex items-center justify-between gap-3 overflow-x-auto border-b border-[#1b523d]/40">
        <div className="hidden sm:flex items-center gap-1.5 text-[#c5a059] font-bold shrink-0">
          <Truck className="w-3.5 h-3.5" />
          <span>ARKA PAN-INDIA CONCIERGE:</span>
        </div>
        <div className="text-zinc-200 text-center truncate mx-auto text-[10px] sm:text-xs">
          Free Express Delivery on ₹999+ • Inclusive of 18% GST • 19,000+ PIN Codes • JWT Secured
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/squad"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1b523d] text-[#edf5f0] text-[10px] font-bold hover:bg-[#236b50] transition-colors"
          >
            <Users className="w-3 h-3 text-[#c5a059]" />
            <span>&ldquo;Should I Buy It?&rdquo; Squad</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo with Custom Royal Crest SVG */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <ArkaCrest size={40} className="shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-serif font-extrabold tracking-wider text-xl text-[#111315] flex items-center gap-1.5">
              ARKA <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#edf5f0] text-[#143e2e] font-bold border border-[#d2e4d8]">LUXE</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#6e747c] font-mono">
              The Indian Department Store
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#f4f2ee] p-1.5 rounded-full border border-[#e8e6e1]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  link.highlight
                    ? 'bg-[#143e2e] text-white hover:bg-[#1b523d] shadow-xs'
                    : isActive
                    ? 'bg-white text-[#111315] shadow-xs border border-[#e8e6e1]'
                    : 'text-[#6e747c] hover:text-[#111315] hover:bg-[#eae7e1]'
                }`}
              >
                {link.hot && <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />}
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    link.highlight ? 'bg-[#c5a059] text-zinc-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Compact Nav for Medium screens */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-[#f4f2ee] p-1.5 rounded-full border border-[#e8e6e1]">
          <Link href="/departments" className="px-2.5 py-1.5 text-xs font-semibold text-[#6e747c] hover:text-[#111315]">
            Departments
          </Link>
          <Link href="/products" className="px-2.5 py-1.5 text-xs font-semibold text-[#6e747c] hover:text-[#111315]">
            Shop
          </Link>
          <Link href="/squad" className="px-3 py-1.5 text-xs font-bold bg-[#143e2e] text-white rounded-full flex items-center gap-1">
            <Users className="w-3 h-3 text-[#c5a059]" />
            <span>Squad</span>
          </Link>
          <Link href="/deals" className="px-2.5 py-1.5 text-xs font-semibold text-amber-700">
            Deals
          </Link>
          <Link href="/orders" className="px-2.5 py-1.5 text-xs font-semibold text-[#6e747c]">
            Track
          </Link>
        </nav>

        {/* Actions: AI Assistant, Auth, Cart */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* AI Shopping Assistant Button */}
          {onOpenAIChat && (
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#edf5f0] hover:bg-[#d2e4d8] border border-[#d2e4d8] text-[#143e2e] text-xs font-bold transition-all cursor-pointer shadow-xs group"
              title="Open ARKA Mitra AI Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#143e2e] animate-pulse" />
              <span className="hidden sm:inline">Mitra AI</span>
            </button>
          )}

          {/* User Auth Profile Trigger */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#e8e6e1] hover:border-[#143e2e] transition-all cursor-pointer shadow-xs"
                title="Account menu"
              >
                <div className="w-7 h-7 rounded-full bg-[#143e2e] text-[#c5a059] flex items-center justify-center font-bold text-xs">
                  {user.avatar || user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[#111315] max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e8e6e1] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#f4f2ee]">
                    <p className="text-xs font-bold text-[#111315] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6e747c] font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#edf5f0] text-[#143e2e]">
                      {user.role === 'admin' ? 'Atelier Admin' : user.role === 'seller' ? 'Artisan Seller' : 'VIP Member'}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#33373b] hover:bg-[#fbfaf8] hover:text-[#143e2e]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Profile & JWT</span>
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#33373b] hover:bg-[#fbfaf8] hover:text-[#143e2e]"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>My Track Orders</span>
                  </Link>

                  <Link
                    href="/squad"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#33373b] hover:bg-[#fbfaf8] hover:text-[#143e2e]"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Active Squad Rooms</span>
                  </Link>

                  {(user.role === 'seller' || user.role === 'admin') && (
                    <Link
                      href="/seller"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-amber-800 font-bold hover:bg-amber-50/70"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-700" />
                      <span>Seller Studio</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#c5a059] font-bold hover:bg-[#fbf6ec]"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Atelier Admin Desk</span>
                    </Link>
                  )}

                  {user.role === 'user' && (
                    <Link
                      href="/seller"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-stone-600 hover:bg-[#fbfaf8]"
                    >
                      <Store className="w-3.5 h-3.5 text-stone-400" />
                      <span>Become a Seller</span>
                    </Link>
                  )}

                  <div className="border-t border-[#f4f2ee] mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f4f2ee] border border-[#e8e6e1] text-[#111315] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-[#143e2e]" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            aria-label="View shopping bag"
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#e8e6e1] text-[#111315] hover:border-[#143e2e] hover:text-[#143e2e] transition-all cursor-pointer group shadow-xs shrink-0"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#143e2e] text-white text-[11px] font-bold shadow-md animate-in fade-in zoom-in-75 duration-200">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile & Tablet Menu Toggle (Responsive across all screens < 1280px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[#e8e6e1] text-[#111315] hover:border-[#143e2e] transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#143e2e]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#e8e6e1] px-5 py-5 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Mobile User Status Card */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-2xl bg-[#edf5f0] border border-[#d2e4d8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#143e2e] text-[#c5a059] flex items-center justify-center font-bold text-xs">
                  {user.avatar || user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111315]">{user.name}</p>
                  <p className="text-[10px] text-[#6e747c] font-mono">{user.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#143e2e] underline"
              >
                Profile
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#143e2e] text-white text-xs font-bold text-center"
              >
                Sign In With JWT
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#f4f2ee] text-[#111315] text-xs font-bold text-center border border-[#e8e6e1]"
              >
                Register
              </Link>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                  link.highlight
                    ? 'bg-[#143e2e] text-white'
                    : pathname === link.href
                    ? 'bg-[#f4f2ee] text-[#143e2e] font-bold'
                    : 'text-[#33373b] hover:text-[#143e2e] hover:bg-[#edf5f0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.hot && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    link.highlight ? 'bg-[#c5a059] text-zinc-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <Link
              href="/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl text-amber-900 bg-amber-50/80 hover:bg-amber-100 transition-colors border border-amber-200/50"
            >
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span>Seller Studio (Artisan Portal)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/60 font-bold text-amber-950">
                Studio
              </span>
            </Link>
          </div>

          {/* AI Concierge Trigger */}
          {onOpenAIChat && (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenAIChat()
              }}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3 rounded-xl bg-[#0c2b1e] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              <span>Ask ARKA Mitra AI Concierge</span>
            </button>
          )}

          {/* Footer note in mobile drawer */}
          <div className="pt-3 border-t border-[#e8e6e1] text-[10px] font-mono text-[#6e747c] flex items-center justify-between">
            <span>Pan-India Concierge Service</span>
            <span>19,000+ PIN Codes</span>
          </div>

        </div>
      )}
    </header>
  )
}
