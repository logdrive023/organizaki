import { Link } from 'react-router-dom'
import { money, percent, plural } from '../lib/format'
import type { Stats } from '../lib/types'
import { Card, Progress } from './ui'

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </Card>
  )
}

/** Rosca de respostas: proporção confirmados / pendentes / recusados, sem biblioteca de gráfico. */
function Donut({ s }: { s: Stats }) {
  const total = s.guests || 1
  const parts = [
    { v: s.confirmed, c: 'var(--color-ok)', l: 'Confirmados' },
    { v: s.pending, c: 'var(--color-wait)', l: 'Sem resposta' },
    { v: s.declined, c: 'var(--color-no)', l: 'Não vão' },
  ]
  let acc = 0
  const stops = parts.map((p) => {
    const start = (acc / total) * 100
    acc += p.v
    return `${p.c} ${start}% ${(acc / total) * 100}%`
  })
  return (
    <div className="flex items-center gap-6">
      <div
        className="relative size-28 shrink-0 rounded-full"
        style={{ background: s.guests ? `conic-gradient(${stops.join(',')})` : 'var(--color-soft)' }}
        role="img"
        aria-label={`${s.confirmed} confirmados, ${s.pending} sem resposta, ${s.declined} não vão`}
      >
        <div className="absolute inset-3 grid place-items-center rounded-full bg-card">
          <span className="font-display text-xl font-semibold">{percent(s.responseRate)}</span>
        </div>
      </div>
      <ul className="space-y-1.5 text-sm">
        {parts.map((p) => (
          <li key={p.l} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: p.c }} /> {p.l}: <strong>{p.v}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StatsView({ s, scope }: { s: Stats; scope: 'event' | 'all' }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Pessoas confirmadas" value={s.people} sub={`${plural(s.confirmed, 'convite', 'convites')} + acompanhantes`} />
        <Tile label="Convidados" value={s.guests} sub={`${s.pending} sem resposta`} />
        <Tile label="Taxa de confirmação" value={percent(s.confirmationRate)} />
        <Tile label="Presentes escolhidos" value={`${s.giftReserved}/${s.giftItems}`} sub={money(s.reservedCents)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-sans text-base font-semibold">Respostas</h3>
          <Donut s={s} />
        </Card>
        <Card className="p-5">
          <h3 className="font-sans text-base font-semibold">Lista de presentes</h3>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted">Progresso</span>
            <span className="font-semibold">{percent(s.giftProgress)}</span>
          </div>
          <div className="mt-2">
            <Progress value={s.giftProgress} tone="ok" />
          </div>
          <p className="mt-2 text-xs text-muted">Valor total da lista: {money(s.giftValueCents)}</p>
          <h4 className="mt-5 text-sm font-semibold">Mais escolhidos</h4>
          {s.topGifts.length ? (
            <ol className="mt-2 space-y-2 text-sm">
              {s.topGifts.map((g, i) => (
                <li key={g.id} className="flex items-center gap-2">
                  <span className="w-4 text-muted">{i + 1}.</span>
                  <Link to={`/painel/presentes/${g.eventId}/${g.id}`} className="flex-1 truncate hover:underline">
                    {g.name}
                  </Link>
                  <span className="text-muted">
                    {g.reserved}/{g.quantity}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted">{scope === 'event' ? 'Ninguém escolheu presente ainda.' : 'Nenhum presente escolhido ainda.'}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
