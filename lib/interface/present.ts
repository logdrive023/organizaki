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
    price: number
    image?: string
    url?: string
    quantity: number
}

export interface SelectPresent{ 
    id: string
    name: string
}