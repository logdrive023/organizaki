"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar, Gift, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { configuracaoAPI } from "@/lib/api/configuracao"
import { NotificationDropDown } from "@/lib/interface/configuracao"



export function NotificationDropdown() {
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<NotificationDropDown[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    configuracaoAPI
      .listNotificationsDropDown()
      .then((list) => setNotifications(list))
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Falha ao carregar notificações",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => setLoading(false))
  }, [toast])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await configuracaoAPI.markNotificationRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao marcar como lida",
        description: err.message || "Tente novamente mais tarde.",
      })
    }
  }

  const markAllAsRead = async () => {
    const toMark = notifications.filter((n) => !n.read).map((n) => n.id)
    try {
      await Promise.all(toMark.map((id) => configuracaoAPI.markNotificationRead(id)))
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao marcar todas como lidas",
        description: err.message || "Tente novamente mais tarde.",
      })
    }
  }

  const handleNotificationClick = async (n: NotificationDropDown) => {
    if (!n.read) await markAsRead(n.id)
    setIsOpen(false)
    if (n.link) router.push(n.link)
  }


  const getIcon = (type: NotificationDropDown["type"]) => {
    switch (type) {
      case "event": return <Calendar className="h-4 w-4 text-blue-500" />
      case "gift": return <Gift className="h-4 w-4 text-green-500" />
      case "guest": return <Users className="h-4 w-4 text-purple-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = Date.now()
    const diffH = Math.floor((now - d.getTime()) / 36e5)
    if (diffH < 1) return "Agora mesmo"
    if (diffH < 24) return `${diffH}h atrás`
    return `${Math.floor(diffH / 24)}d atrás`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="p-0 text-xs">
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex flex-col gap-1 p-3 ${!n.read ? "bg-muted/50" : ""}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      {getIcon(n.type)}
                      <span className="font-medium">{n.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(n.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Você não tem notificações no momento
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center text-primary font-medium"
          onClick={() => {
            setIsOpen(false)
            router.push("/dashboard/notificacoes")
          }}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
