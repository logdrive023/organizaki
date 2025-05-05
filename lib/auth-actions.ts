"use server"

import { cookies } from "next/headers"

// Usuário de demonstração para teste
const DEMO_USER = {
  email: "usuario@exemplo.com",
  password: "123456",
  name: "Usuário Demo",
  id: "user-demo-123",
}

// Simulação de autenticação
export async function loginUser({ email, password }: { email: string; password: string }) {
  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Verificar se é o usuário de demonstração
  const isValidUser = email === DEMO_USER.email && password === DEMO_USER.password

  if (!isValidUser) {
    return { success: false, message: "Credenciais inválidas" }
  }

  // Definindo um cookie de autenticação simulado
  cookies().set("auth-token", "user-token-123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  })

  // Armazenando informações básicas do usuário em um cookie não-httpOnly para acesso no cliente
  cookies().set(
    "user-info",
    JSON.stringify({
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      id: DEMO_USER.id,
    }),
    {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    },
  )

  return { success: true }
}

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  // Em uma aplicação real, criaríamos o usuário no banco de dados

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Verificar se o email já está em uso (simulação)
  if (email === DEMO_USER.email) {
    return { success: false, message: "Este e-mail já está em uso" }
  }

  // Definindo um cookie de autenticação simulado
  cookies().set("auth-token", "user-token-123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  })

  // Armazenando informações básicas do usuário em um cookie não-httpOnly para acesso no cliente
  cookies().set(
    "user-info",
    JSON.stringify({
      name: name,
      email: email,
      id: `user-${Date.now()}`,
    }),
    {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    },
  )

  return { success: true }
}

export async function logoutUser() {
  // Removendo os cookies de autenticação
  cookies().delete("auth-token")
  cookies().delete("user-info")

  return { success: true }
}

export async function getCurrentUser() {
  // Em uma aplicação real, buscaríamos o usuário atual com base no token
  const token = cookies().get("auth-token")

  if (!token) {
    return null
  }

  // Tentando obter informações do usuário do cookie
  const userInfoCookie = cookies().get("user-info")

  if (userInfoCookie?.value) {
    try {
      return JSON.parse(userInfoCookie.value)
    } catch (e) {
      // Se não conseguir fazer o parse, retorna um usuário padrão
    }
  }

  // Simulando um usuário autenticado padrão
  return {
    id: "user-1",
    name: "Usuário Demo",
    email: "usuario@exemplo.com",
  }
}
