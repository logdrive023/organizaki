"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, Gift, Users, Info, Check, Filter, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Tipo para as notificações
interface Notification {
  id: string
  title: string
  message: string
  type: "event" | "gift" | "guest" | "system"
  read: boolean
  date: string
  link?: string
}

// Dados de exemplo para notificações
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Novo convidado confirmado",
    message: "Ana Oliveira confirmou presença no seu evento 'Casamento de João e Maria'",
    type: "guest",
    read: false,
    date: "2025-05-04T14:30:00Z",
    link: "/dashboard/convidados",
  },
  {
    id: "notif-2",
    title: "Presente reservado",
    message: "O presente 'Jogo de Panelas Tramontina' foi reservado por Carlos Silva",
    type: "gift",
    read: false,
    date: "2025-05-04T10:15:00Z",
    link: "/dashboard/presentes",
  },
  {
    id: "notif-3",
    title: "Lembrete de evento",
    message: "Seu evento 'Aniversário de 1 ano do Pedro' acontecerá em 7 dias",
    type: "event",
    read: true,
    date: "2025-05-03T09:00:00Z",
    link: "/dashboard/eventos/event-2",
  },
  {
    id: "notif-4",
    title: "Atualização do sistema",
    message: "Novos recursos foram adicionados à plataforma. Confira as novidades!",
    type: "system",
    read: true,
    date: "2025-05-02T16:45:00Z",
  },
  {
    id: "notif-5",
    title: "Convidado recusou",
    message: "Roberto Santos recusou o convite para 'Casamento de João e Maria'",
    type: "guest",
    read: true,
    date: "2025-05-01T11:20:00Z",
    link: "/dashboard/convidados",
  },
  {
    id: "notif-6",
    title: "Presente comprado",
    message: "O presente 'Cafeteira Elétrica' foi marcado como comprado",
    type: "gift",
    read: true,
    date: "2025-04-30T13:10:00Z",
    link: "/dashboard/presentes",
  },
  {
    id: "notif-7",
    title: "Novo evento criado",
    message: "Seu evento 'Chá de Bebê da Ana' foi criado com sucesso",
    type: "event",
    read: true,
    date: "2025-04-29T09:45:00Z",
    link: "/dashboard/eventos/event-3",
  },
  {
    id: "notif-8",
    title: "Manutenção programada",
    message: "O sistema estará indisponível para manutenção no dia 10/05 das 02:00 às 04:00",
    type: "system",
    read: true,
    date: "2025-04-28T17:30:00Z",
  },
  {
    id: "notif-9",
    title: "Convites enviados",
    message: "Os convites para 'Casamento de João e Maria' foram enviados com sucesso",
    type: "guest",
    read: true,
    date: "2025-04-27T14:20:00Z",
    link: "/dashboard/convidados",
  },
  {
    id: "notif-10",
    title: "Lista de presentes atualizada",
    message: "Novos itens foram adicionados à lista de presentes do evento 'Casamento de João e Maria'",
    type: "gift",
    read: true,
    date: "2025-04-26T11:05:00Z",
    link: "/dashboard/presentes",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("todas")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications)

  const itemsPerPage = 5

  // Função para filtrar notificações
  useEffect(() => {
    let result = [...notifications]

    // Filtrar por status (lida/não lida)
    if (activeTab === "naoLidas") {
      result = result.filter((notif) => !notif.read)
    } else if (activeTab === "lidas") {
      result = result.filter((notif) => notif.read)
    }

    // Filtrar por tipo
    if (typeFilter !== "todas") {
      result = result.filter((notif) => notif.type === typeFilter)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (notif) => notif.title.toLowerCase().includes(query) || notif.message.toLowerCase().includes(query),
      )
    }

    // Ordenar por data (mais recentes primeiro)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredNotifications(result)
    setCurrentPage(1) // Resetar para a primeira página quando os filtros mudam
  }, [activeTab, typeFilter, searchQuery, notifications])

  // Calcular paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  // Função para marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  // Função para marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  // Função para excluir uma notificação
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  // Função para excluir todas as notificações
  const deleteAllNotifications = () => {
    setNotifications([])
  }

  // Função para obter o ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "gift":
        return <Gift className="h-5 w-5 text-green-500" />
      case "guest":
        return <Users className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
        <p className="text-muted-foreground">Gerencie todas as suas notificações em um só lugar.</p>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 items-center rounded-md border bg-muted/40 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Buscar notificações..."
            className="h-9 flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos os tipos</SelectItem>
              <SelectItem value="event">Eventos</SelectItem>
              <SelectItem value="gift">Presentes</SelectItem>
              <SelectItem value="guest">Convidados</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="naoLidas">Não lidas</TabsTrigger>
            <TabsTrigger value="lidas">Lidas</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {notifications.some((n) => !n.read) && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Marcar todas como lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" className="text-destructive" onClick={deleteAllNotifications}>
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar tudo
              </Button>
            )}
          </div>
        </div>
      </Tabs>

      {/* Lista de notificações */}
      {paginatedNotifications.length > 0 ? (
        <div className="space-y-4">
          {paginatedNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "" : "bg-muted/30"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && <Badge className="bg-primary text-xs">Nova</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Marcar como lida</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1
                  // Mostrar apenas páginas próximas à atual
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhuma notificação encontrada</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            {searchQuery || typeFilter !== "todas" || activeTab !== "todas"
              ? "Nenhuma notificação corresponde aos filtros selecionados."
              : "Você não tem notificações no momento."}
          </p>
        </Card>
      )}
    </div>
  )
}
