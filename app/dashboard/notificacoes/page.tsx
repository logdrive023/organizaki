"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  Calendar,
  Gift,
  Users,
  Info,
  Check,
  Filter,
  Search,
  Trash2,
  Loader2,
  XCircle,
} from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

import { notificationsAPI } from "@/lib/api/notification"  // implemente esta API
import type { Notification } from "@/lib/interface/notification"             // seu tipo shared

export default function NotificationsPage() {
  const { toast } = useToast()

  // estado principal
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filtros/UI
  const [activeTab, setActiveTab] = useState<"todas" | "naoLidas" | "lidas">("todas")
  const [typeFilter, setTypeFilter] = useState<Notification["type"] | "todas">("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // fetch inicial
  useEffect(() => {
    setLoading(true)
    notificationsAPI
      .list()
      .then((data: Notification[]) => {
        setNotifications(data ?? [])
      })
      .catch((err: any) => {
        const msg = err.message || "Erro ao carregar notificações"
        setError(msg)
        toast({ variant: "destructive", title: "Falha na requisição", description: msg })
      })
      .finally(() => setLoading(false))
  }, [toast])

  // filtra e ordena
  const filteredNotifications = (notifications ?? [])
    .filter((n) =>
      activeTab === "naoLidas" ? !n.read
        : activeTab === "lidas" ? n.read
          : true
    )
    .filter((n) => (typeFilter === "todas" ? true : n.type === typeFilter))
    .filter((n) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  // handlers chamando API
  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Tente novamente." })
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Tente novamente." })
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationsAPI.delete(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Tente novamente." })
    }
  }

  const deleteAllNotifications = async () => {
    try {
      await notificationsAPI.deleteAll()
      setNotifications([])
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Tente novamente." })
    }
  }

  // ícone e formata data
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "event": return <Calendar className="h-5 w-5 text-blue-500" />
      case "gift": return <Gift className="h-5 w-5 text-green-500" />
      case "guest": return <Users className="h-5 w-5 text-purple-500" />
      default: return <Info className="h-5 w-5 text-gray-500" />
    }
  }
  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(d))

  // loading / erro
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando notificações...
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Select
            value={typeFilter}
            onValueChange={(val: string) =>
              setTypeFilter(val as "todas" | "event" | "gift" | "guest" | "system")
            }
          >
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
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="todas"
        value={activeTab}
        onValueChange={(val: string) =>
          setActiveTab(val as "todas" | "naoLidas" | "lidas")
        }
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="naoLidas">Não lidas</TabsTrigger>
            <TabsTrigger value="lidas">Lidas</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {notifications.some(n => !n.read) && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" /> Marcar todas como lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" className="text-destructive" onClick={deleteAllNotifications}>
                <Trash2 className="mr-2 h-4 w-4" /> Limpar tudo
              </Button>
            )}
          </div>
        </div>
      </Tabs>

      {/* Lista de notificações */}
      {paginatedNotifications.length > 0 ? (
        <div className="space-y-4">
          {paginatedNotifications.map(n => (
            <Card key={n.id} className={n.read ? "" : "bg-muted/30"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{n.title}</h3>
                        {!n.read && <Badge className="bg-primary text-xs">Nova</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(n.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && (
                      <Button variant="ghost" size="icon" onClick={() => markAsRead(n.id)}>
                        <Check className="h-4 w-4" /><span className="sr-only">Marcar como lida</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNotification(n.id)}>
                      <Trash2 className="h-4 w-4" /><span className="sr-only">Excluir</span>
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
                    onClick={e => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={e => { e.preventDefault(); setCurrentPage(page) }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                  if ((page === currentPage - 2 && currentPage > 3) || (page === currentPage + 2 && currentPage < totalPages - 2)) {
                    return <PaginationItem key={`el-${page}`}><PaginationEllipsis /></PaginationItem>
                  }
                  return null
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
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
