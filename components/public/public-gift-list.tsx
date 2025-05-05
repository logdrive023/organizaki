"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockGifts } from "@/lib/mock-data"
import type { GiftType } from "@/lib/types"
import { reserveGift, confirmGiftPurchase } from "@/lib/gift-actions"

interface PublicGiftListProps {
  eventId: string
}

export function PublicGiftList({ eventId }: PublicGiftListProps) {
  const [gifts, setGifts] = useState<GiftType[]>(mockGifts)
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null)
  const [isReserving, setIsReserving] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")

  const handleReserveGift = async () => {
    if (!selectedGift || !guestName || !guestEmail) return

    setIsLoading(true)
    try {
      await reserveGift(eventId, selectedGift.id, { name: guestName, email: guestEmail })

      // Atualiza o estado local
      setGifts(
        gifts.map((gift) =>
          gift.id === selectedGift.id ? { ...gift, reserved: (gift.reserved || 0) + 1, isReservedByMe: true } : gift,
        ),
      )

      setIsReserving(false)
      setSelectedGift(null)
    } catch (error) {
      console.error("Erro ao reservar presente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmPurchase = async () => {
    if (!selectedGift) return

    setIsLoading(true)
    try {
      await confirmGiftPurchase(eventId, selectedGift.id)

      // Atualiza o estado local
      setGifts(gifts.map((gift) => (gift.id === selectedGift.id ? { ...gift, isPurchased: true } : gift)))

      setIsConfirming(false)
      setSelectedGift(null)
    } catch (error) {
      console.error("Erro ao confirmar compra:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lista de Presentes</h2>
        <p className="text-muted-foreground">Escolha um presente para presentear os anfitriões</p>
      </div>

      {gifts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className={gift.isPurchased ? "opacity-60" : ""}>
              <div className="relative aspect-square overflow-hidden">
                <Image src={gift.image || "/placeholder.svg"} alt={gift.name} fill className="object-cover" />
                {gift.isPurchased && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="rounded-full bg-green-500 p-2">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{gift.name}</CardTitle>
                <CardDescription className="line-clamp-2">{gift.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between">
                  <div className="font-medium">{gift.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {gift.reserved || 0} de {gift.quantity} escolhidos
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={gift.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Produto
                  </a>
                </Button>
                {gift.isPurchased ? (
                  <Button variant="ghost" size="sm" disabled>
                    Já comprado
                  </Button>
                ) : gift.isReservedByMe ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedGift(gift)
                      setIsConfirming(true)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Confirmar Compra
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={gift.reserved === gift.quantity}
                    onClick={() => {
                      setSelectedGift(gift)
                      setIsReserving(true)
                    }}
                  >
                    Escolher
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">Nenhum presente na lista</h3>
          <p className="mt-2 text-sm text-muted-foreground">Os anfitriões ainda não adicionaram presentes à lista</p>
        </div>
      )}

      {/* Diálogo para reservar presente */}
      <Dialog open={isReserving} onOpenChange={setIsReserving}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolher Presente</DialogTitle>
            <DialogDescription>Preencha seus dados para reservar este presente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md">
                <Image src={selectedGift?.image || ""} alt={selectedGift?.name || ""} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{selectedGift?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedGift?.price}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Seu Nome
              </label>
              <input
                id="name"
                className="rounded-md border p-2"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Seu E-mail
              </label>
              <input
                id="email"
                type="email"
                className="rounded-md border p-2"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReserving(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReserveGift} disabled={isLoading || !guestName || !guestEmail}>
              {isLoading ? "Reservando..." : "Reservar Presente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar compra */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>Confirme que você já comprou este presente</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-md">
              <Image src={selectedGift?.image || ""} alt={selectedGift?.name || ""} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-medium">{selectedGift?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedGift?.price}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ao confirmar, você está indicando que já comprou este presente. Isso ajudará os anfitriões a acompanhar os
            presentes recebidos.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirming(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmPurchase} disabled={isLoading}>
              {isLoading ? "Confirmando..." : "Confirmar Compra"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
