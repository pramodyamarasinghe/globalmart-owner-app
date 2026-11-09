import { create } from 'zustand'
import type { CartLine } from './cart'

export type CashierTicket = {
  id: string
  createdAt: string
  lines: CartLine[]
}

type QueueState = {
  tickets: CashierTicket[]
  enqueue: (lines: CartLine[]) => string
  markDone: (id: string) => void
  clearAll: () => void
}

function makeId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const useCashierQueue = create<QueueState>((set) => ({
  tickets: [],

  enqueue: (lines) => {
    const id = makeId()
    const ticket: CashierTicket = {
      id,
      createdAt: new Date().toISOString(),
      lines: lines.map((l) => ({ ...l })),
    }
    set((state) => ({ tickets: [ticket, ...state.tickets] }))
    return id
  },

  markDone: (id) => {
    set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id) }))
  },

  clearAll: () => set({ tickets: [] }),
}))
