'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useSocialRoomStore, SharedCartItem } from '@/stores/social-room-store'
import { useCartStore } from '@/stores/cart-store'
import { INITIAL_PRODUCTS } from '@/lib/products-data'
import { formatINR, calculateEMI } from '@/lib/format'
import { ArkaCrest } from '@/components/icons/ArkaCrest'
import { CopFlameIcon, DropShieldIcon, VerifiedBadgeIcon } from '@/components/icons/VotingIcons'
import { UpiIcon, RuPayIcon, ApplePayIcon } from '@/components/icons/PaymentIcons'
import {
  Users,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  Plus,
  Send,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Share2,
  HelpCircle,
  Zap,
  TrendingUp,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Radio,
  Clock
} from 'lucide-react'

function SquadContent() {
  const searchParams = useSearchParams()
  const urlProduct = searchParams.get('product')
  const urlRoomCode = searchParams.get('code') || searchParams.get('room')

  const {
    inRoom,
    roomCode,
    userName,
    participants,
    sharedItems,
    messages,
    createRoom,
    joinRoom,
    syncRoom,
    setUserName,
    addSharedItem,
    voteOnItem,
    simulateFriendVotes,
    removeSharedItem,
    sendMessage,
  } = useSocialRoomStore()

  const { addItem, openCart } = useCartStore()

  const [copiedLink, setCopiedLink] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [selectedCatalogId, setSelectedCatalogId] = useState('')
  const [customQuestionInput, setCustomQuestionInput] = useState('')
  const [mobileTab, setMobileTab] = useState<'polls' | 'chat'>('polls')
  
  // Voting with optional comment modal/popover
  const [votingItemId, setVotingItemId] = useState<string | null>(null)
  const [pendingVoteType, setPendingVoteType] = useState<'up' | 'down'>('up')
  const [voteCommentInput, setVoteCommentInput] = useState('')

  // Guest Name prompt modal for invited friends
  const [showNameModal, setShowNameModal] = useState(false)
  const [guestNameInput, setGuestNameInput] = useState('')

  const chatScrollRef = useRef<HTMLDivElement>(null)

  // 1. Initial Room Join / URL room detection
  useEffect(() => {
    const targetRoom = urlRoomCode ? urlRoomCode.toUpperCase() : roomCode || 'ARKA-1001'

    if (!userName || userName === 'Friend' || userName === 'Invited Friend') {
      if (urlRoomCode) {
        setShowNameModal(true)
      } else {
        setUserName('You (Host)')
        joinRoom(targetRoom, 'You (Host)')
      }
    } else {
      joinRoom(targetRoom, userName)
    }

    if (urlProduct) {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === urlProduct)
      if (prod) {
        addSharedItem(prod, 'Should I buy this? Need squad votes before checking out!')
      }
    }
  }, [urlRoomCode, urlProduct])

  // 2. Real-time Multi-Device Polling Engine (Every 1.8 seconds)
  useEffect(() => {
    const activeCode = urlRoomCode || roomCode || 'ARKA-1001'
    syncRoom(activeCode)

    const interval = setInterval(() => {
      syncRoom(activeCode)
    }, 1800)

    // BroadcastChannel cross-tab listener for 0ms instant sync
    let bc: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('arka_squad_sync')
        bc.onmessage = () => {
          syncRoom(activeCode)
        }
      } catch {
        // ignore
      }
    }

    return () => {
      clearInterval(interval)
      if (bc) bc.close()
    }
  }, [urlRoomCode, roomCode, syncRoom])

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages])

  const handleCopyInvite = () => {
    const activeCode = roomCode || 'ARKA-1001'
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/squad?room=${activeCode}`
      : `http://localhost:3000/squad?room=${activeCode}`

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const handleOpenVoteModal = (productId: string, vote: 'up' | 'down') => {
    setVotingItemId(productId)
    setPendingVoteType(vote)
    setVoteCommentInput('')
  }

  const handleConfirmVote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!votingItemId) return

    const voter = userName || 'Friend'
    const defaultComment = pendingVoteType === 'up' ? '100% COP IT! Quality is elite 🔥' : 'DEMOTE / Maybe look for alternatives 🛑'
    const finalComment = voteCommentInput.trim() || defaultComment

    await voteOnItem(votingItemId, pendingVoteType, voter, finalComment)
    setVotingItemId(null)
    setVoteCommentInput('')

    if (pendingVoteType === 'up') {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#143e2e', '#c5a059', '#10b981'],
        })
      } catch {
        // ignore
      }
    }
  }

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCatalogId) return
    const prod = INITIAL_PRODUCTS.find((p) => p.id === selectedCatalogId)
    if (prod) {
      await addSharedItem(
        prod,
        customQuestionInput || 'Should I buy this? Need squad votes before checking out!',
        userName || 'You'
      )
      setSelectedCatalogId('')
      setCustomQuestionInput('')
    }
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    await sendMessage(chatInput)
    setChatInput('')
  }

  const handleJoinWithName = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = guestNameInput.trim() || 'Invited Friend'
    setUserName(name)
    const code = urlRoomCode || roomCode || 'ARKA-1001'
    await joinRoom(code, name)
    setShowNameModal(false)
  }

  const activeShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/squad?room=${roomCode || 'ARKA-1001'}`
    : `http://localhost:3000/squad?room=ARKA-1001`

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-[#111315] selection:bg-[#143e2e] selection:text-[#c5a059]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* Top Header Hero with Custom Gold Crest SVG */}
        <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#fbfaf8] to-[#edf5f0] border border-[#e8e6e1] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#143e2e]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edf5f0] border border-[#d2e4d8] text-xs font-mono font-bold text-[#143e2e]">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>LIVE COLLABORATIVE SQUAD • ROOM #{roomCode || 'ARKA-1001'}</span>
              </div>
              <div className="flex items-center gap-3">
                <ArkaCrest size={40} className="shrink-0" />
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111315] font-serif tracking-tight leading-tight">
                  Shopping Squad Decision Lounge
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#6e747c] leading-relaxed">
                Share your private link with friends. When they cast their verdict, their votes and personalized reasons appear <strong className="text-[#143e2e]">live with their name</strong> on this dashboard across any browser or mobile device.
              </p>
            </div>

            {/* Share Link Actions (Touch optimized for all mobile screens) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={handleCopyInvite}
                className="min-h-[48px] px-5 py-3 rounded-full bg-[#143e2e] hover:bg-[#1b523d] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Invite Link'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Hey! Vote on this purchase with me on ARKA Squad: Should I buy it? Click here to vote: ${activeShareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Friends</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Active Participants Ribbon */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e6e1] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-[#143e2e] uppercase">
              Live Connected Squad:
            </span>
            <span className="text-xs text-[#6e747c]">
              Logged in as: <strong className="text-[#111315]">{userName || 'You'}</strong>
            </span>
            <button
              onClick={() => setShowNameModal(true)}
              className="text-[11px] font-mono text-[#c5a059] underline hover:text-[#9e7d38] ml-1 cursor-pointer"
            >
              (Edit Name)
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
            <span className="text-xs font-mono text-[#6e747c] shrink-0">Friends ({participants.length}):</span>
            {participants.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f2ee] border border-[#e8e6e1] text-xs font-semibold shrink-0"
              >
                <span className="w-5 h-5 rounded-full bg-[#143e2e] text-[#c5a059] font-bold text-[10px] flex items-center justify-center">
                  {p.avatar}
                </span>
                <span>{p.name}</span>
                {p.isHost && (
                  <span className="text-[9px] font-mono bg-[#c5a059]/20 text-[#8d6e2e] px-1.5 py-0.2 rounded font-bold">
                    Host
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Add Product Dilemma Form */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e8e6e1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#143e2e]" />
              <h3 className="text-sm font-bold text-[#111315]">
                Ask Squad on Any Product: &ldquo;Should I Buy It?&rdquo;
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#6e747c]">18 Master Items Available</span>
          </div>

          <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#e8e6e1] bg-[#fbfaf8] text-xs text-[#111315] font-medium focus:border-[#143e2e] focus:bg-white transition-all flex-1"
            >
              <option value="">Choose item to submit for Squad vote...</option>
              {INITIAL_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({formatINR(prod.price)}) — {prod.category}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Custom question (e.g. Is it worth ₹29,999? Cop or drop?)"
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#e8e6e1] bg-[#fbfaf8] text-xs text-[#111315] placeholder:text-[#6e747c] focus:border-[#143e2e] focus:bg-white transition-all flex-1"
            />

            <button
              type="submit"
              disabled={!selectedCatalogId}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#143e2e] hover:bg-[#1b523d] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Poll</span>
            </button>
          </form>
        </div>

        {/* Mobile Tab Switcher (Touch friendly segmented control) */}
        <div className="lg:hidden flex bg-[#e8e6e1]/60 p-1 rounded-full">
          <button
            onClick={() => setMobileTab('polls')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'polls' ? 'bg-[#143e2e] text-white shadow-sm' : 'text-[#6e747c]'
            }`}
          >
            <span>Squad Dilemmas</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {sharedItems.length}
            </span>
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'chat' ? 'bg-[#143e2e] text-white shadow-sm' : 'text-[#6e747c]'
            }`}
          >
            <span>Live Chat</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {messages.length}
            </span>
          </button>
        </div>

        {/* Main Grid: Shortlist Dilemma Cards & Live Chat Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Dilemmas & Live Voting Stream (8 cols) */}
          <div className={`lg:col-span-8 space-y-6 ${mobileTab === 'chat' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#e8e6e1]">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-[#111315] flex items-center gap-2">
                  <span>Active Squad Polls</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#edf5f0] text-[#143e2e] text-xs font-mono font-bold">
                    {sharedItems.length}
                  </span>
                </h2>
                <p className="text-xs text-[#6e747c]">
                  Real-time consensus updates automatically when your friends vote from their link.
                </p>
              </div>
            </div>

            {sharedItems.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-[#e8e6e1] text-center space-y-4 shadow-sm">
                <HelpCircle className="w-12 h-12 text-[#d6d3cb] mx-auto" />
                <h4 className="text-base font-bold text-[#111315]">No Active Squad Dilemmas</h4>
                <p className="text-xs text-[#6e747c] max-w-sm mx-auto">
                  Pick any luxury item from the selector above or browse our master catalog and ask &ldquo;Should I Buy It?&rdquo;
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#143e2e] text-white font-bold text-xs shadow-md"
                >
                  Browse Master Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {sharedItems.map((item) => {
                  const totalVotes = item.upvotes + item.downvotes
                  const winPercentage = totalVotes > 0 ? Math.round((item.upvotes / totalVotes) * 100) : 50
                  const isWinning = item.upvotes > item.downvotes
                  const isDemoted = item.downvotes > item.upvotes

                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-7 rounded-3xl bg-white border border-[#e8e6e1] shadow-md hover:shadow-lg transition-all space-y-5"
                    >
                      {/* Product Header Row */}
                      <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#f4f2ee] shrink-0 border border-[#e8e6e1] shadow-xs">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                            {item.product.badge && (
                              <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#143e2e] text-white">
                                {item.product.badge}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059] font-bold">
                              {item.product.category} • Submitted by {item.addedBy}
                            </span>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="text-base sm:text-lg font-bold text-[#111315] hover:text-[#143e2e] transition-colors block leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-xl font-extrabold text-[#143e2e] font-mono">
                                {formatINR(item.product.price)}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-xs line-through text-[#6e747c] font-mono">
                                  {formatINR(item.product.originalPrice)}
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-[#6e747c] bg-[#f4f2ee] px-2 py-0.5 rounded">
                                EMI: {formatINR(calculateEMI(item.product.price, 6))}/mo
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeSharedItem(item.product.id)}
                          className="p-2 text-[#6e747c] hover:text-rose-600 transition-colors cursor-pointer self-end sm:self-start"
                          title="Remove poll"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dilemma Question Callout */}
                      <div className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#e8e6e1] space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#6e747c] uppercase flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#143e2e]" />
                          <span>Dilemma Question for Friends:</span>
                        </span>
                        <p className="text-sm font-semibold text-[#111315] italic">
                          &ldquo;{item.question}&rdquo;
                        </p>
                      </div>

                      {/* Live Consensus Meter Bar */}
                      <div className="p-4 rounded-2xl bg-[#f4f2ee] border border-[#e8e6e1] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold uppercase text-[#111315]">
                              Live Consensus:
                            </span>
                            <span className="text-xs font-bold text-[#143e2e]">
                              {item.upvotes} Cop / {item.downvotes} Drop ({totalVotes} votes total)
                            </span>
                          </div>

                          {/* Verdict Pill */}
                          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                            isWinning
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isDemoted
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isWinning ? (
                              <>
                                <VerifiedBadgeIcon size={16} />
                                <span>APPROVED: COP IT NOW 🔥 ({winPercentage}%)</span>
                              </>
                            ) : isDemoted ? (
                              <>
                                <DropShieldIcon size={16} />
                                <span>VERDICT: DEMOTED / PASS 🛑</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                <span>TIED (Awaiting friend votes)</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            style={{ width: `${winPercentage}%` }}
                            className="bg-emerald-600 transition-all duration-500 ease-out"
                          />
                          <div
                            style={{ width: `${100 - winPercentage}%` }}
                            className="bg-rose-500 transition-all duration-500 ease-out"
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-mono text-[#6e747c]">
                          <span className="text-emerald-700 font-bold">▲ {winPercentage}% Cop It (Win Upward)</span>
                          <span className="text-rose-700 font-bold">▼ {100 - winPercentage}% Demote (Drop It)</span>
                        </div>
                      </div>

                      {/* Vote Buttons (Touch targets >= 48px for all mobile devices) */}
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* UPVOTE / COP IT BUTTON */}
                          <button
                            onClick={() => handleOpenVoteModal(item.product.id, 'up')}
                            className={`min-h-[48px] py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm active:scale-95 ${
                              item.userVote === 'up'
                                ? 'bg-[#143e2e] text-white ring-2 ring-[#c5a059]'
                                : 'bg-[#edf5f0] hover:bg-[#d2e4d8] text-[#143e2e] border border-[#d2e4d8]'
                            }`}
                          >
                            <CopFlameIcon size={18} />
                            <span>🔥 COP IT / WIN UPWARD ({item.upvotes})</span>
                          </button>

                          {/* DOWNVOTE / DEMOTE BUTTON */}
                          <button
                            onClick={() => handleOpenVoteModal(item.product.id, 'down')}
                            className={`min-h-[48px] py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm active:scale-95 ${
                              item.userVote === 'down'
                                ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <DropShieldIcon size={18} />
                            <span>🛑 DEMOTE / PASS ({item.downvotes})</span>
                          </button>
                        </div>

                        {/* Action buttons: Simulate Friends & Squad Approved Checkout */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                          <button
                            onClick={() => simulateFriendVotes(item.product.id)}
                            className="min-h-[42px] py-2.5 px-4 rounded-full bg-[#fbf6ec] hover:bg-[#f5ebd2] border border-[#f0e3cc] text-[#111315] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#c5a059] group-hover:rotate-12 transition-transform" />
                            <span>Simulate 2 Friend Votes (Meera, Rohan)</span>
                          </button>

                          {isWinning && (
                            <button
                              onClick={() => {
                                addItem(item.product)
                                openCart()
                              }}
                              className="min-h-[42px] py-2.5 px-5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer animate-in zoom-in-95 duration-200"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                              <span>Squad Approved: Add to Cart (10% Off)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Real-time Friend Verdicts & Reasons with Actual Names */}
                      {item.voters && item.voters.length > 0 && (
                        <div className="pt-4 border-t border-[#e8e6e1] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-[#6e747c] uppercase flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-[#143e2e]" />
                              <span>Friend Verdicts with Real Names ({item.voters.length}):</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-bold">
                              Live Real-time Synced
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {item.voters.map((v) => (
                              <div
                                key={v.id}
                                className="p-3.5 rounded-2xl bg-[#fbfaf8] border border-[#e8e6e1] flex items-start gap-3 text-xs shadow-2xs hover:border-[#143e2e]/30 transition-colors"
                              >
                                <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 text-white shadow-xs ${
                                  v.vote === 'up' ? 'bg-[#143e2e]' : 'bg-rose-600'
                                }`}>
                                  {v.avatar}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="font-bold text-[#111315] truncate text-xs">
                                      {v.name}
                                    </span>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                      v.vote === 'up'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                                    }`}>
                                      {v.vote === 'up' ? '▲ COP IT' : '▼ DEMOTE'}
                                    </span>
                                  </div>
                                  {v.comment && (
                                    <p className="text-[11px] text-[#4b5158] mt-1 font-medium italic">
                                      &ldquo;{v.comment}&rdquo;
                                    </p>
                                  )}
                                  <span className="text-[9px] font-mono text-[#6e747c] block mt-1">
                                    {v.time}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Perks Ribbon */}
                      <div className="pt-2 border-t border-[#f4f2ee] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#6e747c]">
                        <div className="flex items-center gap-2">
                          <span>Supported Squad Checkout:</span>
                          <UpiIcon className="h-4 w-auto" />
                          <RuPayIcon className="h-4 w-auto" />
                          <ApplePayIcon className="h-4 w-auto" />
                        </div>
                        <span className="text-[#143e2e] font-bold">
                          Free Express Shipping on All Squad Approved Orders
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Live Chat Stream (4 cols) */}
          <div className={`lg:col-span-4 ${mobileTab === 'polls' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white border border-[#e8e6e1] rounded-3xl shadow-md p-5 flex flex-col h-[650px] sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e6e1]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#143e2e]" />
                  <h3 className="text-sm font-bold text-[#111315]">Live Squad Chat</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Real-time Active
                </span>
              </div>

              {/* Chat Message Feed */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      m.isSystem ? 'bg-[#edf5f0] p-3 rounded-2xl border border-[#d2e4d8]' : ''
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#143e2e] text-[#c5a059] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {m.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-bold text-[#111315] text-[11px] truncate">
                          {m.sender}
                        </span>
                        <span className="text-[9px] font-mono text-[#6e747c]">{m.time}</span>
                      </div>
                      <p className="text-[11px] text-[#33373b] mt-0.5 leading-relaxed break-words">
                        {m.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendChat} className="pt-3 border-t border-[#e8e6e1] flex gap-2">
                <input
                  type="text"
                  placeholder="Drop a squad comment..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-[42px] px-3.5 py-2 bg-[#fbfaf8] border border-[#e8e6e1] rounded-full text-xs text-[#111315] placeholder:text-[#6e747c] focus:border-[#143e2e] focus:bg-white flex-1 transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="min-h-[42px] w-11 h-11 rounded-full bg-[#143e2e] hover:bg-[#1b523d] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Guest Name Prompt Dialog (Appears when someone opens the shared link) */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#e8e6e1] shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#edf5f0] text-[#143e2e] flex items-center justify-center mx-auto border border-[#d2e4d8]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111315] font-serif">
                Join Squad Room #{roomCode || 'ARKA-1001'}
              </h3>
              <p className="text-xs text-[#6e747c]">
                Enter your name so your friend can see your vote and decision in their live dashboard!
              </p>
            </div>

            <form onSubmit={handleJoinWithName} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#111315] mb-1.5 uppercase">
                  Your Full Name or Nickname:
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Sarah, Dev, Kabir, Ananya"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#e8e6e1] text-sm text-[#111315] focus:border-[#143e2e] transition-all bg-[#fbfaf8]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="min-h-[44px] flex-1 py-2.5 rounded-full border border-[#e8e6e1] text-xs font-bold text-[#6e747c] hover:bg-[#f4f2ee] transition-all cursor-pointer"
                >
                  Continue as Guest
                </button>
                <button
                  type="submit"
                  disabled={!guestNameInput.trim()}
                  className="min-h-[44px] flex-1 py-2.5 rounded-full bg-[#143e2e] hover:bg-[#1b523d] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Join & Vote Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vote Reasoning Dialog (Prompts friend for their customized reason) */}
      {votingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#e8e6e1] shadow-2xl p-6 sm:p-7 max-w-md w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-[#e8e6e1]">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                pendingVoteType === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {pendingVoteType === 'up' ? <CopFlameIcon size={18} /> : <DropShieldIcon size={18} />}
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#111315]">
                  {pendingVoteType === 'up' ? 'Cast "COP IT" Verdict' : 'Cast "DEMOTE / PASS" Verdict'}
                </h3>
                <p className="text-[11px] text-[#6e747c]">
                  Voting as: <strong className="text-[#143e2e]">{userName || 'Friend'}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmVote} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#111315] mb-1.5 uppercase">
                  Add a Reason for Your Friend (Optional):
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    pendingVoteType === 'up'
                      ? 'e.g. 100% buy this! The sound fidelity and materials are worth every rupee.'
                      : 'e.g. Maybe wait for the sale next month or compare the alternative model.'
                  }
                  value={voteCommentInput}
                  onChange={(e) => setVoteCommentInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#e8e6e1] text-xs text-[#111315] focus:border-[#143e2e] transition-all bg-[#fbfaf8]"
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setVotingItemId(null)}
                  className="min-h-[44px] flex-1 py-2.5 rounded-full border border-[#e8e6e1] text-xs font-bold text-[#6e747c] hover:bg-[#f4f2ee] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`min-h-[44px] flex-1 py-2.5 rounded-full text-white text-xs font-bold transition-all shadow-md cursor-pointer ${
                    pendingVoteType === 'up'
                      ? 'bg-[#143e2e] hover:bg-[#1b523d]'
                      : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  Confirm Vote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function SquadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center font-mono text-xs">Loading Squad Room...</div>}>
      <SquadContent />
    </Suspense>
  )
}
