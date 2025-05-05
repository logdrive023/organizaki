"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationDropdown } from "@/components/dashboard/notification-dropdown"
import { Search, Menu } from "lucide-react"
import { useSidebar } from "@/store/use-sidebar"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const pathname = usePathname()
  const { isCollapsed, onExpand, onCollapse } = useSidebar()
  const [isMounted, setIsMounted] = useState(false)

  // Garantir renderização do lado do cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Função para obter o título da página com base no pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Meus Eventos"
    if (pathname.includes("/dashboard/presentes")) return "Listas de Presentes"
    if (pathname.includes("/dashboard/convidados")) return "Convidados"
    if (pathname.includes("/dashboard/estatisticas")) return "Estatísticas"
    if (pathname.includes("/dashboard/configuracoes")) return "Configurações"
    if (pathname.includes("/dashboard/notificacoes")) return "Notificações"
    if (pathname.includes("/dashboard/eventos/novo")) return "Novo Evento"
    return "Dashboard"
  }

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="w-full md:max-w-sm lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => onExpand()}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-full md:max-w-sm lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <Link href="/dashboard/eventos/novo">
          <Button size="sm" className="hidden md:flex">
            Novo Evento
          </Button>
        </Link>
      </div>
    </header>
  )
}
