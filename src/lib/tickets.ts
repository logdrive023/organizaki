import type { Ticket } from './types'

// Quem escolhe um presente não tem conta: o "comprovante" fica neste navegador para desfazer ou marcar como comprado.
const KEY = 'ok.tickets'

function read(): Record<string, Ticket> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, Ticket>
  } catch {
    return {}
  }
}

function write(all: Record<string, Ticket>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* sem storage, a escolha vale mas não dá para desfazer daqui */
  }
}

export const ticketFor = (giftId: string): Ticket | undefined => read()[giftId]

export function saveTicket(t: Ticket) {
  write({ ...read(), [t.giftId]: t })
}

export function dropTicket(giftId: string) {
  const all = read()
  delete all[giftId]
  write(all)
}

const PURCHASED = 'ok.purchased'

export const isPurchasedHere = (reservationId: string) => {
  try {
    return (JSON.parse(localStorage.getItem(PURCHASED) ?? '[]') as string[]).includes(reservationId)
  } catch {
    return false
  }
}

export function markPurchasedHere(reservationId: string) {
  try {
    const list = JSON.parse(localStorage.getItem(PURCHASED) ?? '[]') as string[]
    localStorage.setItem(PURCHASED, JSON.stringify([...new Set([...list, reservationId])]))
  } catch {
    /* idem */
  }
}
