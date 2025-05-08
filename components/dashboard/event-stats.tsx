"use client"


import { useState, useEffect } from "react"
import { Calendar, Users, Gift, DollarSign, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { eventAPI } from "@/lib/api/event"
import type { GuestType, GiftType } from "@/lib/interface/event"

interface EventStatsProps {
  eventId: string
}

export function EventStats({ eventId }: EventStatsProps) {
  const [guests, setGuests] = useState<GuestType[]>([])
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    setLoading(true)
    eventAPI
      .getEventStatsById(eventId)
      .then(({ guests: g, gifts: l }) => {
        setGuests(g)
        setGifts(l)
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar estatísticas",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [eventId])


  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando estatísticas...
      </Card>
    )
  }

  // Estatísticas de convidados
  const totalGuests = guests?.length ?? 0
  const confirmedGuests = guests?.filter((g) => g.status === "confirmed")?.length ?? 0
  const declinedGuests = guests?.filter((g) => g.status === "declined")?.length ?? 0
  const pendingGuests = guests?.filter((g) => g.status === "pending")?.length ?? 0
  const confirmationRate = totalGuests > 0
    ? (confirmedGuests / totalGuests) * 100
    : 0

  // Estatísticas de presentes
  const totalGifts = gifts?.length ?? 0
  const totalGiftItems = gifts?.reduce((acc, gift) => acc + (gift.quantity ?? 0), 0) ?? 0
  const reservedGifts = gifts?.reduce((acc, gift) => acc + (gift.reserved ?? 0), 0) ?? 0
  const giftCompletionRate = totalGiftItems > 0
    ? (reservedGifts / totalGiftItems) * 100
    : 0
  const estimatedValue = gifts?.reduce((acc, gift) => {
    const price = parseFloat(
      gift.price?.replace(/[^\d,]/g, "")?.replace(",", ".") ?? "0"
    )
    return acc + (isNaN(price) ? 0 : price * (gift.quantity ?? 0))
  }, 0) ?? 0


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estatísticas do Evento</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Convidados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedGuests} confirmados, {pendingGuests} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Confirmação
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {confirmationRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {confirmedGuests} de {totalGuests} convidados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presentes Escolhidos
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservedGifts}</div>
            <p className="text-xs text-muted-foreground">
              {giftCompletionRate.toFixed(1)}% da lista de presentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Estimado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {estimatedValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de {totalGiftItems} itens na lista
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status de Confirmação</CardTitle>
            <CardDescription>
              Distribuição de confirmações dos convidados
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {confirmationRate.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confirmados
                      </div>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${confirmationRate * 2.51} 251`}
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="text-sm">Confirmados ({confirmedGuests})</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="text-sm">Recusados ({declinedGuests})</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <div className="text-sm">Pendentes ({pendingGuests})</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Presentes</CardTitle>
            <CardDescription>Status da lista de presentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">Progresso Geral</div>
                <div className="text-sm font-medium">
                  {giftCompletionRate.toFixed(1)}%
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${giftCompletionRate}%` }}
                />
              </div>
              <div className="pt-4">
                <div className="text-sm font-medium">Top Presentes</div>
                <ul className="mt-2 space-y-2">
                  {gifts
                    .sort((a, b) => (b.reserved || 0) - (a.reserved || 0))
                    .slice(0, 3)
                    .map((gift) => (
                      <li
                        key={gift.id}
                        className="flex items-center justify-between"
                      >
                        <div className="text-sm">{gift.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {gift.reserved || 0} de {gift.quantity}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
