import type { Metadata } from "next"
import DemoEventPageClient from "./DemoEventPageClient"

export const metadata: Metadata = {
  title: "Demo - Evento Fácil",
  description:
    "Demonstração de um evento no Evento Fácil - Veja como é fácil gerenciar todos os aspectos do seu evento em um só lugar",
}

export default function DemoEventPage() {
  return <DemoEventPageClient />
}
