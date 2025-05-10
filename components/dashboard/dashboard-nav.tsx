"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Gift,
  Users,
  BarChart,
  Settings,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { configuracaoAPI } from "@/lib/api/configuracao"
import { MenuItem} from "@/lib/interface/configuracao"

const iconMap: Record<MenuItem["icon"], React.FC<React.SVGProps<SVGSVGElement>>> = {
  Calendar,
  Gift,
  Users,
  BarChart,
  Settings,
}

export function DashboardNav() {
  const pathname = usePathname()
  const { toast } = useToast()
  const [navItems, setNavItems] = useState<MenuItem[]>([])

  useEffect(() => {
    configuracaoAPI
      .listMenu()
      .then((items) => setNavItems(items))
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Falha ao carregar menu",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
  }, [])

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon]
        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              pathname === item.href && "bg-muted font-medium"
            )}
            asChild
          >
            <Link href={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
