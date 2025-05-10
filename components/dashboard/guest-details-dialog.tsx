"use client"

import { useState, useEffect } from "react"
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
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import {
  eventAPI,
} from "@/lib/api/event"
import {
  type EventType,
  type UpdateGuestRequest,
} from "@/lib/interface/event"
import type { GuestType } from "@/lib/types"

interface GuestDetailsDialogProps {
  guest: GuestType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updated: GuestType) => void
}

export function GuestDetailsDialog({
  guest,
  open,
  onOpenChange,
  onSave,
}: GuestDetailsDialogProps) {
  const { toast } = useToast()

  const [editedGuest, setEditedGuest] = useState<GuestType | null>(guest)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // lista de eventos para lookup do nome
  const [events, setEvents] = useState<EventType[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // quando receber um novo guest, resetar edição
  useEffect(() => {
    if (guest) {
      setEditedGuest(guest)
      setIsEditing(false)
    }
  }, [guest])

  // buscar eventos
  useEffect(() => {
    eventAPI
      .list()
      .then(setEvents)
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Falha ao carregar eventos",
          description: err.message || "Tente novamente.",
        }),
      )
      .finally(() => setLoadingEvents(false))
  }, [toast])

  if (!editedGuest) return null

  const getEventName = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId)
    return ev ? ev.title : loadingEvents ? <Loader2 className="h-4 w-4 animate-spin" /> : "—"
  }

  const getStatusBadge = (status: string) => {
    if (status === "confirmed") return <Badge className="bg-green-500">Confirmado</Badge>
    if (status === "declined") return <Badge variant="destructive">Recusado</Badge>
    return <Badge variant="outline">Pendente</Badge>
  }

  const getStatusIcon = (status: string) => {
    if (status === "confirmed") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "declined") return <XCircle className="h-5 w-5 text-destructive" />
    return <HelpCircle className="h-5 w-5 text-muted-foreground" />
  }

  // salvar via API
  const handleSave = async () => {
    if (!editedGuest) return;

    // 1) Garante que o eventId exista
    if (!editedGuest.eventId) {
      toast({
        variant: "destructive",
        title: "Erro interno",
        description: "Este convidado não está associado a nenhum evento.",
      });
      return;
    }

    setIsSaving(true);
    
    const req: UpdateGuestRequest = {
      eventId: editedGuest.eventId, 
      id:      editedGuest.id,
      name:    editedGuest.name,
      email:   editedGuest.email,
      phone:   editedGuest.phone,
      message: editedGuest.message,
      status:  editedGuest.status,
    }

    try {
      const updated = await eventAPI.updateGuest(req)
      onSave(updated)
      toast({
        title: "Convidado atualizado",
        description: `${updated.name} teve os dados salvos com sucesso.`,
      })
      setIsEditing(false)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Falha ao salvar",
        description: err.message || "Tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Convidado</DialogTitle>
          <DialogDescription>
            Informações de{" "}
            {getEventName(editedGuest.eventId || "")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {!isEditing ? (
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
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{getEventName(editedGuest.eventId || "")}</span>
                </div>
              </div>

              {editedGuest.message && (
                <div className="space-y-2">
                  <h4 className="font-medium">Mensagem:</h4>
                  <div className="rounded-lg border p-3">
                    <p className="italic text-muted-foreground">
                      {editedGuest.message}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editedGuest.name}
                  onChange={(e) =>
                    setEditedGuest({ ...editedGuest, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedGuest.email}
                  onChange={(e) =>
                    setEditedGuest({ ...editedGuest, email: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editedGuest.phone || ""}
                  onChange={(e) =>
                    setEditedGuest({ ...editedGuest, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="grid gap-2">
                <Label>Status de Confirmação</Label>
                <RadioGroup
                  value={editedGuest.status}
                  onValueChange={(v) =>
                    setEditedGuest({ ...editedGuest, status: v as GuestType["status"] })
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
                  onChange={(e) =>
                    setEditedGuest({ ...editedGuest, message: e.target.value })
                  }
                  placeholder="Mensagem personalizada"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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
