"use client"

import { useState } from "react"
import { Users, Gift, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { mockEvents, mockGuests, mockGifts } from "@/lib/mock-data"

export default function StatisticsPage() {
  const [selectedEvent, setSelectedEvent] = useState("todos")
  const [timeRange, setTimeRange] = useState("todos")
  const [activeTab, setActiveTab] = useState("resumo")

  // Filtrar dados com base no evento selecionado
  const filteredGuests =
    selectedEvent === "todos" ? mockGuests : mockGuests.filter((guest) => guest.eventId === selectedEvent)

  const filteredGifts =
    selectedEvent === "todos" ? mockGifts : mockGifts.filter((gift) => gift.eventId === selectedEvent)

  // Estatísticas de convidados
  const totalGuests = filteredGuests.length
  const confirmedGuests = filteredGuests.filter((g) => g.status === "confirmed").length
  const pendingGuests = filteredGuests.filter((g) => g.status === "pending").length
  const declinedGuests = filteredGuests.filter((g) => g.status === "declined").length
  const confirmationRate = totalGuests > 0 ? (confirmedGuests / totalGuests) * 100 : 0

  // Estatísticas de presentes
  const totalGifts = filteredGifts.length
  const totalGiftItems = filteredGifts.reduce((acc, gift) => acc + gift.quantity, 0)
  const reservedGifts = filteredGifts.reduce((acc, gift) => acc + (gift.reserved || 0), 0)
  const giftCompletionRate = totalGiftItems > 0 ? (reservedGifts / totalGiftItems) * 100 : 0

  // Valor estimado dos presentes
  const estimatedValue = filteredGifts.reduce((acc, gift) => {
    const price = Number.parseFloat(gift.price.replace(/[^\d,]/g, "").replace(",", "."))
    return isNaN(price) ? acc : acc + price * gift.quantity
  }, 0)

  // Presentes mais populares
  const topGifts = [...filteredGifts].sort((a, b) => (b.reserved || 0) - (a.reserved || 0)).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estatísticas</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho dos seus eventos.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecionar evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os eventos</SelectItem>
            {mockEvents.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo o período</SelectItem>
            <SelectItem value="7dias">Últimos 7 dias</SelectItem>
            <SelectItem value="30dias">Últimos 30 dias</SelectItem>
            <SelectItem value="90dias">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="convidados">Convidados</TabsTrigger>
          <TabsTrigger value="presentes">Presentes</TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Resumo */}
        <TabsContent value="resumo" className="space-y-6 mt-6">
          {/* Cards de resumo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Convidados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGuests}</div>
                <p className="text-xs text-muted-foreground">
                  {confirmedGuests} confirmados, {pendingGuests} pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Confirmação</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{confirmationRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {confirmedGuests} de {totalGuests} convidados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presentes Reservados</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reservedGifts}</div>
                <p className="text-xs text-muted-foreground">{giftCompletionRate.toFixed(1)}% da lista de presentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Estimado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {estimatedValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total de {totalGiftItems} itens na lista</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e detalhes */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status de Confirmação</CardTitle>
                <CardDescription>Distribuição de confirmações dos convidados</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{confirmationRate.toFixed(0)}%</div>
                          <div className="text-xs text-muted-foreground">Confirmados</div>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                        <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${confirmationRate * 2.51} 251`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <div className="text-sm">Confirmados ({confirmedGuests})</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-destructive"></div>
                      <div className="text-sm">Recusados ({declinedGuests})</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                      <div className="text-sm">Pendentes ({pendingGuests})</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Presentes</CardTitle>
                <CardDescription>Status da lista de presentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Progresso Geral</div>
                    <div className="text-sm font-medium">{giftCompletionRate.toFixed(1)}%</div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${giftCompletionRate}%` }}></div>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm font-medium">Top Presentes</div>
                    <ul className="mt-2 space-y-2">
                      {topGifts.map((gift) => (
                        <li key={gift.id} className="flex items-center justify-between">
                          <div className="text-sm">{gift.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {gift.reserved || 0} de {gift.quantity}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Convidados */}
        <TabsContent value="convidados" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Convidados</CardTitle>
              <CardDescription>Detalhes sobre confirmações e participação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Gráfico de status */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Status de Confirmação</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{confirmedGuests}</div>
                      <div className="text-sm text-green-700">Confirmados</div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">{pendingGuests}</div>
                      <div className="text-sm text-yellow-700">Pendentes</div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">{declinedGuests}</div>
                      <div className="text-sm text-red-700">Recusados</div>
                    </div>
                  </div>
                </div>

                {/* Taxa de resposta */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Taxa de Resposta</h3>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Respostas recebidas</span>
                        <span className="text-sm font-medium">
                          {(((confirmedGuests + declinedGuests) / totalGuests) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${((confirmedGuests + declinedGuests) / totalGuests) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da aba Presentes */}
        <TabsContent value="presentes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Presentes</CardTitle>
              <CardDescription>Detalhes sobre a lista de presentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumo de presentes */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{totalGifts}</div>
                    <div className="text-sm text-blue-700">Total de Presentes</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{reservedGifts}</div>
                    <div className="text-sm text-purple-700">Presentes Reservados</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600">R$ {estimatedValue.toFixed(0)}</div>
                    <div className="text-sm text-emerald-700">Valor Estimado</div>
                  </div>
                </div>

                {/* Progresso da lista */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Progresso da Lista</h3>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Presentes reservados</span>
                        <span className="text-sm font-medium">{giftCompletionRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${giftCompletionRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top presentes */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Presentes Mais Populares</h3>
                  <ul className="space-y-3">
                    {topGifts.map((gift, index) => (
                      <li key={gift.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">{index + 1}.</span>
                          <span>{gift.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {gift.reserved || 0} de {gift.quantity} reservados
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
