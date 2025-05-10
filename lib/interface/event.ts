// src/types/event.ts
export interface NewEventRequest {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    coverImage?: string;
}


export interface UpdateEventRequest {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    coverImage?: string;
}

export interface EventType {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    coverImage: string
    status: "active" | "draft"
    guestCount: number
    createdAt: string
    updatedAt: string
}

export interface GuestType {
    id: string
    name: string
    email: string
    phone?: string
    status: "pending" | "confirmed" | "declined"
    message?: string
    eventId?: string
    inviteUrl?: string
}

export interface GiftType {
    id: string
    name: string
    description?: string
    price: string
    image: string
    url: string
    quantity: number
    reserved?: number
    isReservedByMe?: boolean
    isPurchased?: boolean
    eventId?: string
}

export interface NewGiftRequest {
    eventId: string
    name: string
    description?: string
    price: string
    image?: string
    url?: string
    quantity: number
}

export interface UpdateGiftRequest {
    eventId: string
    giftId: string
    name?: string
    description?: string
    price?: string
    image?: string
    url?: string
    quantity?: number
    reserved?: number
}

export interface NewGuestRequest {
    eventId: string
    name: string
    email: string
    phone?: string
    message?: string  
    status: "pending" | "confirmed" | "declined"
}

export interface SelectEvent {
    id: string
    name: string
}

export interface SelectGust {
    id: string
    name: string
}

export interface UpdateGuestRequest {
    eventId: string
    id: string
    name: string
    email: string
    phone?: string
    message?: string
    status: "pending" | "confirmed" | "declined"
  }
  