"use client"

import { useState, useEffect } from "react"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationDropdown } from "@/components/dashboard/notification-dropdown"
import { UserNav } from "@/components/dashboard/user-nav"
import { useSidebar } from "@/store/use-sidebar"
import { useAdsSettings } from "@/store/use-ads-settings"
import { AdsSettingsDialog } from "@/components/dashboard/ads-settings-dialog"
import { notificationsAPI } from "@/lib/api/notification"

export function DashboardHeader() {
  const { onExpand } = useSidebar()
  const { isPremium } = useAdsSettings()
  const [isAdsDialogOpen, setIsAdsDialogOpen] = useState(false)

  // estado para contagem de notificações não-lidas
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // busca todas as notificações e conta as não-lidas
    notificationsAPI
      .list()
      .then((list) => {
        const count = list.filter((n) => !n.read).length
        setUnreadCount(count)
      })
      .catch((err) => {
        console.error("Erro ao carregar notificações:", err)
      })
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={onExpand}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {!isPremium && (
          <AdsSettingsDialog open={isAdsDialogOpen} onOpenChange={setIsAdsDialogOpen} />
        )}
        <NotificationDropdown>
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificações</span>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </NotificationDropdown>

        <UserNav />
      </div>
    </header>
  )
}
