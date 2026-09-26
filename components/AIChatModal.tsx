'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, X, Send, Bot, User, Plus, Check } from 'lucide-react'
import { Product, ChatMessage } from '@/types'
import { useCartStore } from '@/stores/cart-store'
import { formatINR } from '@/lib/format'

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const { addItem } = useCartStore()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Namaste! I am ARKA Mitra, your private shopping concierge. Tell me what luxury department you wish to explore—from Swiss automatic timepieces and haute perfumery to planar audio, designer apparel, and gourmet provisions—and I shall curate the finest selections for you.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'Haute perfumery & fragrances',
    'Swiss automatic watches',
    'Planar headphones with ANC',
    'Pan-India delivery & COD options',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  if (!isOpen) return null

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts: data.recommendations,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        throw new Error(data.error)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'I apologize, but our concierge link is experiencing high network volume. Feel free to browse our 190+ department catalog directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog (Bright Light Luxury Theme) */}
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[650px] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#fbfaf8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#143e2e] flex items-center justify-center text-[#c5a059] shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 font-serif">ARKA Mitra Concierge</h3>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Luxury Advisor
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">190+ products across 8 departments indexed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close concierge"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#143e2e] text-white font-medium ml-auto rounded-tr-sm'
                      : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-tl-sm'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                <div
                  className={`text-[10px] font-mono ${
                    msg.role === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Recommendations Carousel/List */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#143e2e]/40 flex gap-2.5 items-center transition-all shadow-sm"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${p.id}`}
                            onClick={onClose}
                            className="text-xs font-bold text-stone-900 hover:text-[#143e2e] truncate block"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] font-mono font-bold text-[#143e2e]">{formatINR(p.price)}</span>
                        </div>
                        <button
                          onClick={() => addItem(p)}
                          className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-[#143e2e] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                          title="Add to Bag"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-[#143e2e]/10 border border-[#143e2e]/20 flex items-center justify-center text-[#143e2e] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#143e2e] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#143e2e] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#143e2e] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Strip */}
        <div className="px-6 py-2.5 bg-stone-50/70 border-t border-stone-200 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 hover:text-[#143e2e] hover:border-emerald-200 border border-stone-200 text-stone-700 font-medium transition-all cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(input)
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask for horology, fragrances, audio, gifts, or courier times..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#143e2e] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-[#143e2e] hover:bg-[#0e2c20] text-[#c5a059] font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
