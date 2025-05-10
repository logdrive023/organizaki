export interface UpdateProfileRequest {
    name: string
    email: string
    bio?: string
    phone?: string
}
export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
}
export interface NotificationSettingsRequest {
    email: {
        guestConfirm: boolean
        giftReserved: boolean
        eventReminder: boolean
        systemUpdates: boolean
    }
    inApp: {
        allActivity: boolean
        sound: boolean
    }
}
export interface AdsSettingsRequest {
    showAds: boolean
}
export interface AccountSettingsRequest {
    language: string
    timezone: string
    profilePublic: boolean
    shareUsage: boolean
}


export interface Profile {
    name: string
    email: string
    bio?: string
    phone?: string
}


export interface NotificationSettings {
    email: {
        guestConfirm: boolean
        giftReserved: boolean
        eventReminder: boolean
        systemUpdates: boolean
    }
    inApp: {
        allActivities: boolean
        sound: boolean
    }
}


export interface AccountSettings {
    language: string
    timezone: string
    profilePublic: boolean
    shareUsage: boolean
}

export interface NotificationDropDown {
    id: string
    title: string
    message: string
    type: "event" | "gift" | "guest" | "system"
    read: boolean
    date: string
    link?: string
}


export interface MenuItem {
    title: string
    href: string
    icon: "Calendar" | "Gift" | "Users" | "BarChart" | "Settings"
}
