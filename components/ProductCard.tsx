'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/stores/cart-store'
import { useSocialRoomStore } from '@/stores/social-room-store'
import { formatINR, calculateEMI } from '@/lib/format'
import { Star, Plus, Check, ArrowUpRight, Zap, Users, Flame } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { inRoom, createRoom, addSharedItem } = useSocialRoomStore()
  const [added, setAdded] = useState(false)
  const [squadAdded, setSquadAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleAddToSquad = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inRoom) {
      createRoom('You')
    }
    addSharedItem(product, `Should I buy ${product.name}? Cop or Drop?`, 'You')
    setSquadAdded(true)
    setTimeout(() => setSquadAdded(false), 2500)
  }

  const badgeColors: Record<string, string> = {
    Bestseller: 'bg-[#143e2e] text-emerald-100 font-bold border border-emerald-700/40',
    New: 'bg-zinc-900 text-white font-semibold',
    Featured: 'bg-[#c5a059] text-zinc-950 font-bold',
    Eco: 'bg-emerald-800 text-emerald-100 font-semibold',
    Limited: 'bg-[#701a1e] text-white font-semibold',
  }

  const monthlyEMI = calculateEMI(product.price, 6)

  return (
    <div className="group flex flex-col justify-between card-lift bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col flex-1 justify-between">
        
        {/* Image & Badge Area */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-100 mb-4">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${badgeColors[product.badge] || 'bg-zinc-800 text-white'}`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Floating Action Pills */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
            <Link
              href={`/products/${product.id}`}
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#143e2e] hover:scale-110 transition-all duration-200 shadow-sm"
              title="Inspect specifications"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToSquad}
              className={`w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
                squadAdded ? 'text-emerald-700 bg-emerald-50' : 'text-stone-600 hover:text-[#143e2e] hover:scale-110'
              }`}
              title="Ask Squad: Should I buy this?"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>

          {squadAdded && (
            <div className="absolute inset-x-2 bottom-2 z-20 bg-[#143e2e] text-white text-[10px] font-bold py-1.5 px-2 rounded-lg text-center shadow-md animate-in fade-in zoom-in-95 duration-150">
              Added to Squad Dilemma ✓
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1">
              <span className="uppercase tracking-wider font-semibold text-[#143e2e]">{product.category}</span>
              <div className="flex items-center gap-1 text-stone-700">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-stone-400">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#143e2e] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {product.subtitle && (
              <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-normal leading-relaxed">
                {product.subtitle}
              </p>
            )}

            {/* Indian EMI Callout */}
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-stone-600 bg-stone-100/70 px-2 py-0.5 rounded border border-stone-200/80 w-fit">
              <Zap className="w-2.5 h-2.5 text-[#c5a059]" />
              <span>No Cost EMI from {formatINR(monthlyEMI)}/mo</span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-950 font-mono">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-stone-400 font-mono">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddToSquad}
                className={`p-2 rounded-full border text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                  squadAdded
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-stone-50 hover:bg-[#143e2e]/10 text-stone-600 hover:text-[#143e2e] border-stone-200'
                }`}
                title="Ask Squad: Should I buy this?"
              >
                <Users className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm btn-shimmer active:scale-95 ${
                  added
                    ? 'bg-[#143e2e] text-[#c5a059]'
                    : 'bg-stone-900 hover:bg-[#143e2e] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
