"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"
import {
  ArrowLeft,
  User,
  Mail,
  MessageSquare,
  Users,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

import { eventAPI, } from "@/lib/api/event"
import { EventType, type NewGuestRequest } from "@/lib/interface/event"

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
  includePhone: z.boolean(),
})

type GuestFormValues = z.infer<typeof guestFormSchema>
type BulkGuestsValues = z.infer<typeof bulkGuestsSchema>

export default function NewGuestPage() {
  const router = useRouter()
  const { toast } = useToast()

  // 1) estados de eventos e loading
  const [events, setEvents] = useState<EventType[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [activeTab, setActiveTab] = useState<"individual" | "emMassa">("individual")
  const [isSubmitting, setIsSubmitting] = useState(false)


  const individualForm = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", eventId: "" },
  })


  const bulkForm = useForm<BulkGuestsValues>({
    resolver: zodResolver(bulkGuestsSchema),
    defaultValues: {
      guestList: "",
      eventId: "",
      includePhone: false,
    },
  })

  const includePhone = bulkForm.watch("includePhone")

  // 2) busca os eventos assim que o componente monta
  useEffect(() => {
    eventAPI
      .list()
      .then((evs) => setEvents(evs))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: err.message || "Tente novamente mais tarde.",
        }),
      )
      .finally(() => setLoadingEvents(false))
  }, [])

  const onIndividualSubmit: SubmitHandler<GuestFormValues> = async (data) => {
    setIsSubmitting(true)
    try {
      const req: NewGuestRequest = {
        eventId: data.eventId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: "pending"
      }
      await eventAPI.addGuest(req)
      toast({
        title: "Convidado adicionado com sucesso!",
        description: `${req.name} foi adicionado à lista de convidados.`,
      })

      setTimeout(() => router.push("/dashboard/convidados"), 2000)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar convidado",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onBulkSubmit: SubmitHandler<BulkGuestsValues> = async ({ guestList, eventId, includePhone }) => {
    setIsSubmitting(true);

    try {
      // 1) Monta array de linhas não vazias
      const lines = guestList
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        throw new Error("A lista de convidados não pode estar vazia.");
      }

      // 2) Constrói os objetos NewGuestRequest
      const toCreate: NewGuestRequest[] = lines.map((line) => {
        const parts = line.split(/[,;]+/).map((p) => p.trim());
        const name = parts[0];
        const email = parts[1] || parts[0];
        // só lê telefone se includePhone e existir terceiro campo
        const phone = includePhone && parts.length > 2 ? parts[2] : undefined;

        return {
          eventId,
          name,
          email,
          phone,
          status: "pending",
        };
      });

      // 3) Dispara todas as requisições em paralelo
      await Promise.all(toCreate.map((req) => eventAPI.addGuest(req)));

      // 4) Feedback para o usuário
      toast({
        title: `${toCreate.length} convidado${toCreate.length > 1 ? "s" : ""} adicionado${toCreate.length > 1 ? "s" : ""} com sucesso!`,
        description: includePhone
          ? "Todos os telefones incluídos conforme solicitado."
          : "Os telefones foram ignorados conforme configuração.",
      });

      // 5) Redireciona após 2s
      setTimeout(() => router.push("/dashboard/convidados"), 2000);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao importar em massa",
        description: err.message || "Verifique o formato e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* cabeçalho e sucesso */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Adicionar Convidado</h1>
          <p className="text-muted-foreground">
            Escolha um evento e cadastre convidados.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Convidado</CardTitle>
          <CardDescription>
            Individual ou em massa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="emMassa">Em Massa</TabsTrigger>
            </TabsList>

            {/* INDIVIDUAL */}
            <TabsContent value="individual" className="pt-4">
              <Form {...individualForm}>
                <form
                  onSubmit={individualForm.handleSubmit(onIndividualSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Evento */}
                    <div className="sm:col-span-2">
                      <FormField
                        control={individualForm.control}
                        name="eventId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evento</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um evento" />
                                </SelectTrigger>
                                <SelectContent>
                                  {events?.map((ev) => (
                                    <SelectItem key={ev.id} value={ev.id}>
                                      {ev.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Nome */}
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
                    {/* E-mail */}
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
                    {/* Telefone */}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Mensagem */}
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
                                  {...field}
                                  className="w-full min-h-[80px] rounded border px-3 py-2 pl-10"
                                  placeholder="Adicione uma mensagem personalizada para este convidado"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Adicionar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* EM MASSA */}
            <TabsContent value="emMassa" className="pt-4">
              <Form {...bulkForm}>
                <form
                  onSubmit={bulkForm.handleSubmit(onBulkSubmit)}
                  className="space-y-6"
                >
                  {/* Evento */}
                  <FormField
                    control={bulkForm.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evento</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um evento" />
                            </SelectTrigger>
                            <SelectContent>
                              {events.map((ev) => (
                                <SelectItem key={ev.id} value={ev.id}>
                                  {ev.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lista de Convidados */}
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
                              {...field}
                              className="w-full min-h-[200px] rounded border px-3 py-2 pl-10"
                              placeholder={
                                includePhone
                                  ? "Nome, e-mail, telefone (opcional) por linha"
                                  : "Nome e e-mail por linha"
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {includePhone ? (
                            <>
                              <p>Formato: nome, email, telefone (opcional)</p>
                              <p>Exemplo: João Silva, joao@exemplo.com, (11) 98765-4321</p>
                              <p>Ou apenas: joao@exemplo.com</p>
                            </>
                          ) : (
                            <>
                              <p>Formato: nome, email</p>
                              <p>Exemplo: João Silva, joao@exemplo.com</p>
                            </>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checkbox Incluir Telefone */}
                  <FormField
                    control={bulkForm.control}
                    name="includePhone"
                    render={({ field }) => (
                      <FormItem>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Incluir telefone
                        </label>
                        <FormDescription className="mt-1">
                          {includePhone
                            ? "Vou usar o terceiro valor de cada linha como telefone."
                            : "Se desmarcado, ignoro completamente o telefone."}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Dicas Gerais */}
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Dicas para importação em massa:</h3>
                    <ul className="ml-5 list-disc text-sm text-muted-foreground">
                      <li>Você pode importar apenas e-mails, um por linha</li>
                      <li>Ou usar o formato: Nome, E-mail{includePhone && ", Telefone"}</li>
                      <li>Você também pode copiar e colar diretamente de uma planilha</li>
                    </ul>
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
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