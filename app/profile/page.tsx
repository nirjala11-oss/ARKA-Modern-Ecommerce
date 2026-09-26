'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuthStore } from '@/stores/auth-store'
import { useSocialRoomStore } from '@/stores/social-room-store'
import {
  User,
  Shield,
  Package,
  Users,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  Key
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, isAuthenticated, logout, checkAuth } = useAuthStore()
  const { sharedItems, roomCode, inRoom } = useSocialRoomStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [checkAuth])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#143e2e] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-[#e8e6e1] shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif">Sign in to your Profile</h2>
              <p className="text-xs text-[#6e747c]">
                Please authenticate using your JWT credentials to access your saved orders, personal Squad rooms, and VIP concierge.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login?redirect=/profile"
                className="flex-1 py-3 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 py-3 rounded-full bg-white hover:bg-[#f4f2ee] border border-[#e8e6e1] text-[#111315] text-xs font-bold uppercase tracking-wider transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Profile Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8e6e1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#143e2e] to-[#0c261c] text-[#c5a059] flex items-center justify-center font-serif font-black text-2xl sm:text-3xl shadow-md border-2 border-[#d2e4d8]">
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#111315]">
                  {user.name}
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-[#c5a059] text-zinc-950'
                    : 'bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8]'
                }`}>
                  {user.role === 'admin' ? 'Atelier Admin' : 'Privilege VIP Member'}
                </span>
              </div>
              <p className="text-xs text-[#6e747c] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#143e2e]" />
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <Phone className="w-3.5 h-3.5 text-[#143e2e]" />
                    <span>{user.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-[#111315] hover:bg-[#22252a] text-[#c5a059] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: JWT Verification & Security */}
          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#143e2e]">
              <Key className="w-5 h-5 text-[#c5a059]" />
              <h3 className="font-bold text-sm">Active JWT Session</h3>
            </div>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Your session is cryptographically signed using HS256 JWT. Valid for 7 days with seamless Pan-India token refresh.
            </p>
            <div className="p-3 rounded-xl bg-[#f4f2ee] font-mono text-[10px] text-[#33373b] break-all border border-[#e8e6e1]">
              <span className="text-[#6e747c] block mb-1 font-bold">Bearer Token:</span>
              {token ? `${token.substring(0, 36)}...` : 'None'}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Token Status: Verified Active</span>
            </div>
          </div>

          {/* Card 2: Social Squad Status */}
          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#143e2e]">
              <Users className="w-5 h-5" />
              <h3 className="font-bold text-sm">Squad Shopping</h3>
            </div>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              {inRoom
                ? `You are currently in Squad Room ${roomCode} with ${sharedItems.length} shortlisted items.`
                : 'You are currently not in an active Squad Room. Create one or join your friends to vote!'}
            </p>
            <Link
              href="/squad"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#143e2e] text-white text-xs font-bold hover:bg-[#1b523d] transition-all shadow-sm"
            >
              <span>{inRoom ? 'Go to Active Squad Room' : 'Launch Squad Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Pan-India Orders */}
          <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#143e2e]">
              <Package className="w-5 h-5 text-[#c5a059]" />
              <h3 className="font-bold text-sm">Live Consignments</h3>
            </div>
            <p className="text-xs text-[#6e747c] leading-relaxed">
              Track express dispatches via BlueDart & Delhivery with live SMS OTP delivery verification.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f4f2ee] hover:bg-[#eae7e1] text-[#111315] text-xs font-bold transition-all"
            >
              <span>View Track Orders Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6e747c]" />
            </Link>
          </div>

        </div>

        {/* Privilege Member Perks Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#143e2e] to-[#0c261c] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#c5a059] border border-white/15 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>ARKA CLUB PRIVILEGE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Complimentary White-Glove Concierge Access
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-xl">
              As an authenticated member, you receive priority dispatch across all 19,000+ PIN codes, zero-cost EMI pre-approval, and 10% Squad room checkout discounts.
            </p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#b38d45] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            Explore Department Catalog
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
