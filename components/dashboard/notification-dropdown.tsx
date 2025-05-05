"use client"

import { useState } from "react"
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
import { useRouter } from "next/navigation"

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
]

export function NotificationDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  // Contagem de notificações não lidas
  const unreadCount = notifications.filter((notif) => !notif.read).length

  // Função para marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  // Função para marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  // Função para lidar com o clique em uma notificação
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setIsOpen(false)

    if (notification.link) {
      router.push(notification.link)
    }
  }

  // Função para obter o ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "gift":
        return <Gift className="h-4 w-4 text-green-500" />
      case "guest":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Agora mesmo"
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d atrás`
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal text-primary"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-start gap-1 p-3",
                    !notification.read && "bg-muted/50",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium">{notification.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">Você não tem notificações no momento</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center font-medium text-primary"
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
