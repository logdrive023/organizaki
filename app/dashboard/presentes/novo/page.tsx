"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockEvents } from "@/lib/mock-data"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  eventId: z.string({
    required_error: "Por favor selecione um evento.",
  }),
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O preço deve ser um número positivo.",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number.isInteger(Number(val)), {
    message: "A quantidade deve ser um número inteiro positivo.",
  }),
  link: z
    .string()
    .url({
      message: "Por favor insira uma URL válida.",
    })
    .optional()
    .or(z.literal("")),
  image: z.any().optional(),
})

export default function NovoPresentePage() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "1",
      link: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Presente adicionado com sucesso!",
      description: `${values.name} foi adicionado à lista de presentes.`,
    })

    // Simulando um atraso para mostrar o feedback
    setTimeout(() => {
      router.push("/dashboard/presentes")
    }, 1500)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        form.setValue("image", file)
      }
      reader.readAsDataURL(file)
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
            Adicione um novo presente à sua lista. Os convidados poderão visualizar e reservar este presente.
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
                    <FormDescription>Selecione o evento ao qual este presente será associado.</FormDescription>
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
                      <FormLabel>Nome do Presente</FormLabel>
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
                        <Input type="number" min="0" step="0.01" placeholder="0,00" {...field} />
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
                      <Textarea
                        placeholder="Descreva o presente com detalhes..."
                        className="min-h-[120px]"
                        {...field}
                      />
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
                      <FormDescription>Quantas unidades deste presente você deseja receber.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link para Compra (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Adicione um link para facilitar a compra do presente.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do Presente</FormLabel>
                    <FormControl>
                      <div className="grid w-full gap-4 md:grid-cols-2">
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className={`relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                              imagePreview ? "border-primary" : "border-muted-foreground/25"
                            } bg-muted/50 px-4 py-8 text-center transition hover:bg-muted/80`}
                            onClick={() => document.getElementById("gift-image")?.click()}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Clique para fazer upload de uma imagem
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP até 5MB</p>
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
                              onClick={() => {
                                setImagePreview(null)
                                form.setValue("image", undefined)
                              }}
                            >
                              Remover imagem
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="text-sm font-medium">Dicas para imagens:</h3>
                          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                            <li>Use imagens de alta qualidade</li>
                            <li>Prefira fundo branco ou neutro</li>
                            <li>Mostre o produto por completo</li>
                            <li>Evite imagens com marca d'água</li>
                            <li>Tamanho recomendado: 800x600px</li>
                          </ul>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/presentes")}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Presente</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
