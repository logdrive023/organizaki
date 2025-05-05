"use server"

import type { GuestType } from "./types"

// Simulação de adição de convidado
export async function addGuest(eventId: string, guestData: GuestType) {
  // Em uma aplicação real, salvaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Gerando um ID único
  const id = `guest-${Date.now()}`

  // Criando o novo convidado
  const newGuest: GuestType = {
    id,
    name: guestData.name,
    email: guestData.email,
    phone: guestData.phone || "",
    status: guestData.status || "pending",
    message: guestData.message || "",
    eventId,
  }

  // Em uma aplicação real, adicionaríamos ao banco de dados
  return newGuest
}

export async function removeGuest(eventId: string, guestId: string) {
  // Em uma aplicação real, removeríamos do banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function sendInvites(eventId: string, guestIds: string[]) {
  // Em uma aplicação real, enviaríamos e-mails para os convidados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return { success: true, sent: guestIds.length }
}

export async function confirmPresence(
  eventId: string,
  confirmationData: {
    name: string
    email: string
    phone?: string
    status: "confirmed" | "declined"
    message?: string
  },
) {
  // Em uma aplicação real, atualizaríamos o status do convidado no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}
