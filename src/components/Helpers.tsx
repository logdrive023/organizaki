import clsx from 'clsx'
import { ArrowUp, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HELP, type HelpItem, type HelpPlace } from '../lib/help'
import { DEMO } from '../lib/paths'
import { useSession } from '../lib/session'
import type { Session } from '../lib/types'
import { Kiki } from './Kiki'

const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function placeOf(path: string): HelpPlace {
  if (path.startsWith('/painel')) return 'painel'
  if (path.startsWith('/e/')) return 'convite'
  return 'site'
}

/**
 * Os ajudantes flutuantes: a Kiki ("Precisa de ajuda?") e a seta de voltar ao topo.
 * Ficam acima das barras fixas do celular (convite e painel) para não tampar nenhum botão.
 */
export function Helpers() {
  const { pathname } = useLocation()
  const place = placeOf(pathname)
  if (pathname === '/entrar' || pathname === '/criar-conta') return null
  const lift = place === 'convite' ? 'bottom-24 sm:bottom-6' : place === 'painel' ? 'bottom-20 md:bottom-6' : 'bottom-5 sm:bottom-6'
  return (
    <div className={clsx('fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6', lift)}>
      <BackToTop />
      <HelpChat key={place} place={place} />
    </div>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let frame = 0
    // um cálculo por quadro, não um por evento de rolagem (no celular são dezenas por segundo)
    const check = () => {
      frame = 0
      setShow(scrollY > innerHeight * 1.5)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      onClick={() => scrollTo({ top: 0, behavior: calm() ? 'auto' : 'smooth' })}
      aria-label="Voltar ao topo"
      tabIndex={show ? 0 : -1}
      className={clsx(
        'grid size-11 place-items-center rounded-full border border-line bg-card text-ink shadow-lg transition-all hover:bg-soft',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  )
}

interface Bubble {
  who: 'kiki' | 'me'
  text: string
  item?: HelpItem
}

function HelpChat({ place }: { place: HelpPlace }) {
  const data = HELP[place]
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState<Bubble[]>([])
  const [typing, setTyping] = useState(false)
  const [asked, setAsked] = useState<Set<number>>(new Set())
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const setSession = useSession((s) => s.setSession)

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const outside = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', key)
    document.addEventListener('mousedown', outside)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('mousedown', outside)
    }
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: calm() ? 'auto' : 'smooth' })
  }, [chat, typing])

  function toggle() {
    if (!open && chat.length === 0) setChat([{ who: 'kiki', text: data.hi }])
    setOpen(!open)
  }

  function ask(i: number) {
    const it = data.items[i]
    setAsked(new Set(asked).add(i))
    setChat((c) => [...c, { who: 'me', text: it.q }])
    setTyping(true)
    setTimeout(
      () => {
        setTyping(false)
        setChat((c) => [...c, { who: 'kiki', text: it.a, item: it }])
      },
      calm() ? 0 : 600,
    )
  }

  async function act(it: HelpItem) {
    const a = it.action!
    setOpen(false)
    if (a.demo && DEMO) {
      const { demoSession } = await import('../lib/demo')
      setSession(demoSession() as Session)
      navigate('/painel')
      return
    }
    if (a.to) navigate(a.to)
    if (a.click) document.querySelector<HTMLElement>(a.click)?.click()
    if (a.scroll) setTimeout(() => document.querySelector(a.scroll!)?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' }), 120)
  }

  const rest = data.items.map((it, i) => ({ it, i })).filter(({ i }) => !asked.has(i))
  const chips = rest.length ? rest : data.items.map((it, i) => ({ it, i }))

  return (
    <div ref={root} className="flex flex-col items-end gap-3">
      {open && (
        <section role="dialog" aria-label="Ajuda da Kiki" className="enter flex max-h-[min(34rem,calc(100dvh-9rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-2xl shadow-ink/15">
          <header className="flex items-center gap-3 bg-rosewash px-4 py-3">
            <Kiki mood="feliz" size={40} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-tight font-semibold">Kiki</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="size-2 rounded-full bg-ok" /> Respondo na hora
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted hover:bg-card" aria-label="Fechar a ajuda">
              <X className="size-5" />
            </button>
          </header>
          <div ref={list} className="flex-1 space-y-2 overflow-y-auto px-4 py-4" aria-live="polite">
            {chat.map((b, n) => (
              <div key={n} className={clsx('flex', b.who === 'me' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-[85%] rounded-2xl px-3.5 py-2 text-sm', b.who === 'me' ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-soft')}>
                  {b.text}
                  {b.item?.action && (
                    <button onClick={() => act(b.item!)} className="mt-2 block rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-brand-dark shadow-sm ring-1 ring-blush hover:bg-rosewash">
                      {b.item.action.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-soft px-3.5 py-3" aria-label="Kiki está escrevendo">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-line px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted">{asked.size ? 'Outras perguntas' : 'Como eu faço…'}</p>
            <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {chips.map(({ it, i }) => (
                <button key={i} onClick={() => ask(i)} className="rounded-full border border-blush bg-card px-3 py-1.5 text-left text-xs font-medium hover:bg-rosewash">
                  {it.q}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      <button
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Fechar a ajuda' : 'Precisa de ajuda?'}
        className="group flex items-center gap-2 rounded-full bg-card py-1 pr-1 pl-1 shadow-xl sm:pl-4 shadow-brand/15 ring-1 ring-blush transition-transform hover:-translate-y-0.5"
      >
        <span className="hidden text-sm font-semibold text-brand-dark sm:inline">Precisa de ajuda?</span>
        <Kiki mood={open ? 'feliz' : 'normal'} size={44} />
      </button>
    </div>
  )
}
