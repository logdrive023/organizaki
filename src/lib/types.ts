// Espelho do contrato da API (organizaki-backend/README.md). Datas vêm em ISO; dinheiro em centavos.

export interface NotificationSettings {
  emailGuestConfirm: boolean
  emailGiftReserved: boolean
  emailEventReminder: boolean
  emailSystemUpdates: boolean
  inAppAll: boolean
  inAppSound: boolean
}

export interface AccountSettings {
  language: string
  timezone: string
}

export interface Me {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  plan: 'free' | 'premium'
  premiumSince?: string
  showAds: boolean
  adsVisible: boolean
  premiumPriceCents: number
  notifications: NotificationSettings
  account: AccountSettings
  createdAt: string
}

export interface Session {
  accessToken: string
  expiresAt: string
  refreshToken: string
  user: Me
}

export type EventStatus = 'draft' | 'active'

export interface Counts {
  guests: number
  confirmed: number
  pending: number
  declined: number
  people: number
  gifts: number
  giftItems: number
  giftReserved: number
}

export interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  date: string
  time: string
  location: string
  coverUrl: string
  status: EventStatus
  counts: Counts
  createdAt: string
  updatedAt: string
}

export interface EventInput {
  title: string
  description: string
  date: string
  time: string
  location: string
  coverUrl: string
}

export interface PublicEvent {
  slug: string
  title: string
  description: string
  date: string
  time: string
  location: string
  coverUrl: string
  hostName: string
  confirmed: number
}

export interface TopGift {
  id: string
  eventId: string
  name: string
  reserved: number
  quantity: number
}

export interface Stats extends Counts {
  confirmationRate: number
  responseRate: number
  giftProgress: number
  giftValueCents: number
  reservedCents: number
  topGifts: TopGift[]
}

export type GuestStatus = 'pending' | 'confirmed' | 'declined'

export interface Guest {
  id: string
  eventId: string
  eventTitle: string
  name: string
  email: string
  phone: string
  status: GuestStatus
  companions: number
  message: string
  inviteUrl: string
  invitedAt: string | null
  respondedAt: string | null
  createdAt: string
}

export interface GuestInput {
  name: string
  email: string
  phone: string
  status: GuestStatus
  companions: number
  message: string
}

export interface Invite {
  id: string
  name: string
  email: string
  phone: string
  inviteUrl: string
}

export interface InvitePreview {
  name: string
  email: string
  phone: string
  status: GuestStatus
  companions: number
  message: string
}

export interface Reservation {
  id: string
  guestName: string
  guestEmail: string
  purchasedAt: string | null
  createdAt: string
}

export interface Gift {
  id: string
  eventId: string
  eventTitle: string
  name: string
  description: string
  priceCents: number
  imageUrl: string
  storeUrl: string
  quantity: number
  reserved: number
  purchased: number
  createdAt: string
  reservations?: Reservation[]
}

export interface GiftInput {
  name: string
  description: string
  priceCents: number
  imageUrl: string
  storeUrl: string
  quantity: number
}

export interface PublicGift {
  id: string
  name: string
  description: string
  priceCents: number
  imageUrl: string
  storeUrl: string
  quantity: number
  reserved: number
}

export interface Ticket {
  reservationId: string
  giftId: string
  token: string
}

export type NotificationType = 'event' | 'gift' | 'guest' | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}

export interface NotificationPage {
  items: AppNotification[]
  unread: number
}
