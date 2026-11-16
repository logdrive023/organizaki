import { getSession, syncFromStorage, useSession } from './session'
import { DEMO } from './paths'
import type { Session } from './types'

export class ApiError extends Error {
  status: number
  code: string
  fields: Record<string, string>
  constructor(status: number, code: string, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

let refreshing: Promise<Session | null> | null = null

// Uma renovação por vez: várias chamadas com 401 esperam a mesma troca de token (o refresh é de uso único).
function refreshSession(): Promise<Session | null> {
  if (refreshing) return refreshing
  const current = syncFromStorage()
  if (!current) return Promise.resolve(null)
  if (new Date(current.expiresAt).getTime() - Date.now() > 30_000) return Promise.resolve(current)
  refreshing = fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  })
    .then(async (r) => {
      if (!r.ok) {
        useSession.getState().setSession(null)
        return null
      }
      const s = (await r.json()).data as Session
      useSession.getState().setSession(s)
      return s
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

async function freshToken(): Promise<string | null> {
  const s = getSession()
  if (!s) return null
  if (new Date(s.expiresAt).getTime() - Date.now() > 30_000) return s.accessToken
  return (await refreshSession())?.accessToken ?? null
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}, retry = true): Promise<T> {
  if (DEMO) {
    const { demoApi } = await import('./demo')
    return demoApi<T>(path, init.method ?? 'GET', init.json, init.body, getSession()?.accessToken ?? null)
  }
  const token = await freshToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let body = init.body
  if (init.json !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(init.json)
  }
  let res: Response
  try {
    res = await fetch('/api' + path, { ...init, headers, body })
  } catch {
    throw new ApiError(0, 'network', 'Sem conexão com o servidor. Confira sua internet.')
  }
  if (res.status === 401 && retry && getSession()) {
    if (await refreshSession()) return api<T>(path, init, false)
  }
  if (res.status === 204) return undefined as T
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const e = payload?.error
    throw new ApiError(res.status, e?.code ?? 'network', e?.message ?? 'Algo deu errado. Tente de novo.', e?.fields ?? {})
  }
  return payload?.data as T
}

export const get = <T,>(p: string) => api<T>(p)
export const post = <T,>(p: string, json?: unknown) => api<T>(p, { method: 'POST', json: json ?? {} })
export const put = <T,>(p: string, json: unknown) => api<T>(p, { method: 'PUT', json })
export const del = <T,>(p: string, json?: unknown) => api<T>(p, json === undefined ? { method: 'DELETE' } : { method: 'DELETE', json })

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const { url } = await api<{ url: string }>('/uploads', { method: 'POST', body: fd })
  return url
}

export async function logout() {
  try {
    if (getSession()) await post('/auth/logout')
  } catch {
    /* sair funciona mesmo sem rede: o token local some de qualquer jeito */
  }
  useSession.getState().setSession(null)
}

/** Erros de campo de um ApiError (422) — vazio para os outros erros. */
export const fieldErrors = (e: unknown): Record<string, string> => (e instanceof ApiError ? e.fields : {})
export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.')
