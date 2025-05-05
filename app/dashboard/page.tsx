"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockEvents } from "@/lib/mock-data"
import { EventCard } from "@/components/dashboard/event-card"
import type { EventType } from "@/lib/types"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("todos")
  const [sortOrder, setSortOrder] = useState("recentes")
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>(mockEvents)

  // Função para filtrar e ordenar eventos
  useEffect(() => {
    let result = [...mockEvents]

    // Aplicar filtro por status
    if (activeTab === "ativos") {
      result = result.filter((event) => event.status === "active")
    } else if (activeTab === "rascunhos") {
      result = result.filter((event) => event.status === "draft")
    }

    // Aplicar ordenação
    if (sortOrder === "recentes") {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else if (sortOrder === "antigos") {
      result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    } else if (sortOrder === "alfabetica") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredEvents(result)
  }, [activeTab, sortOrder])

  // Contagem de eventos por status
  const totalEvents = mockEvents.length
  const activeEvents = mockEvents.filter((event) => event.status === "active").length
  const draftEvents = mockEvents.filter((event) => event.status === "draft").length

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

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
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
