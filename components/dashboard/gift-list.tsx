"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle, ExternalLink, Trash2, Gift, Loader2 } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import { eventAPI } from "@/lib/api/event"
import type { GiftType, NewGiftRequest } from "@/lib/interface/event"

interface GiftListProps {
  eventId: string
}

export function GiftList({ eventId }: GiftListProps) {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [isAddingGift, setIsAddingGift] = useState(false)
  const [newGift, setNewGift] = useState<{
    name: string
    description?: string
    price: string
    url?: string
    quantity: number
    image?: string
    previewUrl?: string
  }>({
    name: "",
    price: "",
    quantity: 1,
    image: undefined,
    previewUrl: undefined
  })


  const [isLoading, setIsLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  // Fetch gift list on mount / eventId change
  useEffect(() => {
    setLoadingList(true)
    eventAPI
      .getEventGiftListById(eventId)
      .then((data) => {
        setGifts(data ?? [])
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro ao carregar lista de presentes",
          description: err.message || "Tente novamente mais tarde.",
        })
      )
      .finally(() => setLoadingList(false))
  }, [eventId])


  const resetForm = () => {
    setNewGift({
      name: "",
      description: "",
      price: "",
      url: "",
      quantity: 1,
      image: undefined,
      previewUrl: undefined,
    })
  }

  const handleAddGift = async () => {
    if (!newGift.name || !newGift.price) return

    setIsLoading(true)

    const payload: NewGiftRequest = {
      eventId,
      name: newGift.name,
      description: newGift.description,
      price: newGift.price,
      image: newGift.image,
      url: newGift.url,
      quantity: newGift.quantity,
    }

    try {
      const gift = await eventAPI.addGift(payload)
      setGifts((prev) => [...prev, gift])
      setNewGift({ name: "", price: "", quantity: 1 })
      setIsAddingGift(false)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar presente",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGift = async (giftId: string) => {
    setIsLoading(true)
    try {
      await eventAPI.removeGift(eventId, giftId)
      setGifts((prev) => prev.filter((g) => g.id !== giftId))
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover presente",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  if (loadingList) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando presentes...
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lista de Presentes</h2>
        <Dialog
          open={isAddingGift}
          onOpenChange={(open) => {
            setIsAddingGift(open)
            if (open) resetForm()      // limpa ao abrir
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Presente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Presente</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do presente que deseja adicionar à lista
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Presente</Label>
                <Input
                  id="name"
                  value={newGift.name ?? ""}
                  onChange={(e) =>
                    setNewGift({ ...newGift, name: e.target.value })
                  }
                  placeholder="Ex: Jogo de Panelas"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newGift.description ?? ""}
                  onChange={(e) =>
                    setNewGift({ ...newGift, description: e.target.value })
                  }
                  placeholder="Ex: Jogo de panelas antiaderente com 5 peças"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={newGift.price ?? ""}
                    onChange={(e) =>
                      setNewGift({ ...newGift, price: e.target.value })
                    }
                    placeholder="Ex: R$ 299,90"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newGift.quantity ?? 1}
                    onChange={(e) =>
                      setNewGift({
                        ...newGift,
                        quantity: Number(e.target.value) ?? 1,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Link para Compra</Label>
                <Input
                  id="url"
                  value={newGift.url ?? ""}
                  onChange={(e) =>
                    setNewGift({ ...newGift, url: e.target.value })
                  }
                  placeholder="Ex: https://loja.com/produto"
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const base64 = await toBase64(file)
                      setNewGift((g) => ({
                        ...g,
                        image: base64,
                        previewUrl: base64
                      }))
                    }
                  }}
                />
                {newGift.previewUrl && (
                  <div className="mt-2 flex flex-col items-center">
                    <div className="w-32 h-32 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                      <Image
                        src={newGift.previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="mt-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                      onClick={() =>
                        setNewGift((g) => ({
                          ...g,
                          image: undefined,
                          previewUrl: undefined,
                        }))
                      }
                    >
                      Limpar Imagem
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingGift(false)}
              >
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
                <Image
                  src={gift.image ?? "/placeholder.svg"}
                  alt={gift.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{gift.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {gift.description ?? ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between">
                  <div className="font-medium">{gift.price ?? ""}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantidade: {gift.quantity ?? 0}
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Escolhidos: {gift.reserved ?? 0} de {gift.quantity ?? 0}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={gift.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
