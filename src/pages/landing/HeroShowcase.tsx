import clsx from 'clsx'
import { CalendarDays, Check, Heart, MapPin, Navigation } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card } from '../../components/ui'
import { money } from '../../lib/format'
import { asset } from '../../lib/paths'
import { activity, showcase } from './showcase'

const SLIDE_MS = 4800
const GIFT_MS = 1600

const reduceMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Convite de exemplo que muda sozinho: tipo de evento, casal, data, foto, local e presentes.
 * Para quando o mouse passa por cima (dá tempo de ler) e com "reduzir movimento" troca sem animação.
 */
export function HeroShowcase() {
  const [i, setI] = useState(0)
  const [round, setRound] = useState(0)
  const [gift, setGift] = useState(0)
  const [paused, setPaused] = useState(false)
  const s = showcase[i]
  const cover = s.covers[round % s.covers.length]

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setI((n) => {
        const next = (n + 1) % showcase.length
        if (next === 0) setRound((r) => r + 1)
        return next
      })
      setGift(0)
    }, SLIDE_MS)
    return () => clearInterval(t)
  }, [paused])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setGift((n) => (n + 1) % 3), GIFT_MS)
    return () => clearInterval(t)
  }, [paused, i])

  // Pré-carrega a próxima capa: a troca não pisca em branco.
  useEffect(() => {
    const n = showcase[(i + 1) % showcase.length]
    const img = new Image()
    img.src = asset(`img/vitrine/${n.covers[round % n.covers.length]}.webp`)
  }, [i, round])

  // Fade forte só na foto; o texto entra de leve (parte de 40%), para o cartão nunca piscar vazio.
  const fade = reduceMotion() ? '' : 'animate-[fadein_.6s_ease]'
  const soft = reduceMotion() ? '' : 'animate-[fadesoft_.35s_ease]'
  const g = s.gifts[gift]

  return (
    <div className="relative mx-auto w-full max-w-sm" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-soft via-paper to-soft blur-2xl" aria-hidden />
      <Card className="overflow-hidden shadow-2xl shadow-brand/10">
        <div className="relative h-48 overflow-hidden">
          <img key={cover + i} src={asset(`img/vitrine/${cover}.webp`)} alt="" className={clsx('h-full w-full object-cover', fade)} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-dark uppercase backdrop-blur">
            {s.type}
          </span>
          <p key={'a' + i} className={clsx('absolute right-3 bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-medium shadow', soft)}>
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ok text-white">
              <Check className="size-3" />
            </span>
            {activity[i % activity.length]}
          </p>
        </div>
        <div key={'b' + i} className={clsx('space-y-4 p-5', soft)}>
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand uppercase">Faltam {s.daysLeft} dias</p>
            <h3 className="mt-1 text-xl leading-snug font-semibold">{s.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays className="size-4" /> {s.when}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4" /> {s.place}
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-ink">
                <Navigation className="size-3" /> Rota
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-xl bg-ok-soft py-2.5 font-semibold text-ok">Vou! 🎉</div>
            <div className="rounded-xl bg-soft py-2.5 font-semibold text-muted">Não poderei</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line p-2.5">
            <img key={g.img + gift} src={asset(`img/${g.img}.webp`)} alt="" className="size-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{g.name}</p>
              <p className="text-xs text-muted">{money(g.priceCents)}</p>
            </div>
            <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">Escolher</span>
          </div>
        </div>
      </Card>
      <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Convites de exemplo">
        {showcase.map((x, n) => (
          <button
            key={x.title}
            role="tab"
            aria-selected={n === i}
            aria-label={x.title}
            onClick={() => {
              setI(n)
              setGift(0)
            }}
            className={clsx('h-1.5 rounded-full transition-all', n === i ? 'w-6 bg-brand' : 'w-1.5 bg-line hover:bg-muted/40')}
          />
        ))}
      </div>
      <Heart className="absolute -top-3 -right-2 size-8 rotate-12 fill-brand-soft text-brand/40" aria-hidden />
    </div>
  )
}
