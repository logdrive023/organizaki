"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, User, Mail, MessageSquare, Users, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockEvents } from "@/lib/mock-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

const guestFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().optional(),
  message: z.string().optional(),
  eventId: z.string({ required_error: "Selecione um evento" }),
})

const bulkGuestsSchema = z.object({
  guestList: z.string().min(1, { message: "A lista de convidados não pode estar vazia" }),
  eventId: z.string({ required_error: "Selecione um evento" }),
  includePhone: z.boolean().default(false),
})

type GuestFormValues = z.infer<typeof guestFormSchema>
type BulkGuestsValues = z.infer<typeof bulkGuestsSchema>

export default function NewGuestPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("individual")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const individualForm = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      eventId: "",
    },
  })

  const bulkForm = useForm<BulkGuestsValues>({
    resolver: zodResolver(bulkGuestsSchema),
    defaultValues: {
      guestList: "",
      eventId: "",
      includePhone: false,
    },
  })

  function onIndividualSubmit(data: GuestFormValues) {
    setIsSubmitting(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      console.log("Convidado adicionado:", data)
      setIsSubmitting(false)
      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/dashboard/convidados")
      }, 2000)
    }, 1500)
  }

  function onBulkSubmit(data: BulkGuestsValues) {
    setIsSubmitting(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      console.log("Convidados em massa adicionados:", data)
      setIsSubmitting(false)
      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/dashboard/convidados")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Adicionar Convidado</h1>
          <p className="text-muted-foreground">Adicione convidados à lista de um evento.</p>
        </div>
      </div>

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Convidado(s) adicionado(s) com sucesso! Redirecionando...</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações do Convidado</CardTitle>
          <CardDescription>Adicione um convidado individualmente ou importe vários de uma vez.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="emMassa">Em Massa</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="pt-4">
              <Form {...individualForm}>
                <form onSubmit={individualForm.handleSubmit(onIndividualSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FormField
                        control={individualForm.control}
                        name="eventId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um evento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockEvents.map((event) => (
                                  <SelectItem key={event.id} value={event.id}>
                                    {event.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Selecione o evento ao qual este convidado pertence.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={individualForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Ex: João Silva" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={individualForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Ex: joao@exemplo.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={individualForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone (opcional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Ex: (11) 98765-4321" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Formato: (00) 00000-0000</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <FormField
                        control={individualForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem (opcional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Adicione uma mensagem personalizada para este convidado"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Esta mensagem será incluída no convite enviado ao convidado.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Adicionar Convidado"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="emMassa" className="pt-4">
              <Form {...bulkForm}>
                <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-6">
                  <div className="grid gap-6">
                    <FormField
                      control={bulkForm.control}
                      name="eventId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um evento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockEvents.map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  {event.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Selecione o evento ao qual estes convidados pertencem.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bulkForm.control}
                      name="guestList"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lista de Convidados</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <textarea
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Adicione um e-mail por linha ou separados por vírgula ou ponto e vírgula"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            <p>Formato: nome, email, telefone (opcional)</p>
                            <p>Exemplo: João Silva, joao@exemplo.com, (11) 98765-4321</p>
                            <p>Ou apenas: joao@exemplo.com</p>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 font-medium">Dicas para importação em massa:</h3>
                      <ul className="ml-5 list-disc text-sm text-muted-foreground">
                        <li>Você pode importar apenas e-mails, um por linha</li>
                        <li>Ou usar o formato: Nome, E-mail, Telefone (separados por vírgula)</li>
                        <li>Se o telefone for omitido, apenas nome e e-mail serão importados</li>
                        <li>Você também pode copiar e colar diretamente de uma planilha</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Adicionar Convidados"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
