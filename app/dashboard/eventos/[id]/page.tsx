import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventDetails } from "@/components/dashboard/event-details"
import { GiftList } from "@/components/dashboard/gift-list"
import { GuestList } from "@/components/dashboard/guest-list"
import { EventStats } from "@/components/dashboard/event-stats"
import { mockEvents } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Detalhes do Evento - Evento Fácil",
  description: "Gerencie os detalhes do seu evento",
}

export default function EventPage({ params }) {
  // Em uma aplicação real, buscaríamos o evento pelo ID
  const event = mockEvents.find((e) => e.id === params.id) || mockEvents[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
        <p className="text-muted-foreground">Gerencie todos os detalhes do seu evento</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="gifts">Lista de Presentes</TabsTrigger>
          <TabsTrigger value="guests">Convidados</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <EventDetails event={event} />
        </TabsContent>
        <TabsContent value="gifts" className="space-y-4 pt-4">
          <GiftList eventId={event.id} />
        </TabsContent>
        <TabsContent value="guests" className="space-y-4 pt-4">
          <GuestList eventId={event.id} />
        </TabsContent>
        <TabsContent value="stats" className="space-y-4 pt-4">
          <EventStats eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
