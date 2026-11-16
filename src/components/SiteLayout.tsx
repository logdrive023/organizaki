import { Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useMe } from '../lib/session'
import { ButtonLink, Logo } from './ui'

// Âncoras pelo roteador: um <a href="/#x"> ignoraria o subcaminho do GitHub Pages (/organizaki/) e cairia na raiz.
const anchors = [
  { hash: 'como-funciona', label: 'Como funciona' },
  { hash: 'recursos', label: 'Recursos' },
  { hash: 'perguntas', label: 'Perguntas' },
]

export function SiteHeader() {
  const me = useMe()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label="Organizaki, início">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {anchors.map((a) => (
            <Link key={a.hash} to={{ pathname: '/', hash: a.hash }} className="hover:text-ink">
              {a.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {me ? (
            <ButtonLink to="/painel">Ir para o painel</ButtonLink>
          ) : (
            <>
              <ButtonLink to="/entrar" variant="ghost">
                Entrar
              </ButtonLink>
              <ButtonLink to="/criar-conta">Criar meu evento</ButtonLink>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2">
            {anchors.map((a) => (
              <Link key={a.hash} to={{ pathname: '/', hash: a.hash }} onClick={() => setOpen(false)} className="py-3 font-medium">
                {a.label}
              </Link>
            ))}
          </nav>
          {me ? (
            <ButtonLink to="/painel" className="w-full">
              Ir para o painel
            </ButtonLink>
          ) : (
            <div className="grid gap-2">
              <ButtonLink to="/criar-conta">Criar meu evento</ButtonLink>
              <ButtonLink to="/entrar" variant="secondary">
                Entrar
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export function SiteFooter() {
  const link = 'text-sm text-muted hover:text-ink'
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-xs text-sm text-muted">A página do seu evento, a lista de convidados e a de presentes no mesmo link.</p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Produto">
          <span className="text-sm font-semibold">Produto</span>
          <Link className={link} to={{ pathname: '/', hash: 'como-funciona' }}>
            Como funciona
          </Link>
          <Link className={link} to="/e/demo">
            Ver um evento de exemplo
          </Link>
          <Link className={link} to="/ajuda">
            Ajuda e contato
          </Link>
        </nav>
        <nav className="flex flex-col gap-2" aria-label="Legal">
          <span className="text-sm font-semibold">Legal</span>
          <NavLink className={link} to="/termos">
            Termos de uso
          </NavLink>
          <NavLink className={link} to="/privacidade">
            Privacidade
          </NavLink>
          <NavLink className={link} to="/cookies">
            Cookies e armazenamento
          </NavLink>
        </nav>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} Organizaki</p>
    </footer>
  )
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
