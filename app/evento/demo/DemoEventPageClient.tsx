"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Gift, Share2, ChevronLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicGiftList } from "@/components/public/public-gift-list"
import { ConfirmPresence } from "@/components/public/confirm-presence"
import { mockEvents } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdBanner } from "@/components/ads/ad-banner"

export default function DemoEventPageClient() {
  // Usando o primeiro evento como demonstração
  const event = mockEvents[0]

  // Dados simulados para a demonstração
  const confirmedGuests = 42
  const pendingGuests = 18
  const totalGifts = 24
  const claimedGifts = 16

  // Garantir que a página comece no topo quando carregada
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Barra de navegação superior */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Voltar para a página inicial</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" title="Compartilhar evento">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Salvar como favorito">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Anúncio no topo da página 
      <div className="container my-4">
        <AdBanner format="leaderboard" slot="demo-top" />
      </div>*/}

      {/* Header com imagem de capa */}
      <div className="relative h-[350px] w-full overflow-hidden md:h-[450px]">
        <Image
          src={event.coverImage || "/placeholder.svg?height=450&width=1200&query=elegant+event+venue"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-10000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="mb-3 bg-primary/90 text-primary-foreground">Demonstração</Badge>
          <h1 className="text-3xl font-bold md:text-5xl">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do evento */}
      <div className="container -mt-6 mb-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="border-none bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">{confirmedGuests}</div>
              <div className="text-xs text-muted-foreground">Confirmados</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Users className="mb-2 h-5 w-5 text-amber-500" />
              <div className="text-2xl font-bold">{pendingGuests}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Gift className="mb-2 h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">
                {claimedGifts}/{totalGifts}
              </div>
              <div className="text-xs text-muted-foreground">Presentes</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Calendar className="mb-2 h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground">Dias restantes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Anúncio após as estatísticas */}
      <div className="container my-6">
        <AdBanner format="horizontal" slot="demo-stats" />
      </div>

      {/* Conteúdo principal */}
      <div className="container pb-16">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="info" className="rounded-md">
              Informações
            </TabsTrigger>
            <TabsTrigger value="gifts" className="rounded-md">
              Lista de Presentes
            </TabsTrigger>
            <TabsTrigger value="confirm" className="rounded-md">
              Confirmar Presença
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 py-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Sobre o Evento</h2>
              <p className="text-muted-foreground">{event.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  Casamento
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Cerimônia
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Recepção
                </Badge>
              </div>
            </div>

            {/* Anúncio após a seção "Sobre o Evento" */}
            <div className="my-6">
              <AdBanner format="horizontal" slot="demo-about" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Anfitriões</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="/woman-portrait.png" alt="Maria" />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Maria Silva</div>
                      <div className="text-sm text-muted-foreground">Noiva</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="/thoughtful-man-portrait.png" alt="João" />
                      <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">João Santos</div>
                      <div className="text-sm text-muted-foreground">Noivo</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Cronograma</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      16:00
                    </div>
                    <div>
                      <div className="font-medium">Recepção dos convidados</div>
                      <div className="text-sm text-muted-foreground">Hall de entrada</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      17:00
                    </div>
                    <div>
                      <div className="font-medium">Cerimônia</div>
                      <div className="text-sm text-muted-foreground">Jardim principal</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      19:00
                    </div>
                    <div>
                      <div className="font-medium">Jantar e festa</div>
                      <div className="text-sm text-muted-foreground">Salão principal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Localização</h2>
              <div className="aspect-video overflow-hidden rounded-md bg-muted">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(event.location)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex-shrink-0 whitespace-nowrap gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Como chegar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-shrink-0 whitespace-nowrap gap-1.5">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Compartilhar local</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Anúncio após a seção de localização */}
            <div className="my-6">
              <AdBanner format="rectangle" slot="demo-map" />
            </div>
          </TabsContent>

          <TabsContent value="gifts" className="py-6">
            <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-bold">Lista de Presentes</h2>
              <p className="text-muted-foreground">
                Escolha um presente da lista abaixo para presentear os noivos. Você pode filtrar por categoria ou faixa
                de preço.
              </p>
            </div>

            {/* Anúncio antes da lista de presentes */}
            <div className="mb-6">
              <AdBanner format="horizontal" slot="demo-gifts-top" />
            </div>

            <PublicGiftList eventId={event.id} />

            {/* Anúncio após a lista de presentes */}
            <div className="mt-6">
              <AdBanner format="horizontal" slot="demo-gifts-bottom" />
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="py-6">
            <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-bold">Confirmar Presença</h2>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo para confirmar sua presença no evento. Você pode incluir acompanhantes e
                informar restrições alimentares.
              </p>
            </div>

            {/* Anúncio antes do formulário de confirmação */}
            <div className="mb-6">
              <AdBanner format="horizontal" slot="demo-confirm-top" />
            </div>

            <ConfirmPresence eventId={event.id} />

            {/* Anúncio após o formulário de confirmação */}
            <div className="mt-6">
              <AdBanner format="horizontal" slot="demo-confirm-bottom" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Anúncio antes do rodapé */}
      <div className="container mb-6">
        <AdBanner format="leaderboard" slot="demo-footer" />
      </div>

      {/* Rodapé da página de demonstração */}
      <div className="border-t bg-muted/30">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">Esta é uma página de demonstração do Evento Fácil.</p>
            <div className="flex gap-2">
              <Button asChild variant="default" size="sm">
                <Link href="/register">Criar meu evento</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Saiba mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
