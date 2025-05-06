"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)

    // Show the thank you message
    setIsSubmitted(true)

    // Reset form (optional)
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
        <div className="rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-medium text-primary">Obrigado pelo contato!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em até 24 horas úteis.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <Input id="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Assunto
        </label>
        <Input
          id="subject"
          placeholder="Assunto da mensagem"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Descreva sua dúvida ou problema em detalhes..."
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Enviar mensagem
      </Button>
    </form>
  )
}
