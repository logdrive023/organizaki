import Link from "next/link"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Login - Evento Fácil",
  description: "Faça login na sua conta do Evento Fácil",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
              <p className="text-sm text-muted-foreground">Entre com seu e-mail e senha para acessar sua conta</p>
            </div>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/register" className="hover:text-primary underline underline-offset-4">
                Não tem uma conta? Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
