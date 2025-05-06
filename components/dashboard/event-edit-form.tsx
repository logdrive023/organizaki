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
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ImageUpload } from "@/components/dashboard/image-upload"
import type { EventType } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import {  UpdateEventRequest } from "@/lib/interface/event"
import { eventAPI } from "@/lib/api/event"

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


export function EventEditForm({ event }: { event: EventType }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // Parse the date string to a Date object
    const parsedDate = event.date ? parse(event.date, "dd/MM/yyyy", new Date()) : new Date()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: event.id, 
            title: event.title,
            description: event.description,
            date: parsedDate,
            time: event.time,
            location: event.location,
            coverFile: event.coverFile,
        },
    })

    async function onSubmit(data: FormValues) {
        setIsLoading(true)

        // Converte o File em base64
        let coverImageBase64: string | undefined
        if (data.coverFile) {
            coverImageBase64 = await converterImagemEmbase64(data.coverFile)
        }

        // Constrói o payload
        const payload: UpdateEventRequest = {
            id: data.id, 
            title: data.title,
            description: data.description,
            date: data.date.toISOString(),
            time: data.time,
            location: data.location,
            coverImage: coverImageBase64
        }


        try {
            await eventAPI.update(payload)
            
            toast({
                title: "Evento atualizado",
                description: "As informações do evento foram atualizadas com sucesso.",
            })
            router.push(`/dashboard/eventos/${event.id}`)
            router.refresh()

        } catch (error) {
            console.error("Erro ao atualizar evento:", error)
            toast({
                title: "Erro ao atualizar",
                description: "Ocorreu um erro ao atualizar o evento. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-2">
                    <div className="text-xl font-semibold">Informações Básicas</div>
                    <p className="text-sm text-muted-foreground">Atualize as informações básicas do seu evento</p>
                </div>

                <div className="space-y-4">
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
                    <p className="text-sm text-muted-foreground">Atualize quando e onde o evento acontecerá</p>
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
                                            locale={ptBR}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date() && !format(date, "dd/MM/yyyy").includes(event.date)}
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
                            <FormItem className="flex flex-col">
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
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
