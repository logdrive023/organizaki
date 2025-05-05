"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { EventType } from "@/lib/types"
import { updateEvent } from "@/lib/event-actions"

interface EventDetailsProps {
  event: EventType
}

export function EventDetails({ event }: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Em uma aplicação real, salvaríamos as alterações no banco de dados
      await updateEvent(event.id, event)
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar evento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Detalhes do Evento</h2>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border">
        <Image src={event.coverImage || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Detalhes principais do seu evento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Título</div>
            <div className="rounded-md border p-3">{event.title}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium">Descrição</div>
            <div className="rounded-md border p-3 whitespace-pre-wrap">{event.description}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data e Local</CardTitle>
          <CardDescription>Quando e onde o evento acontecerá</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Data</div>
                <div>{event.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Horário</div>
                <div>{event.time}</div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Local</div>
              <div>{event.location}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link do Evento</CardTitle>
          <CardDescription>Compartilhe este link com seus convidados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border p-3 text-sm">{`${window.location.origin}/evento/${event.id}`}</div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/evento/${event.id}`)
              }}
            >
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      )}
    </div>
  )
}
