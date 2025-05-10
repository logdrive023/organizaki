import {
  EventType,
  NewEventRequest,
  UpdateEventRequest,
  GuestType,
  GiftType,
  NewGiftRequest,
  NewGuestRequest,
  SelectEvent,
  SelectGust,
  UpdateGuestRequest
} from "@/lib/interface/event"

// Dados mock iniciais
// Exemplo dados esperado
const eventoMock: EventType[] = [
  {
    id: "event-1",
    title: "Casamento de João e Maria",
    description:
      "Temos o prazer de convidar você para celebrar nosso casamento. Será uma cerimônia íntima seguida de recepção com jantar e música ao vivo. Esperamos compartilhar este momento especial com você!",
    date: "15/12/2025",
    time: "19:00",
    location: "Espaço Villa Garden, Av. das Flores, 1500, São Paulo",
    coverImage: "/outdoor-wedding-ceremony.png",
    status: "active",
    guestCount: 120,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
  },
]

const API_BASE_URL = "/api/evento"

const handleRequest = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}

export const eventAPI = {

  // Criar evento
  create: async (evento: Omit<NewEventRequest, "id">): Promise<NewEventRequest> => {
    return handleRequest<NewEventRequest>(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
    })
  },

  // Atualiza Evento
  update: async (evento: UpdateEventRequest): Promise<EventType> => {
    return handleRequest<EventType>(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
    })
  },

  // Lista os eventos
  list: async (): Promise<EventType[]> => {
    return handleRequest<EventType[]>(`${API_BASE_URL}/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  },

  // Obter evento pelo ID
  getEventbyId: async (id: string): Promise<EventType> => {
    return handleRequest<EventType>(
      `${API_BASE_URL}/${id}/obter`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Obter status dos evento pelo ID
  getEventStatsById: async (
    eventId: string
  ): Promise<{ guests: GuestType[]; gifts: GiftType[] }> => {
    return handleRequest<{ guests: GuestType[]; gifts: GiftType[] }>(
      `${API_BASE_URL}/${eventId}/stats`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Obter detalhe dos evento pelo ID
  getEventDetailsById: async (eventId: string): Promise<EventType> => {
    return handleRequest<EventType>(
      `${API_BASE_URL}/${eventId}/detalhes`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Obter presentes do evento pelo ID
  getEventGiftListById: async (
    eventId: string
  ): Promise<GiftType[]> => {
    return handleRequest<GiftType[]>(
      `${API_BASE_URL}/${eventId}/gifts`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Adicionar presente
  addGift: async (
    req: NewGiftRequest
  ): Promise<GiftType> => {
    const { eventId, ...body } = req
    return handleRequest<GiftType>(
      `${API_BASE_URL}/${eventId}/gifts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )
  },

  // Remover presente
  removeGift: async (
    eventId: string,
    giftId: string
  ): Promise<void> => {
    return handleRequest<void>(
      `${API_BASE_URL}/${eventId}/gifts/${giftId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Obter convidados pelo ID
  getEventGuestListById: async (
    eventId: string
  ): Promise<GuestType[]> => {
    return handleRequest<GuestType[]>(
      `${API_BASE_URL}/${eventId}/guests`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Adicionar convidado
  addGuest: async (
    req: NewGuestRequest
  ): Promise<GuestType> => {
    const { eventId, ...body } = req
    return handleRequest<GuestType>(
      `${API_BASE_URL}/${eventId}/guests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )
  },

  updateGuest: async (
    req: UpdateGuestRequest
  ): Promise<GuestType> => {
    // Desconstrói eventId e id para montar a URL, e o resto virá no body
    const { eventId, id, ...body } = req

    return handleRequest<GuestType>(
      // PUT em /{eventId}/guests/{id}
      `${API_BASE_URL}/${eventId}/guests/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
  },

  // Remover convidado
  removeGuest: async (
    eventId: string,
    guestId: string
  ): Promise<void> => {
    return handleRequest<void>(
      `${API_BASE_URL}/${eventId}/guests/${guestId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
  },

  // Enviar convite
  sendInvites: async (
    eventId: string,
    guestIds: string[]
  ): Promise<void> => {
    return handleRequest<void>(
      `${API_BASE_URL}/${eventId}/guests/invites`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestIds }),
      }
    )
  },

  // Obter convidados
  selectGust: async (): Promise<GuestType[]> => {
    // Pega toda a lista de eventos do backend
    const events = await handleRequest<GuestType[]>(
      `${API_BASE_URL}/guest/select`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    // Mapeia para somente id e name
    return events
  },

  // Obter eventos lista
  selectEventAll: async (): Promise<EventType[]> => {
    // Pega toda a lista de eventos do backend
    const events = await handleRequest<EventType[]>(
      `${API_BASE_URL}/event-all/select`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    // Mapeia para somente id e name
    return events
  },


  // Obter eventos
  selectEvent: async (): Promise<SelectEvent[]> => {
    // Pega toda a lista de eventos do backend
    const events = await handleRequest<EventType[]>(
      `${API_BASE_URL}/event/select`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    // Mapeia para somente id e name
    return events.map((e) => ({
      id: e.id,
      name: e.title,
    }))
  },

}