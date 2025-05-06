export interface EventType {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  coverFile: string
  status: "active" | "draft"
  guestCount: number
  createdAt: string
  updatedAt: string
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

export interface GuestType {
  id: string
  name: string
  email: string
  phone?: string
  status: "pending" | "confirmed" | "declined"
  message?: string
  eventId?: string
}

export interface UserType {
  id: string
  name: string
  email: string
}
