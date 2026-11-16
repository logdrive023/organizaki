import { lazy, Suspense, useEffect } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { Helpers } from './components/Helpers'
import { Toaster } from './components/toast'
import { Spinner } from './components/ui'
import { safeBack } from './lib/nav'
import { DEMO } from './lib/paths'
import { useMe } from './lib/session'
import Landing from './pages/Landing'
import { Login, Register } from './pages/Auth'

// Painel e página pública em pedaços separados: quem abre só o convite não baixa o painel.
const PublicEvent = lazy(() => import('./pages/publico/PublicEvent'))
const PanelLayout = lazy(() => import('./pages/painel/PanelLayout'))
const Events = lazy(() => import('./pages/painel/Events'))
const EventForm = lazy(() => import('./pages/painel/EventForm'))
const EventDetail = lazy(() => import('./pages/painel/EventDetail'))
const Guests = lazy(() => import('./pages/painel/Guests'))
const Gifts = lazy(() => import('./pages/painel/Gifts'))
const GiftDetail = lazy(() => import('./pages/painel/GiftDetail'))
const StatsPage = lazy(() => import('./pages/painel/StatsPage'))
const Notifications = lazy(() => import('./pages/painel/Notifications'))
const Settings = lazy(() => import('./pages/painel/Settings'))
const Help = lazy(() => import('./pages/Help').then((m) => ({ default: m.Help })))
const Terms = lazy(() => import('./pages/legal/Legal').then((m) => ({ default: m.Terms })))
const Privacy = lazy(() => import('./pages/legal/Legal').then((m) => ({ default: m.Privacy })))
const Cookies = lazy(() => import('./pages/legal/Legal').then((m) => ({ default: m.Cookies })))
const NotFound = lazy(() => import('./pages/NotFound'))

function RequireAuth() {
  const me = useMe()
  const loc = useLocation()
  if (!me) return <Navigate to={`/entrar?volta=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return <Outlet />
}

function GuestOnly() {
  const [params] = useSearchParams()
  return useMe() ? <Navigate to={safeBack(params.get('volta'))} replace /> : <Outlet />
}

// Troca de página começa do topo (o BrowserRouter não faz isso sozinho); âncoras (#) ficam com o navegador.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // A seção pode ainda não ter montado (página carregando): tenta por um instante.
    let tries = 0
    const t = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el || ++tries > 20) {
        clearInterval(t)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
    return () => clearInterval(t)
  }, [pathname, hash])
  return null
}

/** Faixa do modo demonstração: no convite, lembra que é a visão do convidado; no resto, leva até ele. */
function DemoBar() {
  const { pathname } = useLocation()
  const link = 'font-semibold text-white underline underline-offset-2'
  return (
    <p className="bg-ink px-4 py-1.5 text-center text-xs text-white/85">
      {pathname.startsWith('/e/') ? (
        <>
          Você está vendo o convite como o convidado.{' '}
          <Link to="/painel" className={link}>
            Voltar ao painel
          </Link>
        </>
      ) : (
        <>
          Você está na demonstração: nada sai deste navegador.{' '}
          <Link to="/e/demo" className={link}>
            Abra o convite
          </Link>{' '}
          para ver o que o convidado vê.
        </>
      )}
    </p>
  )
}

export default function App() {
  return (
    <>
      {DEMO && <DemoBar />}
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<GuestOnly />}>
            <Route path="/entrar" element={<Login />} />
            <Route path="/criar-conta" element={<Register />} />
          </Route>
          <Route path="/e/:slug" element={<PublicEvent />} />
          <Route path="/ajuda" element={<Help />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route element={<RequireAuth />}>
            <Route path="/painel" element={<PanelLayout />}>
              <Route index element={<Events />} />
              <Route path="eventos/novo" element={<EventForm />} />
              <Route path="eventos/:id" element={<EventDetail />} />
              <Route path="eventos/:id/editar" element={<EventForm />} />
              <Route path="convidados" element={<Guests />} />
              <Route path="presentes" element={<Gifts />} />
              <Route path="presentes/:eventId/:giftId" element={<GiftDetail />} />
              <Route path="estatisticas" element={<StatsPage />} />
              <Route path="notificacoes" element={<Notifications />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Helpers />
      <Toaster />
    </>
  )
}
