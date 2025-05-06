"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Clock, MapPin, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import { eventAPI } from "@/lib/api/event"
import { NewEventRequest } from "@/lib/interface/event"


const formSchema = z.object({
  title: z.string().min(2, { message: "O título deve ter pelo menos 2 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  date: z.date({ required_error: "A data é obrigatória" }),
  time: z.string().min(1, { message: "O horário é obrigatório" }),
  location: z.string().min(5, { message: "O local deve ter pelo menos 5 caracteres" }),
  coverFile: z
    .any()
    .refine(v => v instanceof File, "Selecione uma imagem")
    .optional(),
})

type FormValues = z.infer<typeof formSchema>


export function converterImagemEmbase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(new Error("Não foi possível converter o arquivo em string"))
      }
    }

    reader.onerror = () => {
      reader.abort()
      reject(new Error("Erro ao ler o arquivo"))
    }

    reader.readAsDataURL(file)
  })
}

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { coverFile: undefined },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)


    // Converte o File em base64
    let coverImageBase64: string | undefined
    if (data.coverFile) {
      coverImageBase64 = await converterImagemEmbase64(data.coverFile)
    }

    // Constrói o payload
    const payload: NewEventRequest = {
      title: data.title,
      description: data.description,
      date: data.date.toISOString(),
      time: data.time,
      location: data.location,
      coverImage: coverImageBase64
    }

    try {

      await eventAPI.create(payload)

      toast({
        title: "Evento criado com sucesso!",
        description: "Você será redirecionado em instantes.",
      })

      // redireciona após 1s
      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (err: any) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Falha ao criar evento",
        description: err.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Criar Novo Evento</h1>
          <p className="text-muted-foreground">Preencha os dados para criar seu evento</p>
        </div>
      </div>


      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="coverFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem de Capa</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value} 
                            onChange={(file) => {
                              field.onChange(file)        
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Evento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Casamento de João e Maria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={ptBR}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input type="time" className="w-full pr-10" {...field} />
                          <Clock className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              placeholder="Ex: Salão de Festas Primavera, Rua das Flores, 123"
                              className="w-full pr-10"
                              {...field}
                            />
                            <MapPin className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os detalhes do seu evento..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Evento"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  )
}
