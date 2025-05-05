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
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { logoutUser } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"

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
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  // Persistir o estado de collapsed no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed))
  }, [collapsed])

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

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen border-r bg-background transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full w-full flex-col">
          {/* Logo */}
          <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">OK</span>
                </div>
                <span className="text-lg font-semibold">Organizaki</span>
              </Link>
            )}
            {collapsed && (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">OK</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", collapsed && "hidden")}
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className={cn("flex items-center gap-3 border-b p-4", collapsed ? "justify-center" : "justify-start")}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/diverse-user-avatars.png" alt="@usuário" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            {!collapsed && (
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
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0")} />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                </Tooltip>
              ))}
            </nav>
          </div>

          {/* Fixed Bottom Section */}
          <div className="border-t bg-background">
            {/* Quick Actions */}
            <div className={cn("p-2", collapsed ? "px-2" : "px-4")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/eventos/novo"
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                      collapsed && "justify-center",
                    )}
                  >
                    <PlusCircle className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Novo Evento</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Novo Evento</TooltipContent>}
              </Tooltip>
            </div>

            {/* Footer Actions */}
            <div className={cn("grid gap-1 p-2", collapsed ? "px-2" : "px-4")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center",
                    )}
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Página Inicial</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Página Inicial</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center w-full",
                    )}
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Sair</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-md",
            !collapsed && "hidden",
          )}
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </aside>
    </TooltipProvider>
  )
}
