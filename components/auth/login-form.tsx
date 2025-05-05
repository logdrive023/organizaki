"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginUser } from "@/lib/auth-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(e: React.FormEvent, values: z.infer<typeof formSchema>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginUser(values)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError("E-mail ou senha incorretos. Por favor, tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const useTestAccount = () => {
    form.setValue("email", "usuario@exemplo.com")
    form.setValue("password", "123456")
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => form.handleSubmit((values) => onSubmit(e, values))(e)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-center">
          <button type="button" onClick={useTestAccount} className="text-primary hover:underline text-sm font-medium">
            Usar conta de demonstração
          </button>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </Form>
  )
}
