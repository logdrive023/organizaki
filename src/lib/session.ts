import { create } from 'zustand'
import type { Me, Session } from './types'

const KEY = 'ok.session'

function load(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function save(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s))
    else localStorage.removeItem(KEY)
  } catch {
    /* modo privado sem storage: a sessão vive só na memória */
  }
}

interface SessionState {
  session: Session | null
  setSession: (s: Session | null) => void
  setUser: (u: Me) => void
}

export const useSession = create<SessionState>((set, get) => ({
  session: load(),
  setSession: (s) => {
    save(s)
    set({ session: s })
  },
  setUser: (u) => {
    const s = get().session
    if (!s) return
    const next = { ...s, user: u }
    save(next)
    set({ session: next })
  },
}))

export const getSession = () => useSession.getState().session

/** Relê o que está gravado: outra aba pode ter renovado os tokens. */
export function syncFromStorage(): Session | null {
  const stored = load()
  if (stored?.refreshToken !== getSession()?.refreshToken) useSession.setState({ session: stored })
  return stored
}
export const useMe = () => useSession((s) => s.session?.user ?? null)
