"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  PlusCircle,
  ExternalLink,
  Trash2,
  Gift,
  Loader2,
  Mail,
  Copy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { toast } from "@/components/ui/use-toast"
import { eventAPI } from "@/lib/api/event"
import type { GuestType, NewGuestRequest } from "@/lib/interface/event"

interface GuestListProps {
  eventId: string
}

export function GuestList({ eventId }: GuestListProps) {
  const [guests, setGuests] = useState<GuestType[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [bulkEmails, setBulkEmails] = useState("")
  const [newGuest, setNewGuest] = useState<Partial<GuestType>>({
    name: "",
    email: "",
    phone: "",
    status: "pending",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingInvites, setIsSendingInvites] = useState(false)

  useEffect(() => {
    setLoadingList(true)
    eventAPI
      .getEventGuestListById(eventId)
      .then((data) => {
        setGuests(data ?? [])
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro ao carregar convidados",
          description: err.message || "Tente novamente mais tarde.",
        })
      )
      .finally(() => setLoadingList(false))
  }, [eventId])

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.email) return
    setIsLoading(true)

    const payload: NewGuestRequest = {
      eventId,                // vindo da prop
      name: newGuest.name!,
      email: newGuest.email!,
      phone: newGuest.phone,
      status: "pending",      // valor fixo ou de estado
    }

    try {
      const guest = await eventAPI.addGuest(payload)
      setGuests((prev) => [...prev, guest])
      setNewGuest({ name: "", email: "", phone: "", status: "pending" })
      setIsAddingGuest(false)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar convidado",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGuest = async (guestId: string) => {
    setIsLoading(true)
    try {
      await eventAPI.removeGuest(eventId, guestId)
      setGuests((prev) => prev.filter((g) => g.id !== guestId))
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover convidado",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendInvites = async () => {
    setIsLoading(true)
    try {
      const pendingIds = guests.filter((g) => g.status === "pending").map((g) => g.id)
      await eventAPI.sendInvites(eventId, pendingIds)
      setIsSendingInvites(false)
      toast({ title: "Convites enviados com sucesso!" })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar convites",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkEmails) return
    setIsLoading(true)
    try {
      const entries = bulkEmails
        .split(/[\n,;]+/)
        .map((e) => e.trim())
        .filter(Boolean)
      const newGuests: GuestType[] = []
      for (const entry of entries) {
        const parts = entry.split(",").map((p) => p.trim())
        const name = parts.length > 1 ? parts[0] : entry.split("@")[0]
        const email = parts.length > 1 ? parts[1] : entry
        const phone = parts[2] || ""
        const payload: NewGuestRequest = {
          eventId,
          name,
          email,
          phone,
          status: "pending",
        }
        const guest = await eventAPI.addGuest(payload)
        newGuests.push(guest)
      }
      setGuests((prev) => [...prev, ...newGuests])
      setBulkEmails("")
      setIsAddingGuest(false)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar convidados em massa",
        description: err.message || "Tente novamente mais tarde.",
      })
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

  if (loadingList) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando convidados...
      </Card>
    )
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
                <DialogDescription>
                  Você está prestes a enviar convites para{" "}
                  <strong>{guests.filter((g) => g.status === "pending").length}</strong> convidados
                  pendentes.
                </DialogDescription>
              </DialogHeader>
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
                    value={newGuest.name ?? ""}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newGuest.email ?? ""}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newGuest.phone ?? ""}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  />
                </div>
                <div className="mt-4">
                  <Label>Adicionar Vários Convidados</Label>
                  <Textarea
                    className="mt-2"
                    placeholder="E-mails separados por vírgula, ponto e vírgula ou quebra de linha"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Exemplo: João Silva, joao@exemplo.com, (11) 98765-4321; Maria Souza, maria@exemplo.com, (21) 91234-5678
                  </p>
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
                  <Button onClick={handleAddGuest} disabled={isLoading}>
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
          <CardDescription>
            Compartilhe este link para que as pessoas possam confirmar presença
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border p-3 text-sm break-all">
              {guests[0]?.inviteUrl ?? ""}
            </div>
            <Button
              onClick={() => {
                const url = guests[0]?.inviteUrl ?? ""
                navigator.clipboard.writeText(url)
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
            <CardDescription>Lista de todos os convidados e seus status</CardDescription>
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
                    <TableCell>{guest.phone ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(guest.status ?? "")}
                        {getStatusBadge(guest.status ?? "")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRemoveGuest(guest.id)}>
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
            Adicione convidados para enviar convites e gerenciar confirmações
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
