"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Calendar,  Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/dashboard/event-card"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"
import { eventAPI } from "@/lib/api/event"
import { toast } from "@/components/ui/use-toast"
import type { EventType } from "@/lib/interface/event"

// Excluir
import { mockEvents } from "@/lib/mock-data"

export default function DashboardPage() {
  //const [events, setEvents] = useState<EventType[]>([])
  const [events, setEvents]  = useState<EventType[]>(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([])
  const [activeTab, setActiveTab] = useState<"todos" | "ativos" | "rascunhos">("todos")
  const [sortOrder, setSortOrder] = useState<"recentes" | "antigos" | "alfabetica">("recentes")
  const [loading, setLoading] = useState<boolean>(true)

  // Função para filtrar e ordenar eventos


  // 1) Fetch inicial de events
  useEffect(() => {
    setLoading(true)
    eventAPI.list()
      .then((data) => {
        setEvents(data)
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // 2) Filtra e ordena sempre que mudar events, activeTab ou sortOrder
  useEffect(() => {
    let result = [...events]

    // Filtrar por aba
    if (activeTab === "ativos") {
      result = result.filter((e) => e.status === "active")
    } else if (activeTab === "rascunhos") {
      result = result.filter((e) => e.status === "draft")
    }

    // Ordenação
    if (sortOrder === "recentes") {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else if (sortOrder === "antigos") {
      result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    } else if (sortOrder === "alfabetica") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredEvents(result)
  }, [events, activeTab, sortOrder])


  // Contagem de eventos por status
  const totalEvents = events?.length ?? 0
  const activeEvents = events?.filter((e) => e.status === "active")?.length ?? 0
  const draftEvents = events?.filter((e) => e.status === "draft")?.length ?? 0

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Eventos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus eventos em um só lugar.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/eventos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {/* Anúncio no topo do dashboard */}
      <DashboardAd slot="dashboard-top" format="horizontal" />

      {/* Filtros e Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="todos">Todos ({totalEvents})</TabsTrigger>
            <TabsTrigger value="ativos">Ativos ({activeEvents})</TabsTrigger>
            <TabsTrigger value="rascunhos">Rascunhos ({draftEvents})</TabsTrigger>
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
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de eventos */}
      {loading ? (
        <Card className="p-8 text-center">
          <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
          Carregando eventos...
        </Card>
      ) : filteredEvents.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Anúncio no meio da lista de eventos */}
          <DashboardAd slot="dashboard-middle" format="horizontal" />

          {filteredEvents.length > 3 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.slice(3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Anúncio no final da página */}
          <DashboardAd slot="dashboard-bottom" format="horizontal" />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhum evento encontrado</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            {activeTab === "todos"
              ? "Você ainda não criou nenhum evento. Comece criando seu primeiro evento agora."
              : activeTab === "ativos"
                ? "Você não possui eventos ativos. Ative um rascunho ou crie um novo evento."
                : "Você não possui eventos em rascunho."}
          </p>
          <Button asChild>
            <Link href="/dashboard/eventos/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar meu primeiro evento
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
