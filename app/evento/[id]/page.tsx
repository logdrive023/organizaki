import type { Metadata } from "next"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicGiftList } from "@/components/public/public-gift-list"
import { ConfirmPresence } from "@/components/public/confirm-presence"
import { mockEvents } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Detalhes do Evento - Evento Fácil",
  description: "Visualize os detalhes do evento e confirme sua presença",
}

export default function PublicEventPage({ params }) {
  // Em uma aplicação real, buscaríamos o evento pelo ID
  const event = mockEvents.find((e) => e.id === params.id) || mockEvents[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header com imagem de capa melhorada */}
      <div className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[3/1] md:aspect-[21/9]">
        <Image
          src={event.coverImage || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-6 lg:p-8">
          <h1 className="text-2xl font-bold drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">{event.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container py-8">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="gifts">Lista de Presentes</TabsTrigger>
            <TabsTrigger value="confirm">Confirmar Presença</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-6 py-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Sobre o Evento</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Localização</h2>
              <div className="aspect-video overflow-hidden rounded-md">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(event.location)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
            </div>
          </TabsContent>
          <TabsContent value="gifts" className="py-6">
            <PublicGiftList eventId={event.id} />
          </TabsContent>
          <TabsContent value="confirm" className="py-6">
            <ConfirmPresence eventId={event.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
