import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMe } from '../lib/session'

/**
 * Espaço de anúncio do plano grátis. Hoje mostra só o anúncio da casa (Premium); a rede de anúncios entra aqui
 * depois, atrás desta mesma peça — sem chave no código. Quem é Premium e desligou não vê nada.
 */
export function AdSlot() {
  const me = useMe()
  if (!me?.adsVisible) return null
  return (
    <aside className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-line bg-card p-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Anúncio">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Anúncio</span>
        <p className="text-sm">
          <Sparkles className="mr-1 inline size-4 text-brand" />
          Seu painel sem anúncios por <strong>R$ 10,00</strong>, pagamento único.
        </p>
      </div>
      <Link to="/painel/configuracoes?aba=premium" className="text-sm font-semibold text-brand-dark hover:underline">
        Quero o Premium
      </Link>
    </aside>
  )
}
