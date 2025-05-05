import Link from "next/link"
import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Cadastro - Evento Fácil",
  description: "Crie sua conta no Evento Fácil",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
              <p className="text-sm text-muted-foreground">
                Preencha os dados abaixo para criar sua conta e começar a organizar seus eventos
              </p>
            </div>
            <RegisterForm />
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-primary underline underline-offset-4">
                Já tem uma conta? Faça login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
