"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createEvent } from "@/lib/event-actions"
import { ImageUpload } from "@/components/dashboard/image-upload"

const formSchema = z.object({
  title: z.string().min(2, { message: "O título deve ter pelo menos 2 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  date: z.date({ required_error: "A data é obrigatória" }),
  time: z.string().min(1, { message: "O horário é obrigatório" }),
  location: z.string().min(5, { message: "O local deve ter pelo menos 5 caracteres" }),
  coverImage: z.string().optional(),
})

export function EventForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "",
      location: "",
      coverImage: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const eventId = await createEvent({ ...values, coverImage })
      router.push(`/dashboard/eventos/${eventId}`)
    } catch (error) {
      console.error("Erro ao criar evento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <div className="text-xl font-semibold">Informações Básicas</div>
          <p className="text-sm text-muted-foreground">Preencha as informações básicas do seu evento</p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem de Capa</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={coverImage}
                    onChange={(url) => {
                      setCoverImage(url)
                      field.onChange(url)
                    }}
                  />
                </FormControl>
                <FormDescription>Escolha uma imagem de capa para o seu evento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Casamento de João e Maria" {...field} />
                </FormControl>
                <FormDescription>Este será o título principal do seu evento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva os detalhes do seu evento..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormDescription>Forneça detalhes sobre o evento para seus convidados</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xl font-semibold">Data e Local</div>
          <p className="text-sm text-muted-foreground">Defina quando e onde o evento acontecerá</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>A data em que o evento acontecerá</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input type="time" {...field} />
                    <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>O horário de início do evento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input placeholder="Ex: Salão de Festas Primavera, Rua das Flores, 123" {...field} />
                    <MapPin className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>O endereço completo onde o evento será realizado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Evento"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
