import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'
import { INITIAL_PRODUCTS } from '@/lib/products-data'

export interface FriendVote {
  id: string
  name: string
  avatar: string
  vote: 'up' | 'down'
  comment?: string
  time: string
}

export interface Participant {
  id: string
  name: string
  avatar: string
  status: 'active' | 'browsing' | 'reviewing'
  currentViewing?: string
  isHost?: boolean
  joinedAt?: string
}

export interface SharedCartItem {
  id: string
  product: Product
  question: string
  addedBy: string
  addedAt: string
  upvotes: number
  downvotes: number
  userVote?: 'up' | 'down'
  voters: FriendVote[]
  verdict: 'win' | 'demote' | 'tied'
}

export interface RoomMessage {
  id: string
  sender: string
  avatar: string
  text: string
  time: string
  isSystem?: boolean
}

interface SocialRoomStore {
  inRoom: boolean
  roomCode: string
  userName: string
  isSyncing: boolean
  participants: Participant[]
  sharedItems: SharedCartItem[]
  messages: RoomMessage[]

  // Real-time server sync actions
  createRoom: (hostName?: string) => Promise<string>
  joinRoom: (code: string, name: string) => Promise<void>
  syncRoom: (code?: string) => Promise<void>
  leaveRoom: () => void
  setUserName: (name: string) => void
  addSharedItem: (product: Product, question?: string, addedByName?: string) => Promise<void>
  voteOnItem: (productId: string, vote: 'up' | 'down', voterName?: string, comment?: string) => Promise<void>
  simulateFriendVotes: (productId: string) => Promise<void>
  removeSharedItem: (productId: string) => Promise<void>
  sendMessage: (text: string) => Promise<void>
}

// Multi-tab broadcast channel for instantaneous zero-latency updates on same device
let broadcastChannel: BroadcastChannel | null = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('arka_squad_sync')
  } catch {
    // ignore
  }
}

function notifyTabs(action: string, code: string) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ action, code, timestamp: Date.now() })
    } catch {
      // ignore
    }
  }
}

export const useSocialRoomStore = create<SocialRoomStore>()(
  persist(
    (set, get) => ({
      inRoom: false,
      roomCode: '',
      userName: '',
      isSyncing: false,
      participants: [],
      sharedItems: [],
      messages: [],

      setUserName: (name: string) => {
        set({ userName: name.trim() })
      },

      createRoom: async (hostName?: string) => {
        const user = (hostName && hostName.trim()) || get().userName || 'You (Host)'

        try {
          const res = await fetch('/api/squad/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hostName: user }),
          })

          const data = await res.json()
          if (data.success && data.room) {
            set({
              inRoom: true,
              roomCode: data.room.code,
              userName: user,
              participants: data.room.participants,
              sharedItems: data.room.sharedItems,
              messages: data.room.messages,
            })
            notifyTabs('room_created', data.room.code)
            return data.room.code
          }
        } catch (err) {
          console.error('Failed to create server room, activating fallback:', err)
        }

        // Local fallback if offline
        const fallbackCode = `ARKA-${Math.floor(1000 + Math.random() * 9000)}`
        set({
          inRoom: true,
          roomCode: fallbackCode,
          userName: user,
        })
        return fallbackCode
      },

      joinRoom: async (code: string, name: string) => {
        const cleanCode = (code || 'ARKA-1001').toUpperCase().trim()
        const user = (name && name.trim()) || get().userName || 'Friend'

        try {
          const res = await fetch(`/api/squad/rooms/${cleanCode}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: user }),
          })

          const data = await res.json()
          if (data.success && data.room) {
            set({
              inRoom: true,
              roomCode: cleanCode,
              userName: user,
              participants: data.room.participants,
              sharedItems: data.room.sharedItems,
              messages: data.room.messages,
            })
            notifyTabs('user_joined', cleanCode)
            return
          }
        } catch (err) {
          console.error('Failed to join server room:', err)
        }

        // Fallback
        set({
          inRoom: true,
          roomCode: cleanCode,
          userName: user,
        })
      },

      syncRoom: async (code?: string) => {
        const activeCode = code || get().roomCode
        if (!activeCode) return

        try {
          const res = await fetch(`/api/squad/rooms/${activeCode}`)
          const data = await res.json()

          if (data.success && data.room) {
            const currentUser = get().userName

            // Maintain user's own active vote highlights
            const serverItems: SharedCartItem[] = data.room.sharedItems.map((item: SharedCartItem) => {
              const myVote = item.voters.find(
                (v) => v.name.toLowerCase() === currentUser.toLowerCase()
              )?.vote
              return {
                ...item,
                userVote: myVote,
              }
            })

            set({
              participants: data.room.participants,
              sharedItems: serverItems,
              messages: data.room.messages,
              roomCode: data.room.code,
              inRoom: true,
            })
          }
        } catch (err) {
          // ignore network polling hiccups
        }
      },

      leaveRoom: () => {
        set({
          inRoom: false,
          roomCode: '',
          userName: '',
          participants: [],
          sharedItems: [],
          messages: [],
        })
      },

      addSharedItem: async (product: Product, question?: string, addedByName?: string) => {
        const code = get().roomCode || 'ARKA-1001'
        const user = addedByName || get().userName || 'You'
        const dilemmaText = question?.trim() || 'Should I buy this? Need squad votes before checking out!'

        try {
          const res = await fetch(`/api/squad/rooms/${code}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product,
              question: dilemmaText,
              addedByName: user,
            }),
          })

          const data = await res.json()
          if (data.success && data.room) {
            set({
              inRoom: true,
              roomCode: data.room.code,
              sharedItems: data.room.sharedItems,
              messages: data.room.messages,
            })
            notifyTabs('item_added', code)
            return
          }
        } catch (err) {
          console.error('Failed to add item to server room:', err)
        }
      },

      voteOnItem: async (productId: string, vote: 'up' | 'down', voterName?: string, comment?: string) => {
        const code = get().roomCode || 'ARKA-1001'
        const user = voterName || get().userName || 'Friend'

        // 1. Optimistic UI update for 0ms response
        const currentItems = get().sharedItems
        const updatedItems = currentItems.map((item) => {
          if (item.product.id !== productId) return item

          let up = item.upvotes
          let down = item.downvotes
          const voters = [...item.voters]
          const existingIdx = voters.findIndex((v) => v.name.toLowerCase() === user.toLowerCase())

          if (item.userVote === 'up') up = Math.max(0, up - 1)
          if (item.userVote === 'down') down = Math.max(0, down - 1)

          if (vote === 'up') up += 1
          if (vote === 'down') down += 1

          const newVote: FriendVote = {
            id: `vote-${Date.now()}`,
            name: user,
            avatar: (user[0] || 'F').toUpperCase(),
            vote,
            comment: comment || (vote === 'up' ? 'Voted COP IT / WIN! 🔥' : 'Voted DEMOTE / PASS 🛑'),
            time: 'Just now',
          }

          if (existingIdx !== -1) {
            voters[existingIdx] = newVote
          } else {
            voters.unshift(newVote)
          }

          const verdict: 'win' | 'demote' | 'tied' = up > down ? 'win' : down > up ? 'demote' : 'tied'
          return {
            ...item,
            upvotes: up,
            downvotes: down,
            userVote: vote,
            voters,
            verdict,
          }
        })

        set({ sharedItems: updatedItems })

        // 2. Dispatch to server for multi-device broadcast
        try {
          const res = await fetch(`/api/squad/rooms/${code}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId,
              vote,
              voterName: user,
              comment,
            }),
          })

          const data = await res.json()
          if (data.success && data.room) {
            set({
              participants: data.room.participants,
              sharedItems: data.room.sharedItems.map((item: SharedCartItem) => ({
                ...item,
                userVote: item.voters.find((v) => v.name.toLowerCase() === user.toLowerCase())?.vote,
              })),
              messages: data.room.messages,
            })
            notifyTabs('vote_cast', code)
          }
        } catch (err) {
          console.error('Failed to sync vote with server:', err)
        }
      },

      simulateFriendVotes: async (productId: string) => {
        const code = get().roomCode || 'ARKA-1001'

        try {
          const res = await fetch(`/api/squad/rooms/${code}/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })

          const data = await res.json()
          if (data.success && data.room) {
            const currentUser = get().userName
            set({
              participants: data.room.participants,
              sharedItems: data.room.sharedItems.map((item: SharedCartItem) => ({
                ...item,
                userVote: item.voters.find((v) => v.name.toLowerCase() === currentUser.toLowerCase())?.vote,
              })),
              messages: data.room.messages,
            })
            notifyTabs('simulated_vote', code)
          }
        } catch (err) {
          console.error('Failed to simulate friend votes:', err)
        }
      },

      removeSharedItem: async (productId: string) => {
        const code = get().roomCode || 'ARKA-1001'

        try {
          const res = await fetch(`/api/squad/rooms/${code}/items?productId=${productId}`, {
            method: 'DELETE',
          })
          const data = await res.json()
          if (data.success && data.room) {
            set({
              sharedItems: data.room.sharedItems,
            })
            notifyTabs('item_removed', code)
            return
          }
        } catch {
          // ignore
        }

        set({
          sharedItems: get().sharedItems.filter((i) => i.product.id !== productId),
        })
      },

      sendMessage: async (text: string) => {
        const code = get().roomCode || 'ARKA-1001'
        const user = get().userName || 'Friend'
        const cleanText = text.trim()
        if (!cleanText) return

        try {
          const res = await fetch(`/api/squad/rooms/${code}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, sender: user }),
          })
          const data = await res.json()
          if (data.success && data.room) {
            set({ messages: data.room.messages })
            notifyTabs('message_sent', code)
            return
          }
        } catch {
          // ignore
        }

        const newMsg: RoomMessage = {
          id: `msg-${Date.now()}`,
          sender: user,
          avatar: (user[0] || 'F').toUpperCase(),
          text: cleanText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        set({ messages: [...get().messages, newMsg] })
      },
    }),
    {
      name: 'arka-social-squad-room',
      partialize: (state) => ({
        inRoom: state.inRoom,
        roomCode: state.roomCode,
        userName: state.userName,
      }),
    }
  )
)
