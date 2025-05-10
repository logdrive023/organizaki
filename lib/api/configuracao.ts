import type {
    UpdateProfileRequest,
    ChangePasswordRequest,
    NotificationSettingsRequest,
    NotificationSettings,
    AdsSettingsRequest,
    AccountSettingsRequest,
    AccountSettings,
    Profile,
    NotificationDropDown,
    MenuItem
} from "@/lib/interface/configuracao"


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

export const configuracaoAPI = {
    /** Busca todas as notificações */
    listNotifications: async (): Promise<Notification[]> => {
        return handleRequest<Notification[]>(
            `${API_BASE_URL}/notifications`,
            { method: "GET" }
        )
    },

    listNotificationsDropDown: async (): Promise<NotificationDropDown[]> => {
        return handleRequest<NotificationDropDown[]>(
            `${API_BASE_URL}/notifications`,
            { method: "GET" }
        )
    },

    /** Atualiza os dados de perfil */
    updateProfile: async (
        req: UpdateProfileRequest
    ): Promise<Profile> => {
        return handleRequest<Profile>(
            `${API_BASE_URL}/profile`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }
        )
    },

    /** Altera a senha */
    changePassword: async (
        req: ChangePasswordRequest
    ): Promise<void> => {
        return handleRequest<void>(
            `${API_BASE_URL}/password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }
        )
    },

    /** Atualiza preferências de notificações */
    updateNotificationSettings: async (
        req: NotificationSettingsRequest
    ): Promise<NotificationSettings> => {
        return handleRequest<NotificationSettings>(
            `${API_BASE_URL}/notifications/settings`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }
        )
    },

    /** Atualiza configuração de anúncios */
    updateAdsSettings: async (
        req: AdsSettingsRequest
    ): Promise<AdsSettingsRequest> => {
        return handleRequest<AdsSettingsRequest>(
            `${API_BASE_URL}/ads/settings`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }
        )
    },

    /** Compra premium (remove anúncios) */
    purchasePremium: async (): Promise<void> => {
        return handleRequest<void>(
            `${API_BASE_URL}/premium`,
            { method: "POST" }
        )
    },

    /** Atualiza configurações de conta (idioma, região, privacidade) */
    updateAccountSettings: async (
        req: AccountSettingsRequest
    ): Promise<AccountSettings> => {
        return handleRequest<AccountSettings>(
            `${API_BASE_URL}/account/settings`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            }
        )
    },

    /** Deleta a conta do usuário */
    deleteAccount: async (): Promise<void> => {
        return handleRequest<void>(
            `${API_BASE_URL}/account`,
            { method: "DELETE" }
        )
    },

    /** Marca uma notificação como lida */
    markNotificationRead: async (
        id: string
    ): Promise<Notification> => {
        return handleRequest<Notification>(
            `${API_BASE_URL}/notifications/${id}/read`,
            { method: "POST" }
        )
    },

    /** Exclui uma notificação */
    deleteNotification: async (
        id: string
    ): Promise<void> => {
        return handleRequest<void>(
            `${API_BASE_URL}/notifications/${id}`,
            { method: "DELETE" }
        )
    },

    getNotificationSettings: async (): Promise<NotificationSettings> => {
        return handleRequest<NotificationSettings>(
            `${API_BASE_URL}/notifications/settings`,
            { method: "GET" }
        )
    },

    getAdsSettings: async (): Promise<{
        showAds: boolean
        isPremium: boolean
    }> => {
        return handleRequest<{
            showAds: boolean
            isPremium: boolean
        }>(
            `${API_BASE_URL}/ads/settings`,
            { method: "GET" }
        )
    },

    getAccountSettings: async (): Promise<AccountSettings> => {
        return handleRequest<AccountSettings>(
            `${API_BASE_URL}/account/settings`,
            { method: "GET" }
        )
    },

    listMenu: async (): Promise<MenuItem[]> => {
        // mock — replace with `handleRequest<…>(url, opts)` when you have a real endpoint
        return Promise.resolve([
            { title: "Meus Eventos", href: "/dashboard", icon: "Calendar" },
            { title: "Listas de Presentes", href: "/dashboard/presentes", icon: "Gift" },
            { title: "Convidados", href: "/dashboard/convidados", icon: "Users" },
            { title: "Estatísticas", href: "/dashboard/estatisticas", icon: "BarChart" },
            { title: "Configurações", href: "/dashboard/configuracoes", icon: "Settings" },
        ])
    },
}
