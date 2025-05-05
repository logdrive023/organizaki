"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, Info, Sparkles, Award, LogIn, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Função para implementar o scroll suave apenas na página inicial
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Previne o comportamento padrão do link
    e.preventDefault()

    // Verifica se estamos na página inicial
    if (pathname === "/") {
      // Se estamos na página inicial, rolamos suavemente para a seção
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    } else {
      // Se não estamos na página inicial, redirecionamos para a página inicial com o hash
      window.location.href = `/#${id}`
    }
  }

  // Efeito para lidar com links de hash na URL quando a página carrega
  useEffect(() => {
    // Verifica se há um hash na URL e se estamos na página inicial
    if (window.location.hash && pathname === "/") {
      // Remove o # do hash
      const id = window.location.hash.substring(1)

      // Pequeno timeout para garantir que a página esteja totalmente carregada
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100)
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?key=v70a2"
              alt="Organizaki Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="text-primary">Organizaki</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <a
            href="/#como-funciona"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => handleSmoothScroll(e, "como-funciona")}
          >
            Como Funciona
          </a>
          <a
            href="/#funcionalidades"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => handleSmoothScroll(e, "funcionalidades")}
          >
            Funcionalidades
          </a>
          <a
            href="/#beneficios"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => handleSmoothScroll(e, "beneficios")}
          >
            Benefícios
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              // Previne comportamento padrão se necessário
              if (window.location.pathname === "/login") {
                e.preventDefault()
              }
            }}
          >
            Entrar
          </Link>
          <Button asChild>
            <Link href="/register">Criar Evento</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-10">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-left flex items-center gap-2">
                <Image
                  src="/placeholder.svg?key=v70a2"
                  alt="Organizaki Logo"
                  width={30}
                  height={30}
                  className="rounded-md"
                />
                <span>Organizaki</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Home className="h-5 w-5 text-primary" />
                  <span>Página Inicial</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/#como-funciona"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(false)
                    setTimeout(() => {
                      window.location.href = "/#como-funciona"
                    }, 100)
                  }}
                >
                  <Info className="h-5 w-5 text-primary" />
                  <span>Como Funciona</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/#funcionalidades"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(false)
                    setTimeout(() => {
                      window.location.href = "/#funcionalidades"
                    }, 100)
                  }}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Funcionalidades</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/#beneficios"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(false)
                    setTimeout(() => {
                      window.location.href = "/#beneficios"
                    }, 100)
                  }}
                >
                  <Award className="h-5 w-5 text-primary" />
                  <span>Benefícios</span>
                </Link>
              </SheetClose>

              <div className="h-px bg-border my-2"></div>

              <SheetClose asChild>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                >
                  <LogIn className="h-5 w-5 text-primary" />
                  <span>Entrar</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/register"
                  className="flex items-center gap-3 px-4 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <CalendarPlus className="h-5 w-5" />
                  <span>Criar Evento</span>
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
