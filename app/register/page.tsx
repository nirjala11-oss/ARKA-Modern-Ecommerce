'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuthStore } from '@/stores/auth-store'
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    clearError()

    if (!name || !email || !password) {
      setFormError('Please fill out all required fields')
      return
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    const res = await register(name, email, password, phone)
    if (res.success) {
      router.push('/profile')
    } else {
      setFormError(res.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5f0] text-[#143e2e] border border-[#d2e4d8] text-xs font-mono font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#143e2e]" />
              <span>JOIN THE ARKA ATELIER</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#111315] tracking-tight font-serif">
              Create an Account
            </h1>
            <p className="text-xs text-[#6e747c]">
              Unlock complimentary shipping, private Squad rooms, and GST tax invoice generation.
            </p>
          </div>

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
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e747c]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33373b] mb-1">
                  Email Address *
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
                <label className="block text-xs font-semibold text-[#33373b] mb-1">
                  Mobile Number (for Courier SMS updates)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e747c]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 XXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#33373b] mb-1">
                    Password *
                  </label>
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

                <div>
                  <label className="block text-xs font-semibold text-[#33373b] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e747c]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register With JWT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#e8e6e1] text-center">
              <p className="text-xs text-[#6e747c]">
                Already an ARKA member?{' '}
                <Link
                  href="/login"
                  className="font-bold text-[#143e2e] hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] font-mono text-[#6e747c]">
            By continuing, you agree to ARKA&apos;s Pan-India Concierge Service Guidelines.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
