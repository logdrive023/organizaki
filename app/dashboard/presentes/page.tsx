import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search } from "lucide-react"
import { mockGifts } from "@/lib/mock-data"

// Função auxiliar para formatar preço corretamente
const formatPrice = (price: string | number): string => {
  if (typeof price === "string") {
    // Remove caracteres não numéricos, exceto ponto decimal
    const numericPrice = price.replace(/[^0-9,.]/g, "")

    // Substitui vírgula por ponto para garantir conversão correta
    const normalizedPrice = numericPrice.replace(",", ".")

    // Tenta converter para número
    const priceNumber = Number.parseFloat(normalizedPrice)

    // Verifica se é um número válido
    if (!isNaN(priceNumber)) {
      return priceNumber.toFixed(2).replace(".", ",")
    }

    // Se não conseguir converter, retorna o valor original formatado
    return numericPrice || "0,00"
  }

  // Se já for número, apenas formata
  return price.toFixed(2).replace(".", ",")
}

export default function PresentesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Listas de Presentes</h1>
        <Link href="/dashboard/presentes/novo">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Adicionar Presente
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar presentes..." className="w-full pl-8" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todos os eventos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                <SelectItem value="wedding">Casamento</SelectItem>
                <SelectItem value="baby">Chá de Bebê</SelectItem>
                <SelectItem value="birthday">Aniversário</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Mais recentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full max-w-md">
            <TabsTrigger value="all" className="flex-1">
              Todos ({mockGifts.length})
            </TabsTrigger>
            <TabsTrigger value="reserved" className="flex-1">
              Reservados (3)
            </TabsTrigger>
            <TabsTrigger value="available" className="flex-1">
              Disponíveis (4)
            </TabsTrigger>
            <TabsTrigger value="sold-out" className="flex-1">
              Esgotados (2)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockGifts.map((gift) => (
                <div key={gift.id} className="overflow-hidden rounded-lg border bg-card">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={gift.image || "/placeholder.svg"}
                      alt={gift.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                    {gift.quantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                        Esgotado
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium line-clamp-1">{gift.name}</h3>
                        <p className="text-sm text-muted-foreground">{gift.event}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ {formatPrice(gift.price)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <p>Quantidade: {gift.quantity}</p>
                      <p>Reservados: {gift.reserved}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="outline" className="flex-1">
                        Ver Produto
                      </Button>
                      <Button className="flex-1">Editar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reserved" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockGifts
                .filter((gift) => gift.reserved > 0)
                .map((gift) => (
                  <div key={gift.id} className="overflow-hidden rounded-lg border bg-card">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={gift.image || "/placeholder.svg"}
                        alt={gift.name}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{gift.name}</h3>
                          <p className="text-sm text-muted-foreground">{gift.event}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ {formatPrice(gift.price)}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <p>Quantidade: {gift.quantity}</p>
                        <p>Reservados: {gift.reserved}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" className="flex-1">
                          Ver Produto
                        </Button>
                        <Button className="flex-1">Editar</Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockGifts
                .filter((gift) => gift.quantity > gift.reserved)
                .map((gift) => (
                  <div key={gift.id} className="overflow-hidden rounded-lg border bg-card">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={gift.image || "/placeholder.svg"}
                        alt={gift.name}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{gift.name}</h3>
                          <p className="text-sm text-muted-foreground">{gift.event}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ {formatPrice(gift.price)}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <p>Quantidade: {gift.quantity}</p>
                        <p>Reservados: {gift.reserved}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" className="flex-1">
                          Ver Produto
                        </Button>
                        <Button className="flex-1">Editar</Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="sold-out" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockGifts
                .filter((gift) => gift.quantity === 0)
                .map((gift) => (
                  <div key={gift.id} className="overflow-hidden rounded-lg border bg-card">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={gift.image || "/placeholder.svg"}
                        alt={gift.name}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                        Esgotado
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{gift.name}</h3>
                          <p className="text-sm text-muted-foreground">{gift.event}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R$ {formatPrice(gift.price)}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <p>Quantidade: {gift.quantity}</p>
                        <p>Reservados: {gift.reserved}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" className="flex-1">
                          Ver Produto
                        </Button>
                        <Button className="flex-1">Editar</Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
