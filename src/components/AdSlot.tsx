import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { money } from '../lib/format'
import { useMe } from '../lib/session'
import { Sprig } from './Decor'
import { Kiki } from './Kiki'

/**
 * Espaço de anúncio do plano grátis. Hoje mostra só o anúncio da casa (Premium); a rede de anúncios entra aqui
 * depois, atrás desta mesma peça — sem chave no código. Quem é Premium e desligou não vê nada.
 */
export function AdSlot() {
  const me = useMe()
  if (!me?.adsVisible) return null
  return (
    <aside aria-label="Anúncio" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rosewash via-card to-brand-soft p-5 ring-1 ring-blush sm:p-6">
      <Sprig className="absolute -right-5 -bottom-6 size-28 text-brand/15" />
      <span className="absolute top-3 right-4 text-[10px] font-semibold tracking-wider text-muted/80 uppercase">Anúncio</span>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <Kiki mood="feliz" size={60} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-tight font-semibold">Seu painel só seu, sem anúncios</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {['Pagamento único', 'Vale para todos os eventos', 'Seus convidados nunca veem anúncio'].map((t) => (
              <li key={t} className="flex items-center gap-1">
                <Check className="size-3.5 text-ok" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/painel/configuracoes?aba=premium"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
        >
          Quero por <strong>{money(me.premiumPriceCents)}</strong>
        </Link>
      </div>
    </aside>
  )
}
