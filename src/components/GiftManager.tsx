import { Gift as GiftIcon, Plus } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage, fieldErrors, post, put } from '../lib/api'
import { centsToInput, money, parseMoney } from '../lib/format'
import { useInvalidateAll } from '../lib/queries'
import type { EventItem, Gift, GiftInput } from '../lib/types'
import { ImageUpload } from './ImageUpload'
import { toast } from './toast'
import { Badge, Button, Card, Empty, Input, Modal, Progress, Select, Tabs, Textarea } from './ui'

type Filter = 'all' | 'reserved' | 'available'
type Sort = 'recent' | 'name' | 'price-desc' | 'price-asc'

export function GiftManager({ gifts, events, eventId }: { gifts: Gift[]; events: EventItem[]; eventId?: string }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('recent')
  const [eventFilter, setEventFilter] = useState(eventId ?? '')
  const [editing, setEditing] = useState<Gift | 'new' | null>(null)

  const scoped = useMemo(() => gifts.filter((g) => !eventFilter || g.eventId === eventFilter), [gifts, eventFilter])
  const shown = useMemo(() => {
    const list = scoped.filter((g) => filter === 'all' || (filter === 'reserved' ? g.reserved > 0 : g.reserved < g.quantity))
    const by: Record<Sort, (a: Gift, b: Gift) => number> = {
      recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
      name: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
      'price-desc': (a, b) => b.priceCents - a.priceCents,
      'price-asc': (a, b) => a.priceCents - b.priceCents,
    }
    return [...list].sort(by[sort])
  }, [scoped, filter, sort])
  const count = (f: Filter) => scoped.filter((g) => f === 'all' || (f === 'reserved' ? g.reserved > 0 : g.reserved < g.quantity)).length

  return (
    <div className="space-y-4">
      <Button onClick={() => setEditing('new')} disabled={!events.length}>
        <Plus className="size-4" /> Adicionar presente
      </Button>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: 'Todos', count: count('all') },
            { id: 'reserved', label: 'Escolhidos', count: count('reserved') },
            { id: 'available', label: 'Disponíveis', count: count('available') },
          ]}
        />
        <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:justify-end">
          {!eventId && (
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="h-10 rounded-xl border border-line bg-card px-3 text-sm" aria-label="Filtrar por evento">
              <option value="">Todos os eventos</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-xl border border-line bg-card px-3 text-sm" aria-label="Ordenar">
            <option value="recent">Mais recentes</option>
            <option value="name">Nome (A–Z)</option>
            <option value="price-desc">Maior preço</option>
            <option value="price-asc">Menor preço</option>
          </select>
        </div>
      </div>

      {gifts.length === 0 ? (
        <Empty icon={<GiftIcon className="size-6" />} title="Lista de presentes vazia" text="Coloque o que você gostaria de ganhar, com foto, preço e link da loja." />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-muted">Nenhum presente com esse filtro.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((g) => (
            <Card key={g.id} className="flex flex-col overflow-hidden">
              <Link to={`/painel/presentes/${g.eventId}/${g.id}`} className="relative block aspect-[4/3] bg-soft">
                {g.imageUrl ? <img src={g.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <GiftIcon className="absolute inset-0 m-auto size-10 text-muted/40" />}
                <span className="absolute top-3 left-3">
                  {g.reserved >= g.quantity ? <Badge tone="ok">Completo</Badge> : g.reserved > 0 ? <Badge tone="wait">Parcial</Badge> : <Badge>Disponível</Badge>}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link to={`/painel/presentes/${g.eventId}/${g.id}`} className="font-semibold hover:underline">
                  {g.name}
                </Link>
                {!eventId && <p className="text-xs text-muted">{g.eventTitle}</p>}
                <div className="mt-2 flex justify-between text-sm">
                  <span className="font-semibold">{g.priceCents ? money(g.priceCents) : 'Valor livre'}</span>
                  <span className="text-muted">
                    {g.reserved}/{g.quantity} escolhidos
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={g.reserved / g.quantity} tone="ok" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="h-9 flex-1" onClick={() => setEditing(g)}>
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <GiftModal gift={editing} events={events} eventId={eventFilter || eventId || events[0]?.id || ''} fixedEvent={!!eventId} onClose={() => setEditing(null)} />
    </div>
  )
}

export function GiftModal({ gift, events, eventId, fixedEvent, onClose }: { gift: Gift | 'new' | null; events: EventItem[]; eventId: string; fixedEvent: boolean; onClose: () => void }) {
  const isNew = gift === 'new'
  return (
    <Modal open={!!gift} onClose={onClose} title={isNew ? 'Novo presente' : 'Editar presente'} wide>
      {gift && <GiftForm key={isNew ? 'new' : gift.id} gift={isNew ? null : gift} events={events} eventId={eventId} fixedEvent={fixedEvent || !isNew} onClose={onClose} />}
    </Modal>
  )
}

function GiftForm({ gift, events, eventId, fixedEvent, onClose }: { gift: Gift | null; events: EventItem[]; eventId: string; fixedEvent: boolean; onClose: () => void }) {
  const invalidate = useInvalidateAll()
  const [target, setTarget] = useState(gift?.eventId ?? eventId)
  const [form, setForm] = useState({
    name: gift?.name ?? '',
    description: gift?.description ?? '',
    price: centsToInput(gift?.priceCents ?? 0),
    imageUrl: gift?.imageUrl ?? '',
    storeUrl: gift?.storeUrl ?? '',
    quantity: gift?.quantity ?? 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const priceCents = form.price.trim() ? parseMoney(form.price) : 0
    if (Number.isNaN(priceCents)) {
      setErrors({ priceCents: 'Preço inválido. Ex.: 199,90' })
      return
    }
    const body: GiftInput = { name: form.name, description: form.description, priceCents, imageUrl: form.imageUrl, storeUrl: form.storeUrl, quantity: form.quantity }
    setLoading(true)
    setErrors({})
    try {
      if (gift) await put(`/events/${gift.eventId}/gifts/${gift.id}`, body)
      else await post(`/events/${target}/gifts`, body)
      toast.ok(gift ? 'Presente atualizado.' : 'Presente adicionado à lista.')
      invalidate()
      onClose()
    } catch (err) {
      const f = fieldErrors(err)
      if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        {!fixedEvent && (
          <Select label="Evento" value={target} onChange={(e) => setTarget(e.target.value)}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </Select>
        )}
      </div>
      <ImageUpload label="Foto" value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} aspect="aspect-[4/3]" />
      <div className="space-y-4">
        <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Ex.: Jogo de taças" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Preço (R$)" inputMode="decimal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.priceCents} placeholder="199,90" />
          <Input
            label="Quantidade"
            type="number"
            min={1}
            max={999}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value) || 1) })}
            error={errors.quantity}
          />
        </div>
      </div>
      <div className="sm:col-span-2 space-y-4">
        <Input label="Link da loja (opcional)" type="url" value={form.storeUrl} onChange={(e) => setForm({ ...form, storeUrl: e.target.value })} error={errors.storeUrl} placeholder="https://" />
        <Textarea label="Descrição (opcional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={errors.description} rows={3} />
        {errors.imageUrl && <p className="text-sm text-no">{errors.imageUrl}</p>}
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {gift ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}
