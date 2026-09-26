'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'VIP Concierge Inquiry',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'VIP Concierge Inquiry',
        message: '',
      })
    }, 4000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf5f0] border border-[#d2e4d8] text-xs font-mono font-bold text-[#143e2e]">
            <Sparkles className="w-3.5 h-3.5 text-[#143e2e]" />
            <span>WHITE-GLOVE CLIENTELE DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#111315] tracking-tight">
            Connect With Concierge
          </h1>
          <p className="text-xs sm:text-sm text-[#6e747c] leading-relaxed">
            Our luxury specialists are at your disposal for bespoke corporate orders, GST billing, doorstep styling previews, and order logistics.
          </p>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#e8e6e1] shadow-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-[#111315]">Send a Direct Message</h2>
              <p className="text-xs text-[#6e747c]">
                Average response turnaround is under 2 hours during concierge hours (9 AM - 9 PM IST).
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#edf5f0] border border-[#d2e4d8] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#143e2e] mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-[#143e2e]">Inquiry Transmitted Successfully</h3>
                <p className="text-xs text-[#33373b]">
                  A dedicated ARKA Client Advisor will reach out via email or phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#33373b] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-2.5 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#33373b] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.in"
                      className="w-full px-4 py-2.5 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#33373b] mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 XXXXX"
                      className="w-full px-4 py-2.5 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#33373b] mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none"
                    >
                      <option value="VIP Concierge Inquiry">VIP Concierge Inquiry</option>
                      <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                      <option value="Corporate & B2B GST Invoicing">Corporate & B2B GST Invoicing</option>
                      <option value="Squad Room Collaboration">Squad Room Collaboration</option>
                      <option value="Product Sizing & Audio Specs">Product Sizing & Audio Specs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#33373b] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how our concierge team may assist you..."
                    className="w-full px-4 py-3 bg-[#fbfaf8] border border-[#e8e6e1] rounded-xl text-xs text-[#111315] focus:border-[#143e2e] focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Concierge</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Channels & Boutiques (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Concierge Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#143e2e] text-white shadow-md space-y-4">
              <div className="flex items-center gap-2 text-[#c5a059]">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-sm">Instant WhatsApp Concierge</h3>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Need immediate answers on product dimensions or express dispatch? Chat directly with an ARKA advisor on WhatsApp.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=919820145678&text=Hi%20ARKA%20Luxe%20Concierge,%20I%20have%20an%20inquiry%20regarding%20an%20atelier%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Direct Channels */}
            <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#111315]">Direct Atelier Channels</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#143e2e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#111315]">Concierge Line (Pan-India):</span>
                    <span className="text-[#6e747c] font-mono">+91 80 4920 8400 / +91 98201 45678</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#143e2e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#111315]">Official Correspondence:</span>
                    <span className="text-[#6e747c] font-mono">concierge@arkaluxe.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#143e2e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#111315]">Concierge Operating Hours:</span>
                    <span className="text-[#6e747c]">Mon - Sun: 09:00 AM – 09:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flagship Lounges */}
            <div className="p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#111315]">Experience Lounges</h3>
              <div className="space-y-2 text-xs text-[#6e747c]">
                <p>
                  <strong className="text-[#111315]">Bengaluru Atelier:</strong> 100ft Road, Indiranagar, 560038
                </p>
                <p>
                  <strong className="text-[#111315]">Mumbai Private Suite:</strong> Maker Maxity, BKC, 400051
                </p>
                <p>
                  <strong className="text-[#111315]">New Delhi Heritage Lounge:</strong> The Dhan Mill, Chattarpur, 110074
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
