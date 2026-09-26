'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuthStore } from '@/stores/auth-store'
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'

  const { login, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    clearError()

    if (!email || !password) {
      setFormError('Please fill in both your email and password')
      return
    }

    const res = await login(email, password)
    if (res.success) {
      if (redirectUrl === '/' && (res as any).user?.role === 'seller') {
        router.push('/seller')
      } else if (redirectUrl === '/' && (res as any).user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push(redirectUrl)
      }
    } else {
      setFormError(res.message || 'Invalid email or password')
    }
  }

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setFormError('')
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8] text-xs font-mono font-bold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-[#143e2e]" />
          <span>SECURE JWT AUTHENTICATION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111315] tracking-tight font-serif">
          Sign In to ARKA Luxe
        </h1>
        <p className="text-xs text-[#6e747c]">
          Access your order timeline, personal Squad dilemmas, and VIP privileges.
        </p>
      </div>

      {/* Quick Demo Credentials Pill Box */}
      <div className="p-4 rounded-2xl bg-[#f4f2ee] border border-[#e8e6e1] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-[#143e2e] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span>Instant 1-Click Demo Logins:</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => fillDemoAccount('user@example.com', 'user123')}
            className="px-3 py-2 rounded-xl bg-white border border-[#e8e6e1] hover:border-[#143e2e] text-[11px] font-semibold text-[#111315] transition-all cursor-pointer text-left shadow-xs flex flex-col"
          >
            <span className="font-bold text-[#143e2e]">VIP Client</span>
            <span className="text-[10px] text-[#6e747c] font-mono truncate">user@example.com</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('seller@ecommerce.com', 'seller123')}
            className="px-3 py-2 rounded-xl bg-white border border-[#e8e6e1] hover:border-amber-600 text-[11px] font-semibold text-[#111315] transition-all cursor-pointer text-left shadow-xs flex flex-col"
          >
            <span className="font-bold text-amber-700">Artisan Seller</span>
            <span className="text-[10px] text-[#6e747c] font-mono truncate">seller@ecommerce.com</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('admin@ecommerce.com', 'admin123')}
            className="px-3 py-2 rounded-xl bg-white border border-[#e8e6e1] hover:border-[#c5a059] text-[11px] font-semibold text-[#111315] transition-all cursor-pointer text-left shadow-xs flex flex-col"
          >
            <span className="font-bold text-[#c5a059]">Atelier Admin</span>
            <span className="text-[10px] text-[#6e747c] font-mono truncate">admin@ecommerce.com</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-3xl border border-[#e8e6e1] shadow-xl shadow-stone-200/50 space-y-6">
        {(formError || error) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#33373b] mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e747c]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#33373b]">
                Password
              </label>
              <span className="text-[10px] font-mono text-[#6e747c]">Min. 6 chars</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e747c]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In With JWT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#e8e6e1] text-center">
          <p className="text-xs text-[#6e747c]">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-[#143e2e] hover:underline"
            >
              Create ARKA Luxe Account
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#6e747c]">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-[#c5a059]" /> JSON Web Token
        </span>
        <span>•</span>
        <span>Pan-India Privacy</span>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-12 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#143e2e] border-t-transparent animate-spin mx-auto" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
