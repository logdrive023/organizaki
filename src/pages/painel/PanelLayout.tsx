import clsx from 'clsx'
import { BarChart3, Bell, CalendarHeart, Gift, LogOut, Plus, Settings, Sparkles, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ButtonLink, Logo } from '../../components/ui'
import { logout } from '../../lib/api'
import { relativeTime } from '../../lib/format'
import { useNotifications } from '../../lib/queries'
import { useMe } from '../../lib/session'

const nav = [
  { to: '/painel', label: 'Eventos', icon: CalendarHeart, end: true },
  { to: '/painel/convidados', label: 'Convidados', icon: Users },
  { to: '/painel/presentes', label: 'Presentes', icon: Gift },
  { to: '/painel/estatisticas', label: 'Números', icon: BarChart3 },
  { to: '/painel/configuracoes', label: 'Ajustes', icon: Settings },
]

export default function PanelLayout() {
  const me = useMe()
  const navigate = useNavigate()
  async function signOut() {
    navigate('/', { replace: true })
    await logout()
  }
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-card p-4 md:flex">
        <Link to="/painel" className="px-2 py-2">
          <Logo />
        </Link>
        <ButtonLink to="/painel/eventos/novo" className="mt-6">
          <Plus className="size-4" /> Novo evento
        </ButtonLink>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                clsx('flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium', isActive ? 'bg-brand-soft text-brand-dark' : 'text-muted hover:bg-soft hover:text-ink')
              }
            >
              <n.icon className="size-4" /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          {me?.plan === 'free' && (
            <Link to="/painel/configuracoes?aba=premium" className="block rounded-xl bg-soft p-3 text-sm hover:bg-brand-soft">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="size-4 text-brand" /> Tirar os anúncios
              </span>
              <span className="text-xs text-muted">Premium por R$ 10,00, uma vez só.</span>
            </Link>
          )}
          <div className="flex items-center gap-3 rounded-xl px-2 py-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand-dark">{me?.name.charAt(0).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{me?.name}</p>
              <p className="truncate text-xs text-muted">{me?.email}</p>
            </div>
            <button onClick={signOut} className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label="Sair">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur md:justify-end md:px-8">
          <Link to="/painel" className="md:hidden">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <Bell_ />
            <button onClick={signOut} className="rounded-lg p-2 text-muted hover:bg-soft md:hidden" aria-label="Sair">
              <LogOut className="size-5" />
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Menu do painel">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => clsx('flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium', isActive ? 'text-brand-dark' : 'text-muted')}
          >
            <n.icon className="size-5" /> {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function Bell_() {
  const { data } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const unread = data?.unread ?? 0
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label={`Notificações${unread ? `, ${unread} novas` : ''}`} aria-expanded={open}>
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-semibold">Notificações</span>
            <Link to="/painel/notificacoes" onClick={() => setOpen(false)} className="text-sm font-medium text-brand-dark">
              Ver todas
            </Link>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {(data?.items ?? []).slice(0, 6).map((n) => (
              <li key={n.id}>
                <Link to={n.link || '/painel/notificacoes'} onClick={() => setOpen(false)} className={clsx('block px-4 py-3 hover:bg-soft', !n.read && 'bg-brand-soft/40')}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-sm text-muted">{n.message}</p>
                  <p className="mt-0.5 text-xs text-muted">{relativeTime(n.createdAt)}</p>
                </Link>
              </li>
            ))}
            {!data?.items.length && <li className="px-4 py-8 text-center text-sm text-muted">Nada por aqui ainda.</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
