"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Gift, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockGifts } from "@/lib/mock-data"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"
import type { GiftType } from "@/lib/types"

export default function GiftsPage() {
  const [activeTab, setActiveTab] = useState("todos")
  const [sortOrder, setSortOrder] = useState("recentes")
  const [filteredGifts, setFilteredGifts] = useState<GiftType[]>(mockGifts)

  // Função para filtrar e ordenar presentes
  useEffect(() => {
    let result = [...mockGifts]

    // Aplicar filtro por status
    if (activeTab === "reservados") {
      result = result.filter((gift) => gift.reserved && gift.reserved > 0)
    } else if (activeTab === "disponiveis") {
      result = result.filter((gift) => !gift.reserved || gift.reserved === 0)
    }

    // Aplicar ordenação
    if (sortOrder === "recentes") {
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortOrder === "antigos") {
      result.sort((a, b) => a.id.localeCompare(b.id))
    } else if (sortOrder === "alfabetica") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "preco-alto") {
      result.sort(
        (a, b) =>
          Number.parseFloat(b.price.replace("R$ ", "").replace(",", ".")) -
          Number.parseFloat(a.price.replace("R$ ", "").replace(",", ".")),
      )
    } else if (sortOrder === "preco-baixo") {
      result.sort(
        (a, b) =>
          Number.parseFloat(a.price.replace("R$ ", "").replace(",", ".")) -
          Number.parseFloat(b.price.replace("R$ ", "").replace(",", ".")),
      )
    }

    setFilteredGifts(result)
  }, [activeTab, sortOrder])

  // Contagem de presentes por status
  const totalGifts = mockGifts.length
  const reservedGifts = mockGifts.filter((gift) => gift.reserved && gift.reserved > 0).length
  const availableGifts = mockGifts.filter((gift) => !gift.reserved || gift.reserved === 0).length

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lista de Presentes</h1>
          <p className="text-muted-foreground">Gerencie todos os presentes dos seus eventos.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/presentes/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Presente
          </Link>
        </Button>
      </div>

      {/* Anúncio no topo da página */}
      <DashboardAd slot="gifts-top" format="horizontal" />

      {/* Filtros e Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="todos">Todos ({totalGifts})</TabsTrigger>
            <TabsTrigger value="reservados">Reservados ({reservedGifts})</TabsTrigger>
            <TabsTrigger value="disponiveis">Disponíveis ({availableGifts})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
              <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              <SelectItem value="preco-alto">Maior preço</SelectItem>
              <SelectItem value="preco-baixo">Menor preço</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de presentes */}
      {filteredGifts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGifts.slice(0, 3).map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>

          {/* Anúncio no meio da lista */}
          <DashboardAd slot="gifts-middle" format="horizontal" />

          {filteredGifts.length > 3 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGifts.slice(3).map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}

          {/* Anúncio no final da página */}
          <DashboardAd slot="gifts-bottom" format="horizontal" />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Gift className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhum presente encontrado</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            {activeTab === "todos"
              ? "Você ainda não adicionou nenhum presente. Comece adicionando seu primeiro presente agora."
              : activeTab === "reservados"
                ? "Você não possui presentes reservados."
                : "Você não possui presentes disponíveis."}
          </p>
          <Button asChild>
            <Link href="/dashboard/presentes/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar meu primeiro presente
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

function GiftCard({ gift }: { gift: GiftType }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={gift.image || "/placeholder.svg"}
          alt={gift.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{gift.name}</CardTitle>
        <CardDescription className="line-clamp-2">{gift.description || "Sem descrição"}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between">
          <span className="font-medium">{gift.price}</span>
          <span className="text-sm text-muted-foreground">
            {gift.reserved ? `${gift.reserved}/${gift.quantity} reservados` : "0 reservados"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/presentes/${gift.id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
