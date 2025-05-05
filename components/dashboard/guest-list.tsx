"use client"

import { useState } from "react"
import { PlusCircle, Mail, Copy, CheckCircle, XCircle, HelpCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockGuests } from "@/lib/mock-data"
import type { GuestType } from "@/lib/types"
import { addGuest, removeGuest, sendInvites } from "@/lib/guest-actions"

interface GuestListProps {
  eventId: string
}

export function GuestList({ eventId }: GuestListProps) {
  const [guests, setGuests] = useState<GuestType[]>(mockGuests)
  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [isSendingInvites, setIsSendingInvites] = useState(false)
  const [newGuest, setNewGuest] = useState<Partial<GuestType>>({
    name: "",
    email: "",
    phone: "",
    status: "pending",
  })
  const [bulkEmails, setBulkEmails] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.email) return

    setIsLoading(true)
    try {
      const guest = await addGuest(eventId, newGuest as GuestType)
      setGuests([...guests, guest])
      setNewGuest({
        name: "",
        email: "",
        phone: "",
        status: "pending",
      })
      setIsAddingGuest(false)
    } catch (error) {
      console.error("Erro ao adicionar convidado:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGuest = async (guestId: string) => {
    try {
      await removeGuest(eventId, guestId)
      setGuests(guests.filter((guest) => guest.id !== guestId))
    } catch (error) {
      console.error("Erro ao remover convidado:", error)
    }
  }

  const handleSendInvites = async () => {
    setIsLoading(true)
    try {
      await sendInvites(
        eventId,
        guests.filter((g) => g.status === "pending").map((g) => g.id),
      )
      setIsSendingInvites(false)
      // Em uma aplicação real, atualizaríamos o status dos convidados
    } catch (error) {
      console.error("Erro ao enviar convites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkEmails) return

    setIsLoading(true)
    try {
      const entries = bulkEmails
        .split(/[\n,;]/)
        .map((e) => e.trim())
        .filter(Boolean)
      const newGuests = []

      for (const entry of entries) {
        // Verifica se a entrada contém informações separadas por vírgula
        const parts = entry.split(",").map((part) => part.trim())

        let name, email, phone

        if (parts.length >= 2) {
          // Formato: Nome, Email, Telefone (opcional)
          name = parts[0]
          email = parts[1]
          phone = parts[2] || "" // Telefone é opcional
        } else {
          // Apenas email foi fornecido
          name = entry.split("@")[0] // Nome básico a partir do email
          email = entry
          phone = ""
        }

        const guest = await addGuest(eventId, {
          name,
          email,
          phone,
          status: "pending",
        })

        newGuests.push(guest)
      }

      setGuests([...guests, ...newGuests])
      setBulkEmails("")
      setIsAddingGuest(false)
    } catch (error) {
      console.error("Erro ao adicionar convidados em massa:", error)
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lista de Convidados</h2>
        <div className="flex gap-2">
          <Dialog open={isSendingInvites} onOpenChange={setIsSendingInvites}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Enviar Convites
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Convites</DialogTitle>
                <DialogDescription>Envie convites para todos os convidados pendentes</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>
                  Você está prestes a enviar convites para{" "}
                  <strong>{guests.filter((g) => g.status === "pending").length}</strong> convidados pendentes.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cada convidado receberá um e-mail com um link único para confirmar presença.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSendingInvites(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendInvites} disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Convites"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Convidado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Convidado</DialogTitle>
                <DialogDescription>Adicione um novo convidado à sua lista</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    placeholder="Ex: joao@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    placeholder="Ex: (11) 98765-4321"
                  />
                </div>
                <div className="mt-4">
                  <Label>Adicionar Vários Convidados</Label>
                  <Textarea
                    className="mt-2"
                    placeholder="Adicione vários e-mails separados por vírgula, ponto e vírgula ou quebra de linha"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Formato: Nome, E-mail, Telefone (opcional)</p>
                  <p className="text-xs text-muted-foreground">Ex: João Silva, joao@exemplo.com, (11) 98765-4321</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingGuest(false)}>
                  Cancelar
                </Button>
                {bulkEmails ? (
                  <Button onClick={handleBulkAdd} disabled={isLoading}>
                    {isLoading ? "Adicionando..." : "Adicionar em Massa"}
                  </Button>
                ) : (
                  <Button onClick={handleAddGuest} disabled={isLoading || !newGuest.name || !newGuest.email}>
                    {isLoading ? "Adicionando..." : "Adicionar"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link de Convite</CardTitle>
          <CardDescription>Compartilhe este link para que as pessoas possam confirmar presença</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border p-3 text-sm">
              {`${window.location.origin}/evento/${eventId}?convite=true`}
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/evento/${eventId}?convite=true`)
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {guests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Convidados ({guests.length})</CardTitle>
            <CardDescription>Lista de todos os convidados e status de confirmação</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(guest.status)}
                        {getStatusBadge(guest.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemoveGuest(guest.id)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum convidado na lista</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione convidados à sua lista para enviar convites e acompanhar confirmações
          </p>
          <Button className="mt-4" onClick={() => setIsAddingGuest(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeiro Convidado
          </Button>
        </div>
      )}
    </div>
  )
}
