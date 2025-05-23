"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"
import { EventStats } from "@/components/dashboard/event-stats"
import { EventDetails } from "@/components/dashboard/event-details"
import { GiftList } from "@/components/dashboard/gift-list"
import { GuestList } from "@/components/dashboard/guest-list"
import { eventAPI } from "@/lib/api/event"
import { toast } from "@/components/ui/use-toast"
import { useAdsSettings } from "@/store/use-ads-settings"
import type { EventType } from "@/lib/interface/event"

import { mockEvents } from "@/lib/mock-data"

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showAds } = useAdsSettings()

  const [event, setEvent] = useState<EventType | null>(null)
  const [activeTab, setActiveTab] = useState<"detalhes" | "presentes" | "convidados">("detalhes")
  const [loading, setLoading] = useState<boolean>(true)

  // Descomentar para testar tela com o mock
  //const event = mockEvents.find((e) => e.id === params.id) || mockEvents[0]

  useEffect(() => {
    setLoading(true)
    eventAPI
      .getEventbyId(params.id)
      .then((data) => {
        setEvent(data)
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar evento",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params.id, router])

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando evento...
      </Card>
    )
  }

  if (!event) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Evento não encontrado</h2>
        <p className="mb-4 text-muted-foreground">O evento que você está procurando não existe ou foi removido.</p>
        <Button type="button" onClick={() => router.push("/dashboard")}>Voltar para o Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">
              {event.status === "active" ? "Evento ativo" : "Rascunho"} • {event.date}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/evento/${event.id}`)}>
            Visualizar
          </Button>
          <Button onClick={() => router.push(`/dashboard/eventos/${event.id}/editar`)}>Editar</Button>
        </div>
      </div>

      {/* Estatísticas do evento */}
      <EventStats eventId={event.id} />

      {/* Anúncio após as estatísticas */}
      {showAds && <DashboardAd slot="event-top" format="horizontal" />}

      {/* Tabs de navegação */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) =>
          setActiveTab(value as "detalhes" | "presentes" | "convidados")
        }
        className="space-y-6"
        >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="presentes">Lista de Presentes</TabsTrigger>
          <TabsTrigger value="convidados">Convidados</TabsTrigger>
        </TabsList>

        <TabsContent value="detalhes" className="space-y-6">
          <EventDetails eventId={event.id} />
        </TabsContent>

        <TabsContent value="presentes" className="space-y-6">
          <GiftList eventId={event.id} />

          {/* Anúncio no meio da lista de presentes */}
          {showAds && <DashboardAd slot="event-gifts" format="horizontal" />}
        </TabsContent>

        <TabsContent value="convidados" className="space-y-6">
          <GuestList eventId={event.id} />

          {/* Anúncio no meio da lista de convidados */}
          {showAds && <DashboardAd slot="event-guests" format="horizontal" />}
        </TabsContent>
      </Tabs>

      {/* Anúncio no final da página */}
      {showAds && <DashboardAd slot="event-bottom" format="horizontal" />}
    </div>
  )
}
