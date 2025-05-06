import { EventType, NewEventRequest,UpdateEventRequest } from "@/lib/interface/event"

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
    console.log({
        "url": url,
        "options": options,
        "response:": response
    })
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
      return handleRequest<NewEventRequest>(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
      })
    },

    // Atualiza Evento
    update: async (evento: UpdateEventRequest): Promise<UpdateEventRequest> => {
        return handleRequest<UpdateEventRequest>(`${API_BASE_URL}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(evento),
        })
      },

  }