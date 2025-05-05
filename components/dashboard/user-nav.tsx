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
    // Tentar obter informações do usuário do cookie
    const getUserInfo = () => {
      try {
        const userInfoCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user-info="))
          ?.split("=")[1]

        if (userInfoCookie) {
          const decodedCookie = decodeURIComponent(userInfoCookie)
          const parsedInfo = JSON.parse(decodedCookie)
          setUserInfo({
            name: parsedInfo.name || "Usuário Demo",
            email: parsedInfo.email || "usuario@exemplo.com",
          })
        }
      } catch (error) {
        console.error("Erro ao obter informações do usuário:", error)
      }
    }

    getUserInfo()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/")
  }

  // Obter as iniciais do nome para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

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
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>Meus Eventos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/configuracoes")}>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
