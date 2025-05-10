import {
    Notification
} from "@/lib/interface/notification"


const API_BASE_URL = "/api/notificacao"

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

export const notificationsAPI = {

  // Lista as notificações
  list: async (): Promise<Notification[]> => {
    return handleRequest<Notification[]>(`${API_BASE_URL}/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  },

 // Marca uma única notificação como lida
 markAsRead: async (id: string): Promise<Notification> => {
    return handleRequest<Notification>(`${API_BASE_URL}/${id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
  },

  // Marca todas as notificações como lidas
  markAllAsRead: async (): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/read-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
  },

  // Exclui uma única notificação
  delete: async (id: string): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
  },

  // Exclui todas as notificações
  deleteAll: async (): Promise<void> => {
    return handleRequest<void>(`${API_BASE_URL}/all`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
  },

}

