import { useQuery, useQueryClient } from '@tanstack/react-query'
import { get } from './api'
import type { EventItem, Gift, Guest, NotificationPage, Stats } from './types'

export const useEvents = () => useQuery({ queryKey: ['events'], queryFn: () => get<EventItem[]>('/events') })

export const useEvent = (id: string) => useQuery({ queryKey: ['events', id], queryFn: () => get<EventItem>(`/events/${id}`), enabled: !!id })

export const useStats = (eventId?: string) =>
  useQuery({ queryKey: ['stats', eventId ?? 'all'], queryFn: () => get<Stats>(eventId ? `/events/${eventId}/stats` : '/stats') })

export const useGuests = (eventId?: string) =>
  useQuery({ queryKey: ['guests', eventId ?? 'all'], queryFn: () => get<Guest[]>(eventId ? `/events/${eventId}/guests` : '/guests') })

export const useGifts = (eventId?: string) =>
  useQuery({ queryKey: ['gifts', eventId ?? 'all'], queryFn: () => get<Gift[]>(eventId ? `/events/${eventId}/gifts` : '/gifts') })

// Avisos chegam quando um convidado responde; olhar a cada 30s basta para o sino (sem WebSocket).
export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: () => get<NotificationPage>('/notifications'), refetchInterval: 30_000 })

/** Depois de mexer em convidado/presente/evento: os números do painel mudam junto. */
export function useInvalidateAll() {
  const qc = useQueryClient()
  return () => {
    for (const k of ['events', 'stats', 'guests', 'gifts']) qc.invalidateQueries({ queryKey: [k] })
  }
}
