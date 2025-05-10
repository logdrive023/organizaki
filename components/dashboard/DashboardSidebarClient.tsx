"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "@/store/use-sidebar"
import { useToast } from "@/components/ui/use-toast"
import { configuracaoAPI } from "@/lib/api/configuracao"
import { logoutUser } from "@/lib/auth-actions"
import { cookies } from "next/headers"

// shape of each menu item coming from the API
interface MenuItem {
  title: string
  href: string
  icon: "Calendar" | "Gift" | "Users" | "BarChart" | "Notifications" | "Settings"
  exact?: boolean
}

const iconMap: Record<MenuItem["icon"], React.FC<React.SVGProps<SVGSVGElement>>> = {
  Calendar,
  Gift,
  Users,
  BarChart,
  Notifications: Bell,
  Settings,
}

interface DashboardSidebarClientProps {
    user: { name: string; email: string } | null
  }

export default function DashboardSidebarClient({ user }: DashboardSidebarClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { onCollapse, toggle, isCollapsed } = useSidebar()
  const { toast } = useToast()

  const [navItems, setNavItems] = useState<MenuItem[]>([])
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true)
    configuracaoAPI
      .listMenu()
      .then((items) => setNavItems(items))
      .catch((err: any) => {
        toast({
          variant: "destructive",
          title: "Falha ao carregar menu",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
  }, [toast])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  const isActive = (href: string) => {
    // treat the root dashboard link as exact
    if (href === "/dashboard") {
      return pathname === href
    }
    // everything else matches any deeper path
    return pathname.startsWith(href)
  }

  if (!isMounted) return null

  return (
    <>
      {/** Overlay for mobile when open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCollapse}
          aria-hidden="true"
        />
      )}

      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-background transition-all duration-300",
            isCollapsed
              ? "-translate-x-full md:translate-x-0 md:w-16"
              : "translate-x-0 w-64 md:w-64",
            "md:z-30"
          )}
        >
          {/** Header */}
          <div
            className={cn(
              "flex h-16 items-center border-b px-4",
              isCollapsed ? "md:justify-center" : "justify-between"
            )}
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">OK</span>
              </div>
              {!isCollapsed && <span className="text-lg font-semibold">Organizaki</span>}
            </Link>

            <div className="flex items-center gap-2">
              {/** close mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8"
                onClick={onCollapse}
              >
                <X className="h-4 w-4" />
              </Button>

              {/** collapse desktop */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden md:flex h-8 w-8", isCollapsed && "md:hidden")}
                onClick={toggle}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/** User section */}
          <div
            className={cn(
              "flex items-center gap-3 border-b p-4",
              isCollapsed ? "md:justify-center" : "justify-start"
            )}
          >
            <div className="relative flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/diverse-user-avatars.png"
                  alt={user?.name ?? "Usuário"}
                />
                <AvatarFallback>
                  {(user?.name ?? "??").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                <span className="text-sm font-medium">
                  {user?.name ?? "Carregando..."}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </span>
              </div>
            )}
          </div>

          {/** Nav links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon]
                const active = isActive(item.href)
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          isCollapsed && "md:justify-center",
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) onCollapse()
                        }}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                )
              })}

            </nav>
          </div>

          {/** Footer actions */}
          <div className="border-t bg-background">
            <div className={cn("p-2", isCollapsed ? "md:px-2" : "px-4")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/eventos/novo"
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                      isCollapsed && "md:justify-center"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 768) onCollapse()
                    }}
                  >
                    <PlusCircle className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>Novo Evento</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Novo Evento</TooltipContent>}
              </Tooltip>
            </div>
            <div className={cn("grid gap-1 p-2", isCollapsed ? "md:px-2" : "px-4")}>
              {/*<Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isCollapsed && "md:justify-center"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 768) onCollapse()
                    }}
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>Página Inicial</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Página Inicial</TooltipContent>}
              </Tooltip>*/}

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full",
                      isCollapsed && "md:justify-center"
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
        </aside>
      </TooltipProvider>
    </>
  )
}
