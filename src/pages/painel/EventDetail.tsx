import { ArrowLeft, CalendarDays, Copy, ExternalLink, EyeOff, MapPin, MessageCircle, Pencil, Rocket, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AdSlot } from '../../components/AdSlot'
import { GiftManager } from '../../components/GiftManager'
import { GuestManager } from '../../components/GuestManager'
import { StatsView } from '../../components/StatsView'
import { toast } from '../../components/toast'
import { Badge, Button, ButtonLink, Card, Confirm, ErrorBox, Spinner, Tabs } from '../../components/ui'
import { del, errorMessage, put } from '../../lib/api'
import { countdown, longDate, whatsappUrl } from '../../lib/format'
import { useEvent, useEvents, useGifts, useGuests, useInvalidateAll, useStats } from '../../lib/queries'
import type { EventItem } from '../../lib/types'

type Tab = 'resumo' | 'convidados' | 'presentes' | 'detalhes'

export default function EventDetail() {
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('aba') as Tab) || 'resumo'
  const event = useEvent(id)
  const navigate = useNavigate()
  const invalidate = useInvalidateAll()
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (event.isPending) return <Spinner />
  if (event.error) return <ErrorBox error={event.error} />
  const e = event.data
  const publicUrl = `${location.origin}/e/${e.slug}`

  async function setStatus(status: 'active' | 'draft') {
    setBusy(true)
    try {
      await put(`/events/${id}/status`, { status })
      toast.ok(status === 'active' ? 'Evento publicado! Já pode mandar o link.' : 'Evento voltou para rascunho.')
      invalidate()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    try {
      await del(`/events/${id}`)
      toast.ok('Evento excluído.')
      invalidate()
      navigate('/painel', { replace: true })
    } catch (err) {
      toast.error(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <>
      <Link to="/painel" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Eventos
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {e.status === 'active' ? <Badge tone="ok">Publicado</Badge> : <Badge tone="wait">Rascunho</Badge>}
            <span className="text-sm font-medium text-brand">{countdown(e.date)}</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{e.title}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1 first-letter:uppercase">
              <CalendarDays className="size-4" /> {longDate(e.date)}
              {e.time && `, ${e.time}`}
            </span>
            {e.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {e.location}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {e.status === 'draft' ? (
            <Button onClick={() => setStatus('active')} loading={busy}>
              <Rocket className="size-4" /> Publicar
            </Button>
          ) : (
            <a href={`/e/${e.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-card px-4 text-sm font-semibold hover:bg-soft">
              <ExternalLink className="size-4" /> Ver página
            </a>
          )}
          <ButtonLink to={`/painel/eventos/${id}/editar`} variant="secondary">
            <Pencil className="size-4" /> Editar
          </ButtonLink>
        </div>
      </div>

      {e.status === 'active' ? (
        <ShareBox url={publicUrl} event={e} />
      ) : (
        <Card className="mb-6 border-wait/30 bg-wait-soft p-4 text-sm text-wait">
          Este evento é um rascunho: o link ainda não abre para os convidados. Monte as listas e toque em <strong>Publicar</strong> quando estiver pronto.
        </Card>
      )}

      <Tabs<Tab>
        value={tab}
        onChange={(t) => setParams({ aba: t }, { replace: true })}
        tabs={[
          { id: 'resumo', label: 'Resumo' },
          { id: 'convidados', label: 'Convidados', count: e.counts.guests },
          { id: 'presentes', label: 'Presentes', count: e.counts.gifts },
          { id: 'detalhes', label: 'Detalhes' },
        ]}
      />
      <div className="mt-6">
        {tab === 'resumo' && <Summary id={id} />}
        {tab === 'convidados' && <EventGuests id={id} />}
        {tab === 'presentes' && <EventGifts id={id} />}
        {tab === 'detalhes' && (
          <Card className="space-y-4 p-5">
            {e.coverUrl && <img src={e.coverUrl} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />}
            <div>
              <h3 className="font-sans text-sm font-semibold text-muted">Recado para os convidados</h3>
              <p className="mt-1 whitespace-pre-line">{e.description || '—'}</p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              {e.status === 'active' && (
                <Button variant="secondary" onClick={() => setStatus('draft')} loading={busy}>
                  <EyeOff className="size-4" /> Voltar para rascunho
                </Button>
              )}
              <Button variant="ghost" className="text-no" onClick={() => setDeleting(true)}>
                <Trash2 className="size-4" /> Excluir evento
              </Button>
            </div>
          </Card>
        )}
      </div>
      <div className="mt-8">
        <AdSlot />
      </div>
      <Confirm
        open={deleting}
        title="Excluir este evento?"
        text="A página sai do ar e a lista de convidados, os presentes e as escolhas são apagados. Não dá para desfazer."
        confirmLabel="Excluir para sempre"
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(false)}
      />
    </>
  )
}

function ShareBox({ url, event }: { url: string; event: EventItem }) {
  return (
    <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">Link do evento</p>
        <p className="truncate font-medium">{url}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={async () => {
            await navigator.clipboard.writeText(url)
            toast.ok('Link copiado!')
          }}
        >
          <Copy className="size-4" /> Copiar
        </Button>
        <a
          href={whatsappUrl(`Você está convidado(a) para ${event.title}! Confirme sua presença e veja a lista de presentes: ${url}`)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ok px-4 text-sm font-semibold text-white"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
      </div>
    </Card>
  )
}

function Summary({ id }: { id: string }) {
  const stats = useStats(id)
  if (stats.isPending) return <Spinner />
  if (stats.error) return <ErrorBox error={stats.error} onRetry={() => stats.refetch()} />
  return <StatsView s={stats.data} scope="event" />
}

function EventGuests({ id }: { id: string }) {
  const guests = useGuests(id)
  const events = useEvents()
  if (guests.isPending || events.isPending) return <Spinner />
  if (guests.error) return <ErrorBox error={guests.error} onRetry={() => guests.refetch()} />
  return <GuestManager guests={guests.data} events={events.data ?? []} eventId={id} />
}

function EventGifts({ id }: { id: string }) {
  const gifts = useGifts(id)
  const events = useEvents()
  if (gifts.isPending || events.isPending) return <Spinner />
  if (gifts.error) return <ErrorBox error={gifts.error} onRetry={() => gifts.refetch()} />
  return <GiftManager gifts={gifts.data} events={events.data ?? []} eventId={id} />
}
