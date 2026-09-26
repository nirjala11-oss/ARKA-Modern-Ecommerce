import { describe, it, expect } from 'vitest'
import { squadRoomService } from '@/lib/squad-room-service'
import { INITIAL_PRODUCTS } from '@/lib/products-data'

describe('Collaborative Squad Decision Room Service', () => {
  const testRoomCode = `TEST-${Date.now()}`

  it('should initialize a room with a host participant and default dilemma', () => {
    const room = squadRoomService.getOrCreateRoom(testRoomCode, 'Aarav (Host)')
    expect(room.code).toBe(testRoomCode.toUpperCase())
    expect(room.hostName).toBe('Aarav (Host)')
    expect(room.participants.length).toBeGreaterThanOrEqual(1)
    expect(room.participants[0].name).toBe('Aarav (Host)')
    expect(room.sharedItems.length).toBeGreaterThanOrEqual(1)
  })

  it('should allow an invited friend to join the room with their custom name', () => {
    const room = squadRoomService.joinRoom(testRoomCode, 'Rahul Verma')
    const rahul = room.participants.find((p) => p.name === 'Rahul Verma')
    expect(rahul).toBeDefined()
    expect(rahul?.avatar).toBe('R')
    expect(rahul?.status).toBe('active')

    // System message should announce the friend joined
    const joinMsg = room.messages.find((m) => m.text.includes('Rahul Verma'))
    expect(joinMsg).toBeDefined()
  })

  it('should record a friend vote with their exact name, choice, and reasoning comment', () => {
    const product = INITIAL_PRODUCTS[0]
    const friendName = 'Sarah Jenkins'
    const comment = '100% COP IT! Amazing build quality.'

    const updatedRoom = squadRoomService.castVote(
      testRoomCode,
      product.id,
      'up',
      friendName,
      comment
    )

    const item = updatedRoom.sharedItems.find((i) => i.product.id === product.id)
    expect(item).toBeDefined()
    expect(item?.upvotes).toBeGreaterThanOrEqual(1)

    // Verify voter appears in the voters list with their real name and comment
    const recordedVoter = item?.voters.find((v) => v.name === friendName)
    expect(recordedVoter).toBeDefined()
    expect(recordedVoter?.name).toBe('Sarah Jenkins')
    expect(recordedVoter?.vote).toBe('up')
    expect(recordedVoter?.comment).toBe(comment)
    expect(recordedVoter?.avatar).toBe('S')

    // Verify chat message logged the vote
    const voteMsg = updatedRoom.messages.find(
      (m) => m.sender === friendName && m.text.includes('COP IT')
    )
    expect(voteMsg).toBeDefined()
  })

  it('should allow demoting an item with a friend vote and update consensus verdict', () => {
    const product = INITIAL_PRODUCTS[0]
    const friendName = 'Vikram Dev'
    const comment = 'DEMOTE / Wait for Diwali sale.'

    const updatedRoom = squadRoomService.castVote(
      testRoomCode,
      product.id,
      'down',
      friendName,
      comment
    )

    const item = updatedRoom.sharedItems.find((i) => i.product.id === product.id)
    expect(item).toBeDefined()
    expect(item?.downvotes).toBeGreaterThanOrEqual(1)

    const recordedVoter = item?.voters.find((v) => v.name === friendName)
    expect(recordedVoter?.name).toBe('Vikram Dev')
    expect(recordedVoter?.vote).toBe('down')
  })

  it('should allow adding new product dilemmas and broadcast to room', () => {
    const secondProduct = INITIAL_PRODUCTS[1]
    const question = 'Should I get this timepiece?'

    const updatedRoom = squadRoomService.addItem(
      testRoomCode,
      secondProduct,
      question,
      'Aarav (Host)'
    )

    const newItem = updatedRoom.sharedItems.find((i) => i.product.id === secondProduct.id)
    expect(newItem).toBeDefined()
    expect(newItem?.question).toBe(question)
    expect(newItem?.addedBy).toBe('Aarav (Host)')
  })

  it('should send and broadcast chat messages across room members', () => {
    const updatedRoom = squadRoomService.sendMessage(
      testRoomCode,
      'Sarah Jenkins',
      'Which colorway should we pick?'
    )

    const msg = updatedRoom.messages.find((m) => m.text === 'Which colorway should we pick?')
    expect(msg).toBeDefined()
    expect(msg?.sender).toBe('Sarah Jenkins')
  })
})
