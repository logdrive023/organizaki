export interface Notification {
    id: string
    title: string
    message: string
    type: "event" | "gift" | "guest" | "system"
    read: boolean
    date: string
    link?: string
  }
  