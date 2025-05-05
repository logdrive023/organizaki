"use client"

import { useState } from "react"
import Image from "next/image"
import { PlusCircle, ExternalLink, Trash2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { mockGifts } from "@/lib/mock-data"
import type { GiftType } from "@/lib/types"
import { addGift, removeGift } from "@/lib/gift-actions"

interface GiftListProps {
  eventId: string
}

export function GiftList({ eventId }: GiftListProps) {
  const [gifts, setGifts] = useState<GiftType[]>(mockGifts)
  const [isAddingGift, setIsAddingGift] = useState(false)
  const [newGift, setNewGift] = useState<Partial<GiftType>>({
    name: "",
    description: "",
    price: "",
    image: "/colorful-gift-box.png",
    url: "",
    quantity: 1,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddGift = async () => {
    if (!newGift.name || !newGift.price) return

    setIsLoading(true)
    try {
      const gift = await addGift(eventId, newGift as GiftType)
      setGifts([...gifts, gift])
      setNewGift({
        name: "",
        description: "",
        price: "",
        image: "/colorful-gift-box.png",
        url: "",
        quantity: 1,
      })
      setIsAddingGift(false)
    } catch (error) {
      console.error("Erro ao adicionar presente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGift = async (giftId: string) => {
    try {
      await removeGift(eventId, giftId)
      setGifts(gifts.filter((gift) => gift.id !== giftId))
    } catch (error) {
      console.error("Erro ao remover presente:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lista de Presentes</h2>
        <Dialog open={isAddingGift} onOpenChange={setIsAddingGift}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Presente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Presente</DialogTitle>
              <DialogDescription>Preencha os detalhes do presente que deseja adicionar à lista</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Presente</Label>
                <Input
                  id="name"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  placeholder="Ex: Jogo de Panelas"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                  placeholder="Ex: Jogo de panelas antiaderente com 5 peças"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={newGift.price}
                    onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                    placeholder="Ex: R$ 299,90"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newGift.quantity}
                    onChange={(e) => setNewGift({ ...newGift, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Link para Compra</Label>
                <Input
                  id="url"
                  value={newGift.url}
                  onChange={(e) => setNewGift({ ...newGift, url: e.target.value })}
                  placeholder="Ex: https://loja.com/produto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Imagem (URL)</Label>
                <Input
                  id="image"
                  value={newGift.image}
                  onChange={(e) => setNewGift({ ...newGift, image: e.target.value })}
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGift(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGift} disabled={isLoading}>
                {isLoading ? "Adicionando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {gifts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id}>
              <div className="relative aspect-square overflow-hidden">
                <Image src={gift.image || "/placeholder.svg"} alt={gift.name} fill className="object-cover" />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{gift.name}</CardTitle>
                <CardDescription className="line-clamp-2">{gift.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between">
                  <div className="font-medium">{gift.price}</div>
                  <div className="text-sm text-muted-foreground">Quantidade: {gift.quantity}</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Escolhidos: {gift.reserved || 0} de {gift.quantity}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={gift.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Link
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleRemoveGift(gift.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Gift className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum presente na lista</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione presentes à sua lista para que seus convidados possam escolher
          </p>
          <Button className="mt-4" onClick={() => setIsAddingGift(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeiro Presente
          </Button>
        </div>
      )}
    </div>
  )
}
