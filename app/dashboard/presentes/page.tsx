"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Gift, Filter, Loader2 } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { presentAPI } from "@/lib/api/present"
import type { GiftType } from "@/lib/interface/present"


import { mockGifts } from "@/lib/mock-data"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"

export default function GiftsPage() {
  // Descomentar  o mock para testar
  const [filteredGifts, setFilteredGifts] = useState<GiftType[]>(mockGifts)
  //const [filteredGifts, setFilteredGifts] = useState<GiftType[]>([])

  // Parei nessa pagina
  const [allGifts, setAllGifts] = useState<GiftType[]>([])
  const [activeTab, setActiveTab] = useState<"todos" | "reservados" | "disponiveis">(
    "todos"
  )
  const [sortOrder, setSortOrder] = useState<
    "recentes" | "antigos" | "alfabetica" | "preco-alto" | "preco-baixo"
  >("recentes")
  const [loading, setLoading] = useState<boolean>(true)

  // 1) Fetch inicial
  useEffect(() => {
    setLoading(true)
    presentAPI
      .list()
      .then((gifts) => {
        setAllGifts(gifts)
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar presentes",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  // 2) Filtrar + ordenar sempre que mudar allGifts, activeTab ou sortOrder
  useEffect(() => {
    let result = [...allGifts]

    if (activeTab === "reservados") {
      result = result.filter((g) => (g.reserved ?? 0) > 0)
    } else if (activeTab === "disponiveis") {
      result = result.filter((g) => !(g.reserved ?? 0))
    }

    switch (sortOrder) {
      case "recentes":
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case "antigos":
        result.sort((a, b) => a.id.localeCompare(b.id))
        break
      case "alfabetica":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "preco-alto":
        result.sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", ".")) -
            parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", "."))
        )
        break
      case "preco-baixo":
        result.sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", ".")) -
            parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", "."))
        )
        break
    }

    setFilteredGifts(result)
  }, [allGifts, activeTab, sortOrder])

  const totalGifts = allGifts.length
  const reservedGifts = allGifts.filter((g) => (g.reserved ?? 0) > 0).length
  const availableGifts = totalGifts - reservedGifts

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
        Carregando presentes...
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lista de Presentes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os presentes dos seus eventos.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/presentes/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Presente
          </Link>
        </Button>
      </div>

      <DashboardAd slot="gifts-top" format="horizontal" />

      {/* Filtros e Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "todos" | "reservados" | "disponiveis")
          }
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="todos">Todos ({totalGifts})</TabsTrigger>
            <TabsTrigger value="reservados">
              Reservados ({reservedGifts})
            </TabsTrigger>
            <TabsTrigger value="disponiveis">
              Disponíveis ({availableGifts})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select
            value={sortOrder}
            onValueChange={(v) =>
              setSortOrder(
                v as
                | "recentes"
                | "antigos"
                | "alfabetica"
                | "preco-alto"
                | "preco-baixo"
              )
            }
          >
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

      {/* Lista */}
      {filteredGifts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGifts.slice(0, 3).map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
          <DashboardAd slot="gifts-middle" format="horizontal" />
          {filteredGifts.length > 3 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGifts.slice(3).map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}
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
        <CardDescription className="line-clamp-2">
          {gift.description || "Sem descrição"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between">
          <span className="font-medium">{gift.price}</span>
          <span className="text-sm text-muted-foreground">
            {(gift.reserved ?? 0) > 0
              ? `${gift.reserved}/${gift.quantity} reservados`
              : "0 reservados"}
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