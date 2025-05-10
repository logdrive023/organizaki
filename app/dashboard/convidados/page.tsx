"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  PlusCircle,
  Users,
  Search,
  Mail,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { GuestDetailsDialog } from "@/components/dashboard/guest-details-dialog"

import { eventAPI } from "@/lib/api/event"
import { sendInvites } from "@/lib/guest-actions"
import type { GuestType, EventType } from "@/lib/interface/event"

import { mockGuests, mockEvents } from "@/lib/mock-data"

export default function GuestsPage() {
  const { toast } = useToast()

  // dados brutos
  const [guests, setGuests] = useState<GuestType[]>([])
  const [events, setEvents] = useState<EventType[]>([])
  // filtrados e ordenados
  //const [filteredGuests, setFilteredGuests] = useState<GuestType[]>([])
  // descomentar para ver o mock
  const [filteredGuests, setFilteredGuests] = useState<GuestType[]>(mockGuests)
  // seleção de checkboxes
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  // filtros, ordenação e busca
  const [activeTab, setActiveTab] = useState<"todos" | "confirmados" | "pendentes" | "recusados">("todos")
  const [sortOrder, setSortOrder] = useState<"recentes" | "alfabetica" | "status">("recentes")
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState<string>("todos")
  // loading / error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // envio de convites
  const [isSending, setIsSending] = useState(false)
  // detalhes & edição
  const [selectedGuest, setSelectedGuest] = useState<GuestType | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [removingIds, setRemovingIds] = useState<string[]>([])
  const [guestToRemove, setGuestToRemove] = useState<GuestType | null>(null)


  // paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // fetch inicial de convidados e eventos
  useEffect(() => {
    setLoading(true)
    Promise.all([eventAPI.selectGust(), eventAPI.selectEventAll()])
      .then(([guestList, eventList]) => {
        setGuests(guestList)
        setEvents(eventList)
      })
      .catch((err: any) => {
        setError(err.message || "Erro ao carregar dados")
        toast({
          variant: "destructive",
          title: "Falha na requisição",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  //filtrar, buscar e ordenar sempre que inputs mudarem
  useEffect(() => {
    let result = [...guests]
  
    // status
    if (activeTab !== "todos") {
      const mapStatus = {
        confirmados: "confirmed",
        pendentes:   "pending",
        recusados:   "declined",
      } as const
      result = result.filter(g => g.status === mapStatus[activeTab])
    }
  
    // evento
    if (eventFilter !== "todos") {
      result = result.filter(g => g.eventId === eventFilter)
    }
  
    // busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        (g.phone?.toLowerCase().includes(q) ?? false)
      )
    }
  
    // ordenação
    if (sortOrder === "recentes") {
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortOrder === "alfabetica") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "status") {
      const order = { confirmed: 1, pending: 2, declined: 3 }
      result.sort((a, b) => order[a.status] - order[b.status])
    }
  
    setFilteredGuests(result)
    setSelectedGuests([])
    setCurrentPage(1)
  }, [guests, activeTab, sortOrder, searchQuery, eventFilter])

  // funções auxiliares
  const getEventName = (id: string) =>
    events.find(e => e.id === id)?.title ?? "Evento não encontrado"

  const getStatusIcon = (s: string) => {
    if (s === "confirmed") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (s === "declined") return <XCircle className="h-5 w-5 text-destructive" />
    return <HelpCircle className="h-5 w-5 text-muted-foreground" />
  }
  const getStatusBadge = (s: string) => {
    if (s === "confirmed") return <Badge className="bg-green-500">Confirmado</Badge>
    if (s === "declined") return <Badge variant="destructive">Recusado</Badge>
    return <Badge variant="outline">Pendente</Badge>
  }

  // seleção em massa
  const toggleSelectAll = () => {
    const safe = filteredGuests ?? []
    setSelectedGuests(
      selectedGuests.length === safe.length ? [] : safe.map(g => g.id)
    )
  }
  const toggleSelectGuest = (id: string) =>
    setSelectedGuests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  // enviar convites
  const handleSendInvites = async () => {
    if (!selectedGuests.length) {
      toast({ title: "Nenhum convidado selecionado", description: "Selecione ao menos um.", variant: "destructive" })
      return
    }
    setIsSending(true)
    try {
      const first = (filteredGuests ?? []).find(g => g.id === selectedGuests[0])
      const { sent } = await sendInvites(first?.eventId ?? "", selectedGuests)
      toast({ title: "Convites enviados", description: `${sent} convites enviados.` })
      setSelectedGuests([])
    } catch {
      toast({ title: "Erro ao enviar convites", variant: "destructive" })
    } finally {
      setIsSending(false)
    }
  }

  // detalhes / edição
  const openGuestDetails = (g: GuestType) => {
    setSelectedGuest(g)
    setIsDetailsOpen(true)
  }
  const handleSaveGuest = (updated: GuestType) => {
    setGuests(prev => prev.map(g => g.id === updated.id ? updated : g))
    toast({ title: "Convidado atualizado", description: "Dados salvos." })
    setIsDetailsOpen(false)
  }

  const handleRemoveGuest = async (guest: GuestType) => {
    // marca como “removendo”
    setRemovingIds(ids => [...ids, guest.id])
  
    try {
      // chama a API
      await eventAPI.removeGuest(guest.eventId!, guest.id)
  
      // atualiza a lista local
      setGuests(prev => prev.filter(g => g.id !== guest.id))
  
      // toast de sucesso
      toast({
        title: "Convidado removido",
        description: `${guest.name} foi removido com sucesso.`,
      })
    } catch (err: any) {
      // toast de erro
      toast({
        variant: "destructive",
        title: "Falha ao remover",
        description: err.message || "Tente novamente mais tarde.",
      })
    }
  
    // limpa sempre, depois do try/catch
    setRemovingIds(ids => ids.filter(id => id !== guest.id))
  }
  



  // loader / erro
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando convidados...
      </Card>
    )
  }

  // paginação
  const safe = filteredGuests ?? []
  const totalGuests = safe.length
  const totalPages = Math.ceil(totalGuests / itemsPerPage) || 1
  const sliceStart = (currentPage - 1) * itemsPerPage
  const sliceEnd = sliceStart + itemsPerPage
  const paginated = safe.slice(sliceStart, sliceEnd)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Convidados</h1>
          <p className="text-muted-foreground">
            Gerencie seus convidados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleSendInvites}
            disabled={!selectedGuests.length || isSending}
          >
            {isSending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Mail className="h-4 w-4" />}
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

      {/* filtros e busca */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 items-center rounded-md border bg-muted/40 px-3">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            className="h-9 flex-1 border-0 bg-transparent px-0 focus-visible:ring-0"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={eventFilter} onValueChange={val => setEventFilter(val)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar evento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os eventos</SelectItem>
              {events.map(ev => (
                <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={val =>
              setSortOrder(val as "recentes" | "alfabetica" | "status")
            }
          >
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* abas */}
      <Tabs value={activeTab} onValueChange={val => setActiveTab(val as any)}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({totalGuests})</TabsTrigger>
          <TabsTrigger value="confirmados">Confirmados ({guests.filter(g => g.status === "confirmed").length})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({guests.filter(g => g.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="recusados">Recusados ({guests.filter(g => g.status === "declined").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* contador e paginação topo */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Tem <strong>{totalGuests}</strong> convidado{totalGuests !== 1 && "s"}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={!hasPrev}>
            Anterior
          </Button>
          <span className="flex items-center px-2">
            {currentPage} / {totalPages}
          </span>
          <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={!hasNext}>
            Próxima
          </Button>
        </div>
      </div>

      {/* tabela */}
      {
        paginated.length > 0 ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedGuests.length === paginated.length}
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
                {paginated.map(guest => (
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
                    <TableCell>{guest.phone || "—"}</TableCell>
                    <TableCell>{getEventName(guest.eventId || "")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(guest.status)}
                        {getStatusBadge(guest.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" type="button" onClick={() => openGuestDetails(guest)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => setGuestToRemove(guest)}
                          disabled={removingIds.includes(guest.id)}
                        >
                          {removingIds.includes(guest.id)
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : "Remover"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Nenhum convidado encontrado</h2>
            <p className="mt-2 mb-8 text-sm text-muted-foreground">
              {searchQuery
                ? "Nenhum convidado corresponde à sua busca."
                : "Adicione convidados para começar."}
            </p>
            <Button asChild>
              <Link href="/dashboard/convidados/novo">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Convidado
              </Link>
            </Button>
          </Card>
        )
      }

      {/* paginação rodapé */}
      {
        totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={!hasPrev}>
              « Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={i + 1 === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={!hasNext}>
              Próxima »
            </Button>
          </div>
        )
      }

      {/* modal de detalhes */}
      <GuestDetailsDialog
        guest={selectedGuest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onSave={handleSaveGuest}
      />

      <Dialog
        open={!!guestToRemove}
        onOpenChange={() => setGuestToRemove(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
            <DialogDescription>
              Tem certeza que quer remover{" "}
              <strong>{guestToRemove?.name}</strong> da lista?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setGuestToRemove(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={async () => {
                if (!guestToRemove) return
                // chama sua lógica de remoção
                await handleRemoveGuest(guestToRemove)
                setGuestToRemove(null)
              }}
              disabled={removingIds.includes(guestToRemove?.id!)}
            >
              {removingIds.includes(guestToRemove?.id!)
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div >
  )
}
