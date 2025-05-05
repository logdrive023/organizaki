"use server"

import type { GiftType } from "./types"

// Simulação de adição de presente
export async function addGift(eventId: string, giftData: GiftType) {
  // Em uma aplicação real, salvaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Gerando um ID único
  const id = `gift-${Date.now()}`

  // Criando o novo presente
  const newGift: GiftType = {
    id,
    name: giftData.name,
    description: giftData.description || "",
    price: giftData.price,
    image: giftData.image || "/placeholder.svg?height=300&width=300&query=gift",
    url: giftData.url || "",
    quantity: giftData.quantity || 1,
    reserved: 0,
  }

  // Em uma aplicação real, adicionaríamos ao banco de dados
  return newGift
}

export async function removeGift(eventId: string, giftId: string) {
  // Em uma aplicação real, removeríamos do banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function reserveGift(eventId: string, giftId: string, guestData: { name: string; email: string }) {
  // Em uma aplicação real, atualizaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

export async function confirmGiftPurchase(eventId: string, giftId: string) {
  // Em uma aplicação real, atualizaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}
