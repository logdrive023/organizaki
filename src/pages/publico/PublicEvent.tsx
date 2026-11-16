import { useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { CalendarDays, Check, ExternalLink, Gift, Heart, MapPin, Navigation, Share2, Undo2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Confetti, HandHeart, Sprig } from '../../components/Decor'
import { Kiki } from '../../components/Kiki'
import { Location } from '../../components/Location'
import { toast } from '../../components/toast'
import { Badge, Button, ButtonLink, Card, Empty, ErrorBox, Input, Logo, Modal, Progress, Spinner, Tabs, Textarea } from '../../components/ui'
import { ApiError, errorMessage, fieldErrors, get, post } from '../../lib/api'
import { countdown, longDate, money } from '../../lib/format'
import { appUrl } from '../../lib/paths'
import { dropTicket, isPurchasedHere, markPurchasedHere, saveTicket, ticketFor } from '../../lib/tickets'
import type { InvitePreview, PublicEvent as PublicEventT, PublicGift, Ticket } from '../../lib/types'

type Tab = 'info' | 'presentes' | 'presenca'

export default function PublicEvent() {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const invite = params.get('convite') ?? ''
  const [tab, setTab] = useState<Tab>(invite ? 'presenca' : 'info')
  const event = useQuery({ queryKey: ['public', slug], queryFn: () => get<PublicEventT>(`/public/events/${slug}`) })

  useEffect(() => {
    if (event.data) document.title = `${event.data.title} · Organizaki`
  }, [event.data])

  if (event.isPending) return <Spinner label="Abrindo o convite…" />
  if (event.error) return <Unavailable error={event.error} />
  const e = event.data

  async function share() {
    const url = appUrl(`/e/${slug}`)
    try {
      if (navigator.share) await navigator.share({ title: e.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.ok('Link copiado!')
      }
    } catch {
      /* a pessoa cancelou o compartilhamento */
    }
  }

  const goTo = (t: Tab, anchor = 'abas') => {
    setTab(t)
    requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="min-h-dvh pb-28 sm:pb-16">
      {/* Capa: o convite começa pela foto, com o nome do evento por cima */}
      <header className="relative flex min-h-[26rem] flex-col justify-end overflow-hidden sm:min-h-[32rem]">
        {e.coverUrl ? (
          <img src={e.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="aura absolute inset-0">
            <Confetti />
          </div>
        )}
        <div className={clsx('absolute inset-0', e.coverUrl ? 'bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10' : 'bg-gradient-to-t from-paper/0 to-transparent')} />
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
          <Link to="/" className="rounded-full bg-paper/90 px-3 py-1.5 shadow-sm backdrop-blur" aria-label="Organizaki">
            <Logo className="text-base [&_svg]:size-5" />
          </Link>
          <button onClick={share} className="grid size-10 place-items-center rounded-full bg-paper/90 shadow-sm backdrop-blur" aria-label="Compartilhar evento">
            <Share2 className="size-5" />
          </button>
        </div>
        <div className={clsx('enter relative mx-auto w-full max-w-3xl px-5 pt-24 pb-10', e.coverUrl ? 'text-white' : 'text-ink')}>
          <p className={clsx('font-display text-lg italic', e.coverUrl ? 'text-white/85' : 'text-brand')}>Você está convidado(a) para</p>
          <h1 className="mt-1 text-4xl leading-[1.05] font-semibold sm:text-6xl">{e.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-brand px-3 py-1 font-semibold text-white shadow-sm">{countdown(e.date)}</span>
            <span className={clsx('rounded-full px-3 py-1 backdrop-blur', e.coverUrl ? 'bg-white/15' : 'bg-card/80')}>com carinho, {e.hostName}</span>
          </div>
        </div>
      </header>

      <div className="relative mx-auto -mt-6 max-w-3xl space-y-6 px-4">
        {/* Quando × Onde */}
        <Card className="enter grid divide-y divide-line shadow-xl shadow-ink/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="flex items-start gap-3 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-dark">
              <CalendarDays className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Quando</p>
              <p className="mt-0.5 font-semibold first-letter:uppercase">{longDate(e.date)}</p>
              {e.time && <p className="text-sm text-muted">às {e.time.replace(':', 'h')}</p>}
            </div>
          </div>
          <button onClick={() => goTo('info', 'local')} disabled={!e.location} className="flex items-start gap-3 p-5 text-left enabled:hover:bg-soft/60">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blush text-brand-dark">
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Onde</p>
              <p className="mt-0.5 font-semibold">{e.location || 'Local a confirmar'}</p>
              {e.location && <p className="text-sm font-medium text-brand-dark">Ver mapa e como chegar →</p>}
            </div>
          </button>
        </Card>

        {e.confirmed > 0 && (
          <p className="flex items-center justify-center gap-1.5 text-sm text-ok">
            <Heart className="size-4 fill-ok/20" /> {e.confirmed} {e.confirmed === 1 ? 'pessoa já confirmou' : 'pessoas já confirmaram'}
          </p>
        )}

        <div id="abas" className="scroll-mt-4">
          <Tabs<Tab>
            value={tab}
            onChange={setTab}
            stretch
            tabs={[
              { id: 'info', label: 'Convite' },
              { id: 'presentes', label: 'Presentes' },
              { id: 'presenca', label: 'Confirmar' },
            ]}
          />
        </div>

        <div>
          {tab === 'info' && (
            <div className="space-y-6">
              <Card className="relative overflow-hidden p-6 sm:p-8">
                <Sprig className="absolute -right-4 -bottom-4 size-28 text-brand/20" />
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-brand uppercase">
                  <HandHeart className="size-5 text-brand" /> Um recado de {e.hostName}
                </p>
                {e.description ? (
                  <p className="relative mt-3 font-display text-xl leading-relaxed whitespace-pre-line">{e.description}</p>
                ) : (
                  <p className="mt-3 text-muted">Os detalhes chegam em breve. Enquanto isso, já dá para confirmar presença.</p>
                )}
                <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button onClick={() => goTo('presenca')}>Confirmar presença</Button>
                  <Button variant="secondary" onClick={() => goTo('presentes')}>
                    <Gift className="size-4" /> Ver a lista de presentes
                  </Button>
                </div>
              </Card>
              {e.location && (
                <div id="local" className="scroll-mt-4">
                  <Location place={e.location} />
                </div>
              )}
            </div>
          )}
          {tab === 'presentes' && <GiftList slug={slug} />}
          {tab === 'presenca' && <RSVPForm slug={slug} invite={invite} onGifts={() => goTo('presentes')} />}
        </div>

        <p className="flex items-center justify-center gap-1.5 pt-6 text-xs text-muted">
          Feito com <Heart className="size-3.5 fill-brand text-brand" /> no Organizaki
        </p>
      </div>

      {/* Barra fixa no celular: as duas coisas que o convidado mais quer fazer */}
      {tab !== 'presenca' && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => goTo('presenca')}>Vou! 🎉</Button>
            {e.location ? (
              <Button variant="secondary" onClick={() => goTo('info', 'local')}>
                <Navigation className="size-4" /> Como chegar
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => goTo('presentes')}>
                Presentes
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Unavailable({ error }: { error: unknown }) {
  const unpublished = error instanceof ApiError && error.code === 'event_unpublished'
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <Logo />
      <h1 className="mt-10 text-2xl font-semibold">{unpublished ? 'Esse convite ainda não saiu' : 'Não achamos esse evento'}</h1>
      <p className="mt-2 text-muted">{errorMessage(error)}</p>
      <ButtonLink to="/" variant="secondary" className="mt-8">
        Conhecer o Organizaki
      </ButtonLink>
    </div>
  )
}

function RSVPForm({ slug, invite, onGifts }: { slug: string; invite: string; onGifts: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', email: '', phone: '', companions: 0, message: '' })
  const [status, setStatus] = useState<'confirmed' | 'declined' | ''>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<'confirmed' | 'declined' | null>(null)
  const preview = useQuery({
    queryKey: ['invite', slug, invite],
    queryFn: () => get<InvitePreview>(`/public/events/${slug}/invites/${invite}`),
    enabled: !!invite,
    retry: false,
  })

  useEffect(() => {
    const p = preview.data
    if (!p) return
    setForm({ name: p.name, email: p.email, phone: p.phone, companions: p.companions, message: p.message })
    if (p.status !== 'pending') setStatus(p.status)
  }, [preview.data])

  const set = (k: 'name' | 'email' | 'phone' | 'message') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!status) {
      setErrors({ status: 'Diga se você vai.' })
      return
    }
    setLoading(true)
    setErrors({})
    try {
      await post(`/public/events/${slug}/rsvp`, { ...form, status, inviteToken: preview.data ? invite : '' })
      setDone(status)
      qc.invalidateQueries({ queryKey: ['public', slug] })
    } catch (err) {
      const f = fieldErrors(err)
      if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Card className="p-8 text-center">
        <div className="relative mx-auto w-fit">
          {done === 'confirmed' && <Confetti />}
          <Kiki mood={done === 'confirmed' ? 'uau' : 'feliz'} size={88} className="enter" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">{done === 'confirmed' ? 'Presença confirmada!' : 'Resposta enviada'}</h2>
        <p className="mt-2 text-muted">{done === 'confirmed' ? 'Que alegria! Os anfitriões já foram avisados.' : 'Obrigado por avisar. Os anfitriões vão sentir sua falta.'}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={onGifts}>
            <Gift className="size-4" /> Escolher um presente
          </Button>
          <Button variant="secondary" onClick={() => setDone(null)}>
            Mudar minha resposta
          </Button>
        </div>
      </Card>
    )
  }

  if (invite && preview.isPending) return <Spinner label="Abrindo seu convite…" />

  return (
    <Card className="p-5 sm:p-8">
      <h2 className="text-2xl font-semibold">{preview.data ? `Oi, ${preview.data.name.split(' ')[0]}!` : 'Você vai?'}</h2>
      <p className="mt-1 text-sm text-muted">Sua resposta vai direto para quem convidou. Dá para mudar depois.</p>
      {preview.error && <p className="mt-3 rounded-xl bg-wait-soft p-3 text-sm text-wait">{errorMessage(preview.error)}</p>}
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div role="radiogroup" aria-label="Você vai?" className="grid grid-cols-2 gap-2">
          {(
            [
              ['confirmed', 'Vou! 🎉'],
              ['declined', 'Não poderei'],
            ] as const
          ).map(([v, label]) => (
            <button
              type="button"
              key={v}
              role="radio"
              aria-checked={status === v}
              onClick={() => setStatus(v)}
              className={clsx(
                'h-12 rounded-xl border text-sm font-semibold transition-colors',
                status === v ? (v === 'confirmed' ? 'border-ok bg-ok-soft text-ok' : 'border-ink bg-soft') : 'border-line bg-card hover:bg-soft',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.status && <p className="text-sm text-no">{errors.status}</p>}
        <Input label="Seu nome" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Input label="Seu e-mail" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} hint="Só os anfitriões veem." />
        <Input label="Telefone (opcional)" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
        {status === 'confirmed' && (
          <Input
            label="Quantos acompanhantes vão com você?"
            type="number"
            min={0}
            max={10}
            inputMode="numeric"
            value={form.companions}
            onChange={(e) => setForm({ ...form, companions: Math.max(0, Math.min(10, Number(e.target.value) || 0)) })}
            error={errors.companions}
            hint="Sem contar você. Coloque 0 se for sozinho(a)."
          />
        )}
        <Textarea label="Recado para os anfitriões (opcional)" value={form.message} onChange={set('message')} error={errors.message} rows={3} />
        <Button type="submit" className="w-full" loading={loading}>
          Enviar resposta
        </Button>
      </form>
    </Card>
  )
}

function GiftList({ slug }: { slug: string }) {
  const qc = useQueryClient()
  const gifts = useQuery({ queryKey: ['public-gifts', slug], queryFn: () => get<PublicGift[]>(`/public/events/${slug}/gifts`) })
  const [choosing, setChoosing] = useState<PublicGift | null>(null)
  const [, force] = useState(0)
  const refresh = () => {
    force((n) => n + 1)
    qc.invalidateQueries({ queryKey: ['public-gifts', slug] })
  }

  if (gifts.isPending) return <Spinner label="Carregando a lista…" />
  if (gifts.error) return <ErrorBox error={gifts.error} onRetry={() => gifts.refetch()} />
  if (gifts.data.length === 0) return <Empty icon={<Gift className="size-6" />} title="A lista ainda está vazia" text="Os anfitriões ainda não colocaram presentes. Volte daqui a pouco!" />

  return (
    <>
      <p className="mb-4 text-sm text-muted">Escolha um presente para avisar os anfitriões e evitar repetidos. A compra é na loja que preferir.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {gifts.data.map((g) => (
          <GiftCard key={g.id} gift={g} onChoose={() => setChoosing(g)} onChanged={refresh} />
        ))}
      </div>
      <ReserveModal slug={slug} gift={choosing} onClose={() => setChoosing(null)} onDone={refresh} />
    </>
  )
}

function GiftCard({ gift: g, onChoose, onChanged }: { gift: PublicGift; onChoose: () => void; onChanged: () => void }) {
  const stored = ticketFor(g.id)
  const check = useQuery({
    queryKey: ['ticket', stored?.reservationId],
    enabled: !!stored,
    retry: false,
    queryFn: async () => {
      try {
        return await post<{ purchased: boolean }>(`/public/reservations/${stored!.reservationId}/check`, { token: stored!.token })
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          dropTicket(g.id)
          onChanged()
          return null
        }
        throw e
      }
    },
  })
  const ticket = stored && check.data !== null ? stored : undefined
  const purchased = !!check.data?.purchased || (ticket ? isPurchasedHere(ticket.reservationId) : false)
  const left = g.quantity - g.reserved
  const [busy, setBusy] = useState(false)

  async function act(kind: 'cancel' | 'purchased', t: Ticket) {
    setBusy(true)
    try {
      await post(`/public/reservations/${t.reservationId}/${kind}`, { token: t.token })
      if (kind === 'cancel') {
        dropTicket(g.id)
        toast.ok('Escolha desfeita. O presente voltou para a lista.')
      } else {
        markPurchasedHere(t.reservationId)
        check.refetch()
        toast.ok('Marcado como comprado. Obrigado!')
      }
      onChanged()
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) dropTicket(g.id)
      toast.error(errorMessage(e))
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-soft">
        {g.imageUrl ? <img src={g.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Gift className="absolute inset-0 m-auto size-10 text-muted/50" />}
        {ticket && (
          <span className="absolute top-3 left-3">
            <Badge tone="ok">
              <Check className="size-3" /> {purchased ? 'Você comprou' : 'Você escolheu'}
            </Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-sans text-base font-semibold">{g.name}</h3>
        {g.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{g.description}</p>}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold">{g.priceCents ? money(g.priceCents) : 'Valor livre'}</span>
          <span className="text-muted">{left <= 0 ? 'Já escolhido' : left === 1 ? 'Resta 1' : `${left} de ${g.quantity} disponíveis`}</span>
        </div>
        <div className="mt-2">
          <Progress value={g.reserved / g.quantity} tone="ok" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {ticket ? (
            <>
              {!purchased && (
                <Button className="flex-1" loading={busy} onClick={() => act('purchased', ticket)}>
                  Já comprei
                </Button>
              )}
              <Button variant="secondary" className="flex-1" disabled={busy} onClick={() => act('cancel', ticket)}>
                <Undo2 className="size-4" /> Desfazer
              </Button>
            </>
          ) : (
            <Button className="flex-1" disabled={left <= 0} onClick={onChoose}>
              {left > 0 ? 'Escolher este' : 'Esgotado'}
            </Button>
          )}
          {g.storeUrl && (
            <a href={g.storeUrl} target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line px-3 text-sm font-semibold hover:bg-soft">
              Loja <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

function ReserveModal({ slug, gift, onClose, onDone }: { slug: string; gift: PublicGift | null; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!gift) return
    setLoading(true)
    setErrors({})
    try {
      const t = await post<Ticket>(`/public/events/${slug}/gifts/${gift.id}/reservations`, form)
      saveTicket(t)
      toast.ok(`Pronto! ${gift.name} está reservado para você.`)
      onClose()
    } catch (err) {
      const f = fieldErrors(err)
      if (Object.keys(f).length) setErrors(f)
      else {
        toast.error(errorMessage(err))
        onClose()
      }
    } finally {
      setLoading(false)
      onDone()
    }
  }

  return (
    <Modal open={!!gift} onClose={onClose} title="Escolher presente">
      {gift && (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="flex items-center gap-3 rounded-xl bg-soft p-3">
            {gift.imageUrl && <img src={gift.imageUrl} alt="" className="size-14 rounded-lg object-cover" />}
            <div>
              <p className="font-semibold">{gift.name}</p>
              {gift.priceCents > 0 && <p className="text-sm text-muted">{money(gift.priceCents)}</p>}
            </div>
          </div>
          <Input label="Seu nome" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Seu e-mail" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} hint="Só os anfitriões veem quem escolheu." />
          <p className="text-xs text-muted">Neste aparelho você poderá desfazer a escolha ou marcar como comprado.</p>
          <Button type="submit" className="w-full" loading={loading}>
            Confirmar escolha
          </Button>
        </form>
      )}
    </Modal>
  )
}
