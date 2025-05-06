"use client"

import React, { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvent } from "@/lib/event-actions"
import { EventEditForm } from "@/components/dashboard/event-edit-form"
import type { EventType } from "@/lib/types"

export default function EditEventPage({
  params,
}: {
  // Now a promise
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  // unwrap params
  const { id } = use(params)

  const [event, setEvent] = useState<EventType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEvent(id)
        setEvent(eventData)
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvent()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Carregando evento...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Evento não encontrado</h2>
        <p className="mb-4 text-muted-foreground">
          O evento que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Voltar para o Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Evento</h1>
          <p className="text-muted-foreground">
            Atualize as informações do seu evento
          </p>
        </div>
      </div>

      <EventEditForm event={event} />
    </div>
  )
}
