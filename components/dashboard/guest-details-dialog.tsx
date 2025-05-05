"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, HelpCircle, Mail, Phone, Calendar } from "lucide-react"
import type { GuestType } from "@/lib/types"
import { mockEvents } from "@/lib/mock-data"

interface GuestDetailsDialogProps {
  guest: GuestType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (guest: GuestType) => void
}

export function GuestDetailsDialog({ guest, open, onOpenChange, onSave }: GuestDetailsDialogProps) {
  const [editedGuest, setEditedGuest] = useState<GuestType | null>(guest)
  const [isEditing, setIsEditing] = useState(false)

  // Atualizar o estado quando o convidado mudar
  if (guest && (!editedGuest || guest.id !== editedGuest.id)) {
    setEditedGuest(guest)
    setIsEditing(false)
  }

  if (!editedGuest) return null

  const getEventName = (eventId: string) => {
    const event = mockEvents.find((e) => e.id === eventId)
    return event ? event.title : "Evento não encontrado"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmado</Badge>
      case "declined":
        return <Badge variant="destructive">Recusado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "declined":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <HelpCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const handleSave = () => {
    if (editedGuest) {
      onSave(editedGuest)
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Convidado</DialogTitle>
          <DialogDescription>Informações do convidado para {getEventName(editedGuest.eventId || "")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {!isEditing ? (
            // Modo visualização
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{editedGuest.name}</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(editedGuest.status)}
                  {getStatusBadge(editedGuest.status)}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{editedGuest.email}</span>
                </div>

                {editedGuest.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{editedGuest.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{getEventName(editedGuest.eventId || "")}</span>
                </div>
              </div>

              {editedGuest.message && (
                <div className="space-y-2">
                  <h4 className="font-medium">Mensagem do Convidado:</h4>
                  <div className="rounded-lg border p-3">
                    <p className="italic text-muted-foreground">{editedGuest.message}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Modo edição
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editedGuest.name}
                  onChange={(e) => setEditedGuest({ ...editedGuest, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedGuest.email}
                  onChange={(e) => setEditedGuest({ ...editedGuest, email: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editedGuest.phone || ""}
                  onChange={(e) => setEditedGuest({ ...editedGuest, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="grid gap-2">
                <Label>Status de Confirmação</Label>
                <RadioGroup
                  value={editedGuest.status}
                  onValueChange={(value) =>
                    setEditedGuest({ ...editedGuest, status: value as "pending" | "confirmed" | "declined" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confirmed" id="confirmed" />
                    <Label htmlFor="confirmed">Confirmado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="pending" />
                    <Label htmlFor="pending">Pendente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="declined" id="declined" />
                    <Label htmlFor="declined">Recusado</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={editedGuest.message || ""}
                  onChange={(e) => setEditedGuest({ ...editedGuest, message: e.target.value })}
                  placeholder="Mensagem do convidado"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
