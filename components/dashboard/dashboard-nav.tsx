"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Gift, Users, BarChart, Settings } from "lucide-react"

const navItems = [
  {
    title: "Meus Eventos",
    href: "/dashboard",
    icon: Calendar,
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

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn("justify-start", pathname === item.href && "bg-muted font-medium")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
