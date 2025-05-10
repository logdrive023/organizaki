"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/auth-actions"

interface UserInfo {
  name: string
  email: string
}

export function UserNav() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Usuário Demo",
    email: "usuario@exemplo.com",
  })

  useEffect(() => {
    async function loadUserInfo() {
      try {
        let cookieValue: string | undefined

        // try the new cookieStore API if available
        if (typeof window !== "undefined" && "cookieStore" in window) {
          // @ts-ignore
          const c = await window.cookieStore.get("user-info")
          cookieValue = c?.value
        } else {
          // fallback to document.cookie
          cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user-info="))
            ?.split("=")[1]
        }

        if (cookieValue) {
          const decoded = decodeURIComponent(cookieValue)
          const parsed = JSON.parse(decoded) as Partial<UserInfo>
          setUserInfo({
            name: parsed.name || userInfo.name,
            email: parsed.email || userInfo.email,
          })
        }
      } catch (err) {
        console.error("Erro ao obter informações do usuário:", err)
      }
    }

    loadUserInfo()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/diverse-user-avatars.png" alt={userInfo.name} />
            <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            Meus Eventos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/configuracoes")}>
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}