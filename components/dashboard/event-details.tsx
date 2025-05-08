"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Edit2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { eventAPI } from "@/lib/api/event"
import type { EventType, UpdateEventRequest } from "@/lib/interface/event"


interface EventDetailsProps {
  eventId: string
}

export function EventDetails({ eventId }: EventDetailsProps) {
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)


  useEffect(() => {
    setLoading(true)
    eventAPI
      .getEventDetailsById(eventId)
      .then((data) => setEvent(data))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro ao carregar detalhes",
          description: err.message || "Tente novamente mais tarde.",
        })
      )
      .finally(() => setLoading(false))
  }, [eventId])


  const handleSave = async () => {
    if (!event) return
    setIsSaving(true)

    
    const payload: UpdateEventRequest = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      coverImage: event.coverImage,
    }

    try {
      const updated = await eventAPI.update(payload)
      setEvent(updated)
      setIsEditing(false)
      toast({ title: "Evento atualizado com sucesso!" })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar evento",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando detalhes do evento...
      </Card>
    )
  }

  if (!event) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold">Evento não encontrado</h2>
        <p className="text-muted-foreground">Verifique o ID e tente novamente.</p>
      </Card>
    )
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      )}
    </div>
  )
}
