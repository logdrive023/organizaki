"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Gift,
  Users,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Home,
  LogOut,
  X,
  Bell,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { logoutUser } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/store/use-sidebar"

const navItems = [
  {
    title: "Meus Eventos",
    href: "/dashboard",
    icon: Calendar,
    exact: true,
  },
  {
    title: "Listas de Presentes",
    href: "/dashboard/presentes",
    icon: Gift,
  },
  {
    title: "Convidados",
    href: "/dashboard/convidados",
    icon: Users,
  },
  {
    title: "Estatísticas",
    href: "/dashboard/estatisticas",
    icon: BarChart,
  },
  {
    title: "Notificações",
    href: "/dashboard/notificacoes",
    icon: Bell,
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, onCollapse, onExpand, toggle } = useSidebar()
  const [isMounted, setIsMounted] = useState(false)

  // Garantir renderização do lado do cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Overlay para mobile quando o menu está aberto */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onCollapse} aria-hidden="true" />
      )}

      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-screen border-r bg-background transition-all duration-300",
            isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64 md:w-64",
            "md:z-30",
          )}
        >
          <div className="flex h-full w-full flex-col">
            {/* Logo e botão fechar */}
            <div
              className={cn(
                "flex h-16 items-center border-b px-4",
                isCollapsed ? "md:justify-center" : "justify-between",
              )}
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">OK</span>
                </div>
                {!isCollapsed && <span className="text-lg font-semibold">Organizaki</span>}
              </Link>

              {/* Botão de fechar para mobile */}
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onCollapse}>
                <X className="h-4 w-4" />
              </Button>

              {/* Botão de colapsar para desktop */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hidden md:flex", isCollapsed && "md:hidden")}
                onClick={toggle}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* User Profile com botão de expansão */}
            <div
              className={cn(
                "flex items-center gap-3 border-b p-4",
                isCollapsed ? "md:justify-center" : "justify-start",
              )}
            >
              <div className="relative flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/diverse-user-avatars.png" alt="@usuário" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>

                {/* Botão de expansão visível apenas quando colapsado no desktop */}
                {isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 h-6 w-6 rounded-full bg-background hidden md:flex"
                    onClick={toggle}
                    aria-label="Expandir menu"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Usuário Demo</span>
                  <span className="text-xs text-muted-foreground">usuario@exemplo.com</span>
                </div>
              )}
            </div>

            {/* Navigation - Scrollable */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="grid gap-1 px-2">
                {navItems.map((item) => (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                          isActive(item.href, item.exact)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          isCollapsed && "md:justify-center",
                        )}
                        onClick={() => {
                          // Fechar o menu no mobile após clicar em um item
                          if (window.innerWidth < 768) {
                            onCollapse()
                          }
                        }}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0")} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                ))}
              </nav>
            </div>

            {/* Fixed Bottom Section */}
            <div className="border-t bg-background">
              {/* Quick Actions */}
              <div className={cn("p-2", isCollapsed ? "md:px-2" : "px-4")}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/eventos/novo"
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                        isCollapsed && "md:justify-center",
                      )}
                      onClick={() => {
                        // Fechar o menu no mobile após clicar
                        if (window.innerWidth < 768) {
                          onCollapse()
                        }
                      }}
                    >
                      <PlusCircle className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>Novo Evento</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Novo Evento</TooltipContent>}
                </Tooltip>
              </div>

              {/* Footer Actions */}
              <div className={cn("grid gap-1 p-2", isCollapsed ? "md:px-2" : "px-4")}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        isCollapsed && "md:justify-center",
                      )}
                      onClick={() => {
                        // Fechar o menu no mobile após clicar
                        if (window.innerWidth < 768) {
                          onCollapse()
                        }
                      }}
                    >
                      <Home className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>Página Inicial</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Página Inicial</TooltipContent>}
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full",
                        isCollapsed && "md:justify-center",
                      )}
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>Sair</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Sair</TooltipContent>}
                </Tooltip>
              </div>
            </div>
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}
