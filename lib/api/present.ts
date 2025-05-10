import {
  GiftType,
  NewGiftRequest,
  SelectPresent
} from "@/lib/interface/present"

// Dados mock iniciais
// Exemplo dados esperado
export const mockGifts: GiftType[] = [
  {
    id: "gift-1",
    name: "Jogo de Panelas Tramontina",
    description: "Conjunto de panelas antiaderentes com 5 peças",
    price: "R$ 399,90",
    image: "/cookware-set.png",
    url: "https://www.exemplo.com/produto/1",
    quantity: 1,
    reserved: 1,
    isReservedByMe: true,
    eventId: "event-1",
  },
]

const API_BASE_URL = "/api/presente"

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

export const presentAPI = {

  // Criar os presentes
  create: async (evento: Omit<NewGiftRequest, "id">): Promise<NewGiftRequest> => {
    return handleRequest<NewGiftRequest>(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
    })
  },

  // Lista os presentes
  list: async (): Promise<GiftType[]> => {
    return handleRequest<GiftType[]>(`${API_BASE_URL}/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  },

  // Obter presentes
  selectPresent: async (): Promise<SelectPresent[]> => {
    // Pega toda a lista de eventos do backend
    const events = await handleRequest<SelectPresent[]>(
      `${API_BASE_URL}/present/select`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    // Mapeia para somente id e name
    return events.map((e) => ({
      id: e.id,
      name: e.name,
    }))
  },

}


//
// // Atualiza Evento
// update: async (evento: UpdateEventRequest): Promise<EventType> => {
//   return handleRequest<EventType>(`${API_BASE_URL}/update`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(evento),
//   })
// },