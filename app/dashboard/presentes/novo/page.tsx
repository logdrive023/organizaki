"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { presentAPI } from "@/lib/api/present"
import type { NewGiftRequest } from "@/lib/interface/present"
import { eventAPI } from "@/lib/api/event"
import { SelectEvent } from "@/lib/interface/event"

import { mockEvents } from "@/lib/mock-data"

const formSchema = z.object({
  eventId: z.string({ required_error: "Por favor selecione um evento." }),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  price: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "O preço deve ser um número positivo." }),
  quantity: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number.isInteger(Number(v)), {
      message: "A quantidade deve ser um número inteiro positivo.",
    }),
  link: z.string().url({ message: "Por favor insira uma URL válida." }).optional().or(z.literal("")),
  image: z.any().optional(),
})

export default function NovoPresentePage() {
  const router = useRouter()
  const [eventOptions, setEventOptions] = useState<SelectEvent[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: "",
      name: "",
      description: "",
      price: "",
      quantity: "1",
      link: "",
      image: undefined,
    },
  })

  // Carrega opções de evento dinamicamente
  useEffect(() => {
    eventAPI
      .selectEvent()            // busca lista de eventos
      .then((list) => setEventOptions(list))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Não foi possível carregar eventos",
          description: err.message,
        })
      )
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      form.setValue("image", reader.result)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const payload: NewGiftRequest = {
        eventId: values.eventId,
        name: values.name,
        description: values.description,
        price: Number(values.price),
        quantity: Number(values.quantity),
        url: values.link || undefined,
        image: imagePreview || undefined,
      }

      await presentAPI.create(payload)

      toast({
        title: "Presente adicionado com sucesso!",
        description: `${values.name} foi adicionado à lista de presentes.`,
      })
      router.push("/dashboard/presentes")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar presente",
        description: err.message || "Tente novamente mais tarde.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/presentes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Adicionar Presente</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Presente</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para adicionar um novo presente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evento</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventOptions && eventOptions.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Selecione o evento para este presente.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Jogo de Panelas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o presente..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link de Compra (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Imagem</FormLabel>
                      <div
                        className={`relative flex h-40 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 ${imagePreview ? "border-primary" : "border-muted-foreground/25"
                          }`}
                        onClick={() => document.getElementById("gift-image")?.click()}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Clique para fazer upload
                            </p>
                          </>
                        )}
                        <input
                          id="gift-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setImagePreview(null)
                            form.setValue("image", undefined)
                          }}
                        >
                          Remover imagem
                        </Button>
                      )}
                    <FormDescription>
                      PNG, JPG ou WEBP até 5MB. Use imagens de alta qualidade.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/dashboard/presentes")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Presente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
