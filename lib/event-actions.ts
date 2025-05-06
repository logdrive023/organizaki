"use server"

import type { EventType } from "./types"
import { mockEvents } from "./mock-data"

// Simulação de criação de evento
export async function createEvent(eventData: Partial<EventType>) {
  // Em uma aplicação real, salvaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Gerando um ID único
  const id = `event-${Date.now()}`

  // Criando o novo evento
  const newEvent: EventType = {
    id,
    title: eventData.title || "Novo Evento",
    description: eventData.description || "",
    date: eventData.date
      ? new Date(eventData.date).toLocaleDateString("pt-BR")
      : new Date().toLocaleDateString("pt-BR"),
    time: eventData.time || "00:00",
    location: eventData.location || "",
    coverFile: eventData.coverFile || "/placeholder.svg?height=400&width=800&query=event",
    status: "draft",
    guestCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Em uma aplicação real, adicionaríamos ao banco de dados
  // Aqui, apenas retornamos o ID
  return id
}

// Atualizar a função updateEvent para retornar mais informações
export async function updateEvent(eventId: string, eventData: Partial<EventType>) {
  // Em uma aplicação real, atualizaríamos no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Buscar o evento atual (em uma aplicação real, isso viria do banco de dados)
  const currentEvent = mockEvents.find((e) => e.id === eventId)

  if (!currentEvent) {
    throw new Error("Evento não encontrado")
  }

  // Atualizar os dados do evento
  const updatedEvent = {
    ...currentEvent,
    ...eventData,
    // Garantir que a data seja uma string no formato correto
    date:
      eventData.date instanceof Date ? eventData.date.toLocaleDateString("pt-BR") : eventData.date || currentEvent.date,
    updatedAt: new Date().toISOString(),
  }

  // Em uma aplicação real, salvaríamos no banco de dados
  // Aqui, apenas simulamos o sucesso da operação
  return { success: true, event: updatedEvent }
}

export async function getEvent(eventId: string) {
  // Em uma aplicação real, buscaríamos do banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Buscando o evento nos dados de exemplo
  const event = mockEvents.find((e) => e.id === eventId)

  return event || null
}

export async function getUserEvents(userId: string) {
  // Em uma aplicação real, buscaríamos do banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Retornando todos os eventos de exemplo
  return mockEvents
}
