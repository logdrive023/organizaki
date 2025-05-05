"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Users, Search, Mail, CheckCircle, XCircle, HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockGuests, mockEvents } from "@/lib/mock-data"
import Link from "next/link"
import type { GuestType } from "@/lib/types"
import { sendInvites } from "@/lib/guest-actions"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { GuestDetailsDialog } from "@/components/dashboard/guest-details-dialog"

export default function GuestsPage() {
  const [activeTab, setActiveTab] = useState("todos")
  const [sortOrder, setSortOrder] = useState("recentes")
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("todos")
  const [filteredGuests, setFilteredGuests] = useState<GuestType[]>(mockGuests)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GuestType | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  // Função para filtrar e ordenar convidados
  useEffect(() => {
    let result = [...mockGuests]

    // Aplicar filtro por status
    if (activeTab === "confirmados") {
      result = result.filter((guest) => guest.status === "confirmed")
    } else if (activeTab === "pendentes") {
      result = result.filter((guest) => guest.status === "pending")
    } else if (activeTab === "recusados") {
      result = result.filter((guest) => guest.status === "declined")
    }

    // Aplicar filtro por evento
    if (eventFilter !== "todos") {
      result = result.filter((guest) => guest.eventId === eventFilter)
    }

    // Aplicar busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query) ||
          guest.email.toLowerCase().includes(query) ||
          (guest.phone && guest.phone.toLowerCase().includes(query)),
      )
    }

    // Aplicar ordenação
    if (sortOrder === "recentes") {
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortOrder === "alfabetica") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "status") {
      const statusOrder = { confirmed: 1, pending: 2, declined: 3 }
      result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    }

    setFilteredGuests(result)
    // Limpar seleções quando os filtros mudam
    setSelectedGuests([])
  }, [activeTab, sortOrder, searchQuery, eventFilter])

  // Contagem de convidados por status
  const totalGuests = mockGuests.length
  const confirmedGuests = mockGuests.filter((guest) => guest.status === "confirmed").length
  const pendingGuests = mockGuests.filter((guest) => guest.status === "pending").length
  const declinedGuests = mockGuests.filter((guest) => guest.status === "declined").length

  // Função para obter o nome do evento pelo ID
  const getEventName = (eventId: string) => {
    const event = mockEvents.find((e) => e.id === eventId)
    return event ? event.title : "Evento não encontrado"
  }

  // Função para renderizar o ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "declined":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <HelpCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Função para renderizar o badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmado</Badge>
      case "declined":
        return <Badge variant="destructive">Recusado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  // Função para selecionar/deselecionar todos os convidados
  const toggleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(filteredGuests.map((guest) => guest.id))
    }
  }

  // Função para selecionar/deselecionar um convidado
  const toggleSelectGuest = (guestId: string) => {
    if (selectedGuests.includes(guestId)) {
      setSelectedGuests(selectedGuests.filter((id) => id !== guestId))
    } else {
      setSelectedGuests([...selectedGuests, guestId])
    }
  }

  // Função para enviar convites
  const handleSendInvites = async () => {
    if (selectedGuests.length === 0) {
      toast({
        title: "Nenhum convidado selecionado",
        description: "Selecione pelo menos um convidado para enviar o convite.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      // Usar o ID do evento do primeiro convidado selecionado
      // Em uma aplicação real, você pode querer agrupar por evento
      const firstGuest = filteredGuests.find((g) => g.id === selectedGuests[0])
      const eventId = firstGuest?.eventId || "default-event"

      const result = await sendInvites(eventId, selectedGuests)

      toast({
        title: "Convites enviados com sucesso!",
        description: `${result.sent} convites foram enviados.`,
        variant: "default",
      })

      // Limpar seleções após envio bem-sucedido
      setSelectedGuests([])
    } catch (error) {
      toast({
        title: "Erro ao enviar convites",
        description: "Ocorreu um erro ao enviar os convites. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Função para abrir o diálogo de detalhes do convidado
  const openGuestDetails = (guest: GuestType) => {
    setSelectedGuest(guest)
    setIsDetailsOpen(true)
  }

  // Função para salvar as alterações do convidado
  const handleSaveGuest = (updatedGuest: GuestType) => {
    // Em uma aplicação real, você enviaria isso para o servidor
    // Aqui, apenas atualizamos o estado local
    const updatedGuests = mockGuests.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))

    // Atualizar a lista filtrada também
    setFilteredGuests(filteredGuests.map((g) => (g.id === updatedGuest.id ? updatedGuest : g)))

    toast({
      title: "Convidado atualizado",
      description: "As informações do convidado foram atualizadas com sucesso.",
    })

    setIsDetailsOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Convidados</h1>
          <p className="text-muted-foreground">Gerencie a lista de convidados dos seus eventos.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleSendInvites}
            disabled={selectedGuests.length === 0 || isSending}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {isSending ? "Enviando..." : "Enviar Convites"}
          </Button>
          <Button asChild>
            <Link href="/dashboard/convidados/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 items-center rounded-md border bg-muted/40 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            className="h-9 flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os eventos</SelectItem>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({totalGuests})</TabsTrigger>
          <TabsTrigger value="confirmados">Confirmados ({confirmedGuests})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({pendingGuests})</TabsTrigger>
          <TabsTrigger value="recusados">Recusados ({declinedGuests})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de convidados */}
      {filteredGuests.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedGuests.includes(guest.id)}
                      onCheckedChange={() => toggleSelectGuest(guest.id)}
                      aria-label={`Selecionar ${guest.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone || "-"}</TableCell>
                  <TableCell>{getEventName(guest.eventId || "")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(guest.status)}
                      {getStatusBadge(guest.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openGuestDetails(guest)}>
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Remover
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhum convidado encontrado</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "Nenhum convidado corresponde à sua busca. Tente outros termos."
              : "Adicione convidados à sua lista para enviar convites e acompanhar confirmações."}
          </p>
          <Button asChild>
            <Link href="/dashboard/convidados/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Link>
          </Button>
        </Card>
      )}

      {/* Diálogo de detalhes do convidado */}
      <GuestDetailsDialog
        guest={selectedGuest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onSave={handleSaveGuest}
      />
    </div>
  )
}
