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
  joinedAt: string
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

export interface SquadRoom {
  code: string
  hostName: string
  createdAt: string
  lastActiveAt: string
  participants: Participant[]
  sharedItems: SharedCartItem[]
  messages: RoomMessage[]
}

// Global server memory store for active squad rooms
const globalRooms = globalThis as unknown as {
  __squadRooms?: Map<string, SquadRoom>
}

if (!globalRooms.__squadRooms) {
  globalRooms.__squadRooms = new Map<string, SquadRoom>()
}

const roomsStore = globalRooms.__squadRooms

// Seed default initial room so ARKA-1001 or any default link works out-of-the-box
function createDefaultSeedRoom(code = 'ARKA-1001'): SquadRoom {
  const defaultProduct = INITIAL_PRODUCTS[0] // Aetheris Pro ANC Headphones
  const defaultDilemma: SharedCartItem = {
    id: `share-${defaultProduct.id}`,
    product: defaultProduct,
    question: 'Should I buy this for my new desk setup? Is ₹29,999 worth it or wait?',
    addedBy: 'Atelier Host',
    addedAt: 'Just now',
    upvotes: 3,
    downvotes: 1,
    voters: [
      {
        id: 'v-seed-1',
        name: 'Meera Rao',
        avatar: 'M',
        vote: 'up',
        comment: '100% COP IT! The planar drivers sound like a ₹1L studio monitor.',
        time: '5 mins ago',
      },
      {
        id: 'v-seed-2',
        name: 'Rohan Verma',
        avatar: 'R',
        vote: 'up',
        comment: 'Great investment if you work in noisy cafes. Battery is a beast.',
        time: '3 mins ago',
      },
      {
        id: 'v-seed-3',
        name: 'Kabir Mehta',
        avatar: 'K',
        vote: 'down',
        comment: 'Maybe wait for festive Diwali sale next month?',
        time: '1 min ago',
      },
    ],
    verdict: 'win',
  }

  const room: SquadRoom = {
    code: code.toUpperCase(),
    hostName: 'Atelier Host',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    participants: [
      { id: 'user-host', name: 'Atelier Host', avatar: 'A', status: 'active', isHost: true, joinedAt: 'Just now' },
      { id: 'user-meera', name: 'Meera Rao', avatar: 'M', status: 'browsing', currentViewing: 'Aetheris Pro ANC', joinedAt: '5 mins ago' },
      { id: 'user-rohan', name: 'Rohan Verma', avatar: 'R', status: 'active', currentViewing: 'Nocturne 65', joinedAt: '3 mins ago' },
    ],
    sharedItems: [defaultDilemma],
    messages: [
      {
        id: 'msg-seed-1',
        sender: 'ARKA Squad Concierge',
        avatar: '⚡',
        text: `Welcome to Squad Decision Lounge ${code}! Share this link with your friends to vote: "Should I Buy It? (Cop vs Drop)".`,
        time: 'Just now',
        isSystem: true,
      },
    ],
  }

  roomsStore.set(code.toUpperCase(), room)
  return room
}

// Seed the default room
if (!roomsStore.has('ARKA-1001')) {
  createDefaultSeedRoom('ARKA-1001')
}

export const squadRoomService = {
  /**
   * Get an existing room by code or create it if absent
   */
  getOrCreateRoom(code: string, hostName = 'You (Host)'): SquadRoom {
    const cleanCode = (code || 'ARKA-1001').toUpperCase().trim()
    let room = roomsStore.get(cleanCode)

    if (!room) {
      const defaultProduct = INITIAL_PRODUCTS[0]
      room = {
        code: cleanCode,
        hostName,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        participants: [
          {
            id: `user-${Date.now()}`,
            name: hostName,
            avatar: (hostName[0] || 'U').toUpperCase(),
            status: 'active',
            isHost: true,
            joinedAt: 'Just now',
          },
        ],
        sharedItems: [
          {
            id: `share-${defaultProduct.id}`,
            product: defaultProduct,
            question: 'Should I buy this? Need squad votes before checking out!',
            addedBy: hostName,
            addedAt: 'Just now',
            upvotes: 1,
            downvotes: 0,
            voters: [
              {
                id: `v-${Date.now()}`,
                name: hostName,
                avatar: (hostName[0] || 'U').toUpperCase(),
                vote: 'up',
                comment: 'Added by me for squad opinion!',
                time: 'Just now',
              },
            ],
            verdict: 'win',
          },
        ],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'ARKA Squad Concierge',
            avatar: '⚡',
            text: `Squad Room ${cleanCode} opened by ${hostName}. Share this invite URL with your friends to vote in real-time!`,
            time: 'Just now',
            isSystem: true,
          },
        ],
      }
      roomsStore.set(cleanCode, room)
    }

    return room
  },

  /**
   * Retrieve room by code (case-insensitive)
   */
  getRoom(code: string): SquadRoom | null {
    if (!code) return null
    const cleanCode = code.toUpperCase().trim()
    return roomsStore.get(cleanCode) || null
  },

  /**
   * Add or update participant in room
   */
  joinRoom(code: string, name: string): SquadRoom {
    const room = this.getOrCreateRoom(code)
    const cleanName = (name && name.trim()) || 'Invited Friend'
    const avatar = (cleanName[0] || 'F').toUpperCase()

    const existingIdx = room.participants.findIndex((p) => p.name.toLowerCase() === cleanName.toLowerCase())

    if (existingIdx === -1) {
      room.participants.push({
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        name: cleanName,
        avatar,
        status: 'active',
        joinedAt: 'Just now',
      })

      room.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'System',
        avatar: '⚡',
        text: `👋 ${cleanName} entered the Squad room to vote!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      })
    } else {
      room.participants[existingIdx].status = 'active'
    }

    room.lastActiveAt = new Date().toISOString()
    return room
  },

  /**
   * Cast vote with voter name, choice, and optional comment
   */
  castVote(
    code: string,
    productId: string,
    vote: 'up' | 'down',
    voterName: string,
    comment?: string
  ): SquadRoom {
    const room = this.getOrCreateRoom(code)
    const cleanName = (voterName && voterName.trim()) || 'Friend'
    const avatar = (cleanName[0] || 'F').toUpperCase()

    // Ensure voter is registered in participants
    this.joinRoom(code, cleanName)

    const item = room.sharedItems.find(
      (i) => i.product.id === productId || i.id === productId
    )
    if (!item) return room

    const existingVoterIdx = item.voters.findIndex(
      (v) => v.name.toLowerCase() === cleanName.toLowerCase()
    )

    const existingVote = existingVoterIdx !== -1 ? item.voters[existingVoterIdx].vote : null

    // If changing vote or new vote
    if (existingVote === 'up') item.upvotes = Math.max(0, item.upvotes - 1)
    if (existingVote === 'down') item.downvotes = Math.max(0, item.downvotes - 1)

    if (vote === 'up') item.upvotes += 1
    if (vote === 'down') item.downvotes += 1

    const voteRecord: FriendVote = {
      id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      avatar,
      vote,
      comment: comment?.trim() || (vote === 'up' ? 'Voted COP IT / WIN! 🔥' : 'Voted DEMOTE / PASS 🛑'),
      time: 'Just now',
    }

    if (existingVoterIdx !== -1) {
      item.voters[existingVoterIdx] = voteRecord
    } else {
      item.voters.unshift(voteRecord)
    }

    item.verdict = item.upvotes > item.downvotes ? 'win' : item.downvotes > item.upvotes ? 'demote' : 'tied'

    // Add chat stream announcement
    room.messages.push({
      id: `msg-${Date.now()}`,
      sender: cleanName,
      avatar,
      text: `Voted ${vote === 'up' ? '🔥 COP IT / WIN UPWARD' : '🛑 DEMOTE / PASS'}${
        comment ? `: "${comment}"` : ''
      }`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    room.lastActiveAt = new Date().toISOString()
    return room
  },

  /**
   * Add product dilemma to room
   */
  addItem(code: string, product: Product, question?: string, addedByName = 'You'): SquadRoom {
    const room = this.getOrCreateRoom(code, addedByName)
    const exists = room.sharedItems.find((i) => i.product.id === product.id)
    const dilemmaText = question?.trim() || 'Should I buy this? Need squad votes before checking out!'

    if (exists) {
      exists.question = dilemmaText
      return room
    }

    const newItem: SharedCartItem = {
      id: `share-${product.id}`,
      product,
      question: dilemmaText,
      addedBy: addedByName,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      upvotes: 1,
      downvotes: 0,
      voters: [
        {
          id: `v-${Date.now()}`,
          name: addedByName,
          avatar: (addedByName[0] || 'U').toUpperCase(),
          vote: 'up',
          comment: 'Added by me for squad opinion!',
          time: 'Just now',
        },
      ],
      verdict: 'win',
    }

    room.sharedItems.unshift(newItem)
    room.messages.push({
      id: `msg-${Date.now()}`,
      sender: addedByName,
      avatar: (addedByName[0] || 'U').toUpperCase(),
      text: `Asked Squad: "${product.name}" — "${dilemmaText}". Vote Cop or Drop!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    room.lastActiveAt = new Date().toISOString()
    return room
  },

  /**
   * Remove item from room
   */
  removeItem(code: string, productId: string): SquadRoom {
    const room = this.getOrCreateRoom(code)
    room.sharedItems = room.sharedItems.filter((i) => i.product.id !== productId)
    room.lastActiveAt = new Date().toISOString()
    return room
  },

  /**
   * Post chat message in room
   */
  sendMessage(code: string, sender: string, text: string): SquadRoom {
    const room = this.getOrCreateRoom(code)
    const cleanSender = (sender && sender.trim()) || 'Friend'
    const cleanText = text.trim()
    if (!cleanText) return room

    room.messages.push({
      id: `msg-${Date.now()}`,
      sender: cleanSender,
      avatar: (cleanSender[0] || 'F').toUpperCase(),
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    room.lastActiveAt = new Date().toISOString()
    return room
  },

  /**
   * Simulate votes from friends on server so all connected browsers see them live
   */
  simulateFriendVotes(code: string, productId: string): SquadRoom {
    const room = this.getOrCreateRoom(code)
    const item = room.sharedItems.find((i) => i.product.id === productId)
    if (!item) return room

    const friendCandidates = [
      { name: 'Meera Rao', avatar: 'M' },
      { name: 'Rohan Verma', avatar: 'R' },
      { name: 'Priya Sundaram', avatar: 'P' },
      { name: 'Kabir Mehta', avatar: 'K' },
      { name: 'Tanvi Joshi', avatar: 'T' },
      { name: 'Arjun Nambiar', avatar: 'A' },
    ]

    const existingVoterNames = new Set(item.voters.map((v) => v.name.toLowerCase()))
    const unvotedFriends = friendCandidates.filter((f) => !existingVoterNames.has(f.name.toLowerCase()))
    const selected = unvotedFriends.slice(0, 2)

    if (selected.length === 0) {
      selected.push({
        name: `Friend ${Math.floor(10 + Math.random() * 90)}`,
        avatar: 'F',
      })
    }

    const commentsWin = [
      '100% COP IT! Quality is unreal.',
      'Worth every rupee, the finish is elite.',
      'Buy it before stock runs out!',
      'Looks amazing on you, go for it!',
    ]

    const commentsDrop = [
      'Maybe wait for festive sale?',
      'Check alternative colorway first.',
      'A bit pricey, do you need it immediately?',
    ]

    selected.forEach((f, idx) => {
      const isUp = idx === 0 || Math.random() > 0.35
      const voteType = isUp ? 'up' : 'down'
      const comment = isUp
        ? commentsWin[Math.floor(Math.random() * commentsWin.length)]
        : commentsDrop[Math.floor(Math.random() * commentsDrop.length)]

      this.castVote(code, productId, voteType, f.name, comment)
    })

    return room
  },
}
