"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Gift, Filter, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"
import { toast } from "@/components/ui/use-toast"
import { presentAPI } from "@/lib/api/present"
import type { GiftType } from "@/lib/types"
import { eventAPI } from "@/lib/api/event"
import { SelectEvent } from "@/lib/interface/event"


export default function GiftsPage() {
  const [allGifts, setAllGifts] = useState<GiftType[]>([])
  const [allEvents, setAllEvents] = useState<SelectEvent[]>([])
  const [filteredGifts, setFilteredGifts] = useState<GiftType[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [sortOrder, setSortOrder] = useState("recentes")
  const [selectedEvent, setSelectedEvent] = useState("todos")
  const [loading, setLoading] = useState(false)

  // 1) Fetch inicial
  useEffect(() => {
    setLoading(true)
    presentAPI
      .list()
      .then((gifts) => {
        setAllGifts(gifts)
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar presentes",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  // 2) Fetch inicial de eventos
  useEffect(() => {
    eventAPI
      .selectEvent()
      .then((data) => setAllEvents(data))
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
  }, [])

  // 3) Filtrar + ordenar sempre que mudar allGifts, activeTab, sortOrder ou selectedEvent
  useEffect(() => {
    let result = [...allGifts]

    // Filtro por evento
    if (selectedEvent !== "todos") {
      result = result.filter((g) => g.eventId === selectedEvent)
    }

    // Filtro por status
    if (activeTab === "reservados") {
      result = result.filter((g) => (g.reserved ?? 0) > 0)
    } else if (activeTab === "disponiveis") {
      result = result.filter((g) => !(g.reserved ?? 0))
    }

    // Ordenação
    switch (sortOrder) {
      case "recentes":
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case "antigos":
        result.sort((a, b) => a.id.localeCompare(b.id))
        break
      case "alfabetica":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "preco-alto":
        result.sort(
          (a, b) =>
            parseFloat(
              b.price.replace(/[^\d,]/g, "").replace(",", ".")
            ) -
            parseFloat(
              a.price.replace(/[^\d,]/g, "").replace(",", ".")
            )
        )
        break
      case "preco-baixo":
        result.sort(
          (a, b) =>
            parseFloat(
              a.price.replace(/[^\d,]/g, "").replace(",", ".")
            ) -
            parseFloat(
              b.price.replace(/[^\d,]/g, "").replace(",", ".")
            )
        )
        break
      default:
        break
    }

    setFilteredGifts(result)
  }, [allGifts, activeTab, sortOrder, selectedEvent])

  // 3) Cálculo dos totais
  const totalGifts = allGifts.length
  const reservedGifts = allGifts.filter((g) => (g.reserved ?? 0) > 0).length
  const availableGifts = totalGifts - reservedGifts

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando presentes...
      </Card>
    )
  }


  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lista de Presentes</h1>
          <p className="text-muted-foreground">Gerencie todos os presentes dos seus eventos.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/presentes/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Presente
          </Link>
        </Button>
      </div>

      {/* Anúncio no topo */}
      <DashboardAd slot="gifts-top" format="horizontal" />

      {/* Filtro por evento */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtrar por evento:</span>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecione um evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os eventos</SelectItem>
            {allEvents?.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs e ordenação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="todos">Todos ({totalGifts})</TabsTrigger>
            <TabsTrigger value="reservados">Reservados ({reservedGifts})</TabsTrigger>
            <TabsTrigger value="disponiveis">Disponíveis ({availableGifts})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
              <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              <SelectItem value="preco-alto">Maior preço</SelectItem>
              <SelectItem value="preco-baixo">Menor preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de presentes */}
      {filteredGifts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>

          {/* Anúncio no meio */}
          <DashboardAd slot="gifts-middle" format="horizontal" />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Gift className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhum presente encontrado</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            {selectedEvent !== "todos"
              ? "Não há presentes cadastrados para este evento."
              : activeTab === "todos"
                ? "Você ainda não adicionou nenhum presente. Comece adicionando seu primeiro presente agora."
                : activeTab === "reservados"
                  ? "Você não possui presentes reservados."
                  : "Você não possui presentes disponíveis."}
          </p>
          <Button asChild>
            <Link href="/dashboard/presentes/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar meu primeiro presente
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

function GiftCard({ gift }: { gift: GiftType & { eventId?: string; eventName?: string } }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={gift.image || "/placeholder.svg"}
          alt={gift.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-lg">
            {gift.name}
          </CardTitle>
          {gift.eventName && (
            <Badge variant="outline" className="ml-2 whitespace-nowrap">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {gift.eventName}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {gift.description || "Sem descrição"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between">
          <span className="font-medium">
            {gift.price}
          </span>
          <span className="text-sm text-muted-foreground">
            {gift.reserved
              ? `${gift.reserved}/${gift.quantity} reservados`
              : "0 reservados"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/presentes/${gift.id}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}