"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { confirmPresence } from "@/lib/guest-actions"

interface ConfirmPresenceProps {
  eventId: string
}

export function ConfirmPresence({ eventId }: ConfirmPresenceProps) {
  const [status, setStatus] = useState<"confirmed" | "declined" | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!status || !name || !email) return

    setIsLoading(true)
    try {
      await confirmPresence(eventId, {
        name,
        email,
        phone,
        status,
        message,
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Confirmação Recebida</CardTitle>
          <CardDescription className="text-center">Obrigado por confirmar sua presença</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {status === "confirmed" ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="mt-4 text-center">
                Sua presença foi confirmada com sucesso. Estamos ansiosos para vê-lo no evento!
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="mt-4 text-center">Lamentamos que você não possa comparecer. Obrigado por nos informar.</p>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Confirmar Presença</CardTitle>
        <CardDescription>Preencha o formulário abaixo para confirmar sua presença no evento</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Seu E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Seu Telefone (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label>Você vai comparecer?</Label>
            <RadioGroup
              value={status || ""}
              onValueChange={(value) => setStatus(value as "confirmed" | "declined")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confirmed" id="confirmed" />
                <Label htmlFor="confirmed" className="cursor-pointer">
                  Sim, vou comparecer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="declined" id="declined" />
                <Label htmlFor="declined" className="cursor-pointer">
                  Não poderei comparecer
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe uma mensagem para os anfitriões"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !status || !name || !email}>
            {isLoading ? "Enviando..." : "Confirmar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
