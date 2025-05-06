import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo - Evento Fácil",
  description:
    "Demonstração de um evento no Evento Fácil - Veja como é fácil gerenciar todos os aspectos do seu evento em um só lugar",
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}