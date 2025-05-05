import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obter o token de autenticação do cookie
  const authToken = request.cookies.get("auth-token")?.value

  // Verificar se o usuário está tentando acessar rotas protegidas
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Se não houver token, redirecionar para a página de login
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Verificar se o usuário já está autenticado e está tentando acessar login/register
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && authToken) {
    // Se já estiver autenticado, redirecionar para o dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurar quais caminhos devem ser processados pelo middleware
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
