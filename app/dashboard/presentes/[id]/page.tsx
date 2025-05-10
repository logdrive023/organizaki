"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Trash2, ExternalLink, Gift, ShoppingCart, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockGifts } from "@/lib/mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { GiftType } from "@/lib/types"

export default function GiftDetailPage({ params }: { params: { id: string } }) {
  const [gift, setGift] = useState<GiftType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(gift?.quantity || 1)

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return

    // Simulando atualização da quantidade
    setQuantity(newQuantity)
    setGift((prev) => (prev ? { ...prev, quantity: newQuantity } : null))

    toast({
      title: "Quantidade atualizada",
      description: `A quantidade foi atualizada para ${newQuantity}.`,
    })
  }

  useEffect(() => {
    // Simulando busca do presente pelo ID
    const fetchGift = () => {
      setIsLoading(true)
      setTimeout(() => {
        const foundGift = mockGifts.find((g) => g.id === params.id)
        setGift(foundGift || null)
        setIsLoading(false)
      }, 500)
    }

    fetchGift()
  }, [params.id])

  const handleDelete = () => {
    // Simulando exclusão do presente
    toast({
      title: "Presente excluído",
      description: "O presente foi removido com sucesso da sua lista.",
    })
    // Redirecionaria para a lista de presentes em uma implementação real
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Presente: ${gift.name}`,
          text: `Confira este presente: ${gift.name} - ${gift.price}`,
          url: window.location.href,
        })
        toast({
          title: "Compartilhado com sucesso!",
          description: "O presente foi compartilhado.",
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
        // Fallback para copiar link se o compartilhamento for cancelado
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copiado!",
          description: "O link do presente foi copiado para a área de transferência.",
        })
      }
    } else {
      // Fallback para navegadores que não suportam a Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado!",
        description: "O link do presente foi copiado para a área de transferência.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/presentes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-7 w-48 animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-lg bg-muted"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted"></div>
            <div className="h-20 animate-pulse rounded-md bg-muted"></div>
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 animate-pulse rounded-md bg-muted"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!gift) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Gift className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold">Presente não encontrado</h2>
        <p className="mt-2 text-muted-foreground">O presente que você está procurando não existe ou foi removido.</p>
        <Button className="mt-6" asChild>
          <Link href="/dashboard/presentes">Voltar para lista de presentes</Link>
        </Button>
      </div>
    )
  }

  // Calcular progresso de reservas
  const reservedPercentage = gift.reserved ? (gift.reserved / gift.quantity) * 100 : 0

  // Simular lista de pessoas que reservaram
  const mockReservers = [
    { id: "1", name: "Ana Silva", avatar: "/woman-portrait.png", date: "12/05/2023" },
    { id: "2", name: "Carlos Mendes", avatar: "/thoughtful-man-portrait.png", date: "15/05/2023" },
  ]

  return (
    <div className="space-y-6">
      {/* Cabeçalho com navegação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/presentes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalhes do Presente</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso removerá permanentemente o presente "{gift.name}" da sua lista.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Excluir presente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Imagem do presente */}
        <Card className="overflow-hidden">
          <div className="relative aspect-square w-full">
            <Image
              src={gift.image || "/placeholder.svg"}
              alt={gift.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Card>

        {/* Informações do presente */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{gift.name}</CardTitle>
                  {gift.eventId && (
                    <CardDescription>
                      Evento:{" "}
                      <Link href={`/dashboard/eventos/${gift.eventId}`} className="hover:underline">
                        Casamento
                      </Link>
                    </CardDescription>
                  )}
                </div>
                <Badge
                  variant={
                    gift.reserved && gift.reserved >= gift.quantity
                      ? "destructive"
                      : gift.reserved
                        ? "default"
                        : "outline"
                  }
                >
                  {gift.reserved && gift.reserved >= gift.quantity
                    ? "Totalmente Reservado"
                    : gift.reserved
                      ? "Parcialmente Reservado"
                      : "Disponível"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {gift.description && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Descrição</h3>
                  <p>{gift.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Preço</h3>
                  <p className="text-xl font-semibold">{gift.price}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Quantidade</h3>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <span className="sr-only">Diminuir</span>
                      <span className="text-lg">-</span>
                    </Button>
                    <div className="flex h-8 w-12 items-center justify-center border-y bg-background text-center text-sm">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      <span className="sr-only">Aumentar</span>
                      <span className="text-lg">+</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Status de Reservas</h3>
                  <span className="text-sm">
                    {gift.reserved || 0} de {gift.quantity}
                  </span>
                </div>
                <Progress value={reservedPercentage} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" asChild>
                <a href={gift.url} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar Presente
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={gift.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver na Loja
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Abas com informações adicionais */}
          <Tabs defaultValue="reservas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reservas">Reservas</TabsTrigger>
              <TabsTrigger value="valor">Valor</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="reservas" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pessoas que reservaram</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockReservers.length > 0 ? (
                    <div className="space-y-4">
                      {mockReservers.map((reserver) => (
                        <div key={reserver.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={reserver.avatar || "/placeholder.svg"} alt={reserver.name} />
                              <AvatarFallback>{reserver.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{reserver.name}</p>
                              <p className="text-sm text-muted-foreground">Reservado em {reserver.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Users className="mr-2 h-4 w-4" />
                            Detalhes
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Users className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 font-medium">Nenhuma reserva ainda</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Este presente ainda não foi reservado por nenhum convidado.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="valor" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resumo de Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Quantidade Total</p>
                        <p className="text-xl font-semibold">{gift.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valor Unitário</p>
                        <p className="text-xl font-semibold">{gift.price}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pessoas que Reservaram</p>
                        <p className="text-xl font-semibold">{gift.reserved || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Restam</p>
                        <p className="text-xl font-semibold">{gift.quantity - (gift.reserved || 0)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold">
                        {(() => {
                          // Extrair o valor numérico do preço
                          let unitPrice = 0
                          if (typeof gift.price === "string") {
                            // Remove o símbolo R$ e espaços, substitui vírgula por ponto para cálculo
                            unitPrice = Number.parseFloat(
                              gift.price
                                .replace(/R\$\s?/, "")
                                .replace(".", "")
                                .replace(",", "."),
                            )
                          } else {
                            unitPrice = gift.price
                          }

                          // Calcular o valor total
                          const totalValue = unitPrice * gift.quantity

                          // Formatar o valor total para exibição (com R$ e vírgula como separador decimal)
                          const formattedTotal = totalValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })

                          return `${gift.price} × ${gift.quantity} = ${formattedTotal}`
                        })()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="historico" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Histórico de Alterações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Gift className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Presente adicionado</p>
                        <p className="text-sm text-muted-foreground">10/05/2023 às 14:32</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Edit className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Preço atualizado</p>
                        <p className="text-sm text-muted-foreground">12/05/2023 às 09:15</p>
                        <p className="mt-1 text-sm">
                          <span className="text-muted-foreground">De:</span> R$ 249,90
                          <span className="mx-2 text-muted-foreground">Para:</span> {gift.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
