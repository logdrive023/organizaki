import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, ExternalLink, Gift as GiftIcon, Pencil, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GiftModal } from '../../components/GiftManager'
import { toast } from '../../components/toast'
import { Badge, Button, Card, Confirm, ErrorBox, Progress, Spinner } from '../../components/ui'
import { del, errorMessage, get } from '../../lib/api'
import { money, relativeTime } from '../../lib/format'
import { useEvents, useInvalidateAll } from '../../lib/queries'
import type { Gift, Reservation } from '../../lib/types'

export default function GiftDetail() {
  const { eventId = '', giftId = '' } = useParams()
  const gift = useQuery({ queryKey: ['gifts', eventId, giftId], queryFn: () => get<Gift>(`/events/${eventId}/gifts/${giftId}`) })
  const events = useEvents()
  const navigate = useNavigate()
  const invalidate = useInvalidateAll()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [releasing, setReleasing] = useState<Reservation | null>(null)
  const [busy, setBusy] = useState(false)

  if (gift.isPending) return <Spinner />
  if (gift.error) return <ErrorBox error={gift.error} />
  const g = gift.data
  const reservations = g.reservations ?? []

  async function run(fn: () => Promise<unknown>, ok: string, after?: () => void) {
    setBusy(true)
    try {
      await fn()
      toast.ok(ok)
      invalidate()
      after?.()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to={`/painel/eventos/${eventId}?aba=presentes`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> {g.eventTitle}
      </Link>
      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-square bg-soft">
            {g.imageUrl ? <img src={g.imageUrl} alt="" className="h-full w-full object-cover" /> : <GiftIcon className="absolute inset-0 m-auto size-12 text-muted/40" />}
          </div>
        </Card>
        <div>
          {g.reserved >= g.quantity ? <Badge tone="ok">Totalmente escolhido</Badge> : g.reserved > 0 ? <Badge tone="wait">Parcialmente escolhido</Badge> : <Badge>Disponível</Badge>}
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{g.name}</h1>
          {g.description && <p className="mt-2 text-muted">{g.description}</p>}
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ['Preço', g.priceCents ? money(g.priceCents) : 'Livre'],
              ['Escolhidos', `${g.reserved}/${g.quantity}`],
              ['Comprados', String(g.purchased)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-soft p-3">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <Progress value={g.reserved / g.quantity} tone="ok" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Editar
            </Button>
            {g.storeUrl && (
              <a href={g.storeUrl} target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-card px-4 text-sm font-semibold hover:bg-soft">
                <ExternalLink className="size-4" /> Ver na loja
              </a>
            )}
            <Button variant="ghost" className="text-no" onClick={() => setDeleting(true)}>
              <Trash2 className="size-4" /> Excluir
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-sans text-base font-semibold">Quem escolheu</h2>
        {reservations.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Ninguém escolheu este presente ainda.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {reservations.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand-dark">{r.guestName.charAt(0).toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.guestName}</p>
                  <p className="truncate text-sm text-muted">
                    {r.guestEmail} · {relativeTime(r.createdAt)}
                  </p>
                </div>
                {r.purchasedAt && (
                  <Badge tone="ok">
                    <Check className="size-3" /> Comprou
                  </Badge>
                )}
                <button onClick={() => setReleasing(r)} className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label={`Liberar escolha de ${r.guestName}`}>
                  <Undo2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <GiftModal gift={editing ? g : null} events={events.data ?? []} eventId={eventId} fixedEvent onClose={() => setEditing(false)} />
      <Confirm
        open={deleting}
        title="Excluir presente?"
        text={reservations.length ? `${reservations.length} pessoa(s) já escolheram este presente. A escolha delas também some.` : 'O presente sai da lista do evento.'}
        confirmLabel="Excluir"
        loading={busy}
        onConfirm={() => run(() => del(`/events/${eventId}/gifts/${giftId}`), 'Presente excluído.', () => navigate(`/painel/eventos/${eventId}?aba=presentes`, { replace: true }))}
        onClose={() => setDeleting(false)}
      />
      <Confirm
        open={!!releasing}
        title="Liberar esta escolha?"
        text={`O presente volta a ficar disponível. Use quando ${releasing?.guestName} avisar que desistiu.`}
        confirmLabel="Liberar"
        loading={busy}
        onConfirm={() =>
          releasing &&
          run(() => del(`/events/${eventId}/gifts/${giftId}/reservations/${releasing.id}`), 'Escolha liberada.', () => {
            setReleasing(null)
            gift.refetch()
          })
        }
        onClose={() => setReleasing(null)}
      />
    </div>
  )
}
