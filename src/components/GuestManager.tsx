import clsx from 'clsx'
import { Copy, MessageCircle, Pencil, Search, Send, Trash2, UserPlus, Users } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { del, errorMessage, fieldErrors, post, put } from '../lib/api'
import { plural, whatsappUrl } from '../lib/format'
import { useInvalidateAll } from '../lib/queries'
import type { EventItem, Guest, GuestInput, GuestStatus, Invite } from '../lib/types'
import { toast } from './toast'
import { Badge, Button, Confirm, Empty, Input, Modal, Select, Tabs, Textarea } from './ui'

const statusLabel: Record<GuestStatus, { label: string; tone: 'ok' | 'wait' | 'no' }> = {
  confirmed: { label: 'Confirmado', tone: 'ok' },
  pending: { label: 'Sem resposta', tone: 'wait' },
  declined: { label: 'Não vai', tone: 'no' },
}

type Filter = 'all' | GuestStatus

/**
 * Lista de convidados com busca, filtro, edição e convite. eventId fixo = aba do evento;
 * sem eventId = todos os eventos (com filtro por evento), e o convite agrupa por evento.
 */
export function GuestManager({ guests, events, eventId }: { guests: Guest[]; events: EventItem[]; eventId?: string }) {
  const invalidate = useInvalidateAll()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [eventFilter, setEventFilter] = useState(eventId ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<Guest | null>(null)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Guest | null>(null)
  const [invites, setInvites] = useState<{ title: string; slug: string; list: Invite[] } | null>(null)
  const [busy, setBusy] = useState(false)

  const scoped = useMemo(() => guests.filter((g) => !eventFilter || g.eventId === eventFilter), [guests, eventFilter])
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return scoped.filter((g) => (filter === 'all' || g.status === filter) && (!term || [g.name, g.email, g.phone].some((v) => v.toLowerCase().includes(term))))
  }, [scoped, filter, q])
  const count = (s: Filter) => scoped.filter((g) => s === 'all' || g.status === s).length

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  async function invite(list: Guest[]) {
    // Convite é por evento: com seleção de vários eventos, abre o do primeiro e avisa.
    const target = list[0]?.eventId
    const sameEvent = list.filter((g) => g.eventId === target)
    if (!target) return
    if (sameEvent.length < list.length) toast.error('Convites são enviados um evento por vez. Abrimos os do primeiro evento.')
    setBusy(true)
    try {
      const res = await post<Invite[]>(`/events/${target}/guests/invites`, { guestIds: sameEvent.map((g) => g.id) })
      const ev = events.find((e) => e.id === target)
      setInvites({ title: ev?.title ?? 'Evento', slug: ev?.slug ?? '', list: res })
      setSelected(new Set())
      invalidate()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!removing) return
    setBusy(true)
    try {
      await del(`/events/${removing.eventId}/guests/${removing.id}`)
      toast.ok('Convidado removido.')
      invalidate()
      setRemoving(null)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  const selectedGuests = guests.filter((g) => selected.has(g.id))
  const pendingNotInvited = scoped.filter((g) => g.status === 'pending')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setAdding(true)} disabled={!events.length}>
          <UserPlus className="size-4" /> Adicionar convidados
        </Button>
        {selectedGuests.length > 0 ? (
          <Button variant="secondary" loading={busy} onClick={() => invite(selectedGuests)}>
            <Send className="size-4" /> Convidar {plural(selectedGuests.length, 'selecionado', 'selecionados')}
          </Button>
        ) : (
          eventFilter &&
          pendingNotInvited.length > 0 && (
            <Button variant="secondary" loading={busy} onClick={() => invite(pendingNotInvited)}>
              <Send className="size-4" /> Convidar quem não respondeu ({pendingNotInvited.length})
            </Button>
          )
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: 'Todos', count: count('all') },
            { id: 'confirmed', label: 'Confirmados', count: count('confirmed') },
            { id: 'pending', label: 'Sem resposta', count: count('pending') },
            { id: 'declined', label: 'Não vão', count: count('declined') },
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
          <label className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <span className="sr-only">Buscar convidado</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, e-mail ou telefone" className="h-10 w-full rounded-xl border border-line bg-card pr-3 pl-9 text-sm sm:w-72" />
          </label>
        </div>
      </div>

      {guests.length === 0 ? (
        <Empty icon={<Users className="size-6" />} title="Ninguém na lista ainda" text="Adicione os convidados um a um ou cole uma lista inteira de uma vez." />
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-muted">Nenhum convidado com esse filtro.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {shown.map((g) => (
            <li key={g.id} className={clsx('flex items-center gap-3 px-4 py-3', selected.has(g.id) && 'bg-brand-soft/40')}>
              <input type="checkbox" checked={selected.has(g.id)} onChange={() => toggle(g.id)} className="size-4 shrink-0 accent-[var(--color-brand)]" aria-label={`Selecionar ${g.name}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{g.name}</span>
                  <Badge tone={statusLabel[g.status].tone}>{statusLabel[g.status].label}</Badge>
                  {g.status === 'confirmed' && g.companions > 0 && <span className="text-xs text-muted">+{g.companions}</span>}
                  {g.invitedAt && g.status === 'pending' && <Badge>Convidado</Badge>}
                </div>
                <p className="truncate text-sm text-muted">
                  {g.email}
                  {g.phone && ` · ${g.phone}`}
                  {!eventId && ` · ${g.eventTitle}`}
                </p>
                {g.message && <p className="mt-1 text-sm italic">“{g.message}”</p>}
              </div>
              <div className="flex shrink-0">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(g.inviteUrl)
                    toast.ok('Link do convite copiado.')
                  }}
                  className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink"
                  aria-label={`Copiar convite de ${g.name}`}
                >
                  <Copy className="size-4" />
                </button>
                <button onClick={() => setEditing(g)} className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label={`Editar ${g.name}`}>
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => setRemoving(g)} className="rounded-lg p-2 text-muted hover:bg-no-soft hover:text-no" aria-label={`Remover ${g.name}`}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddGuests open={adding} onClose={() => setAdding(false)} events={events} eventId={eventFilter || eventId || events[0]?.id || ''} fixedEvent={!!eventId} onDone={invalidate} />
      <EditGuest guest={editing} onClose={() => setEditing(null)} onDone={invalidate} />
      <Confirm
        open={!!removing}
        title="Remover convidado?"
        text={`${removing?.name} sai da lista e o link de convite dele deixa de valer.`}
        confirmLabel="Remover"
        loading={busy}
        onConfirm={remove}
        onClose={() => setRemoving(null)}
      />
      <InvitesModal data={invites} onClose={() => setInvites(null)} />
    </div>
  )
}

/** "Nome, e-mail[, telefone]" por linha; aceita ; ou tab como separador (colar do Excel). */
function parseBulk(text: string) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim())
      const email = parts.find((p) => p.includes('@')) ?? ''
      const rest = parts.filter((p) => p !== email)
      return { name: rest[0] || email.split('@')[0], email, phone: rest[1] ?? '' }
    })
}

function AddGuests({ open, onClose, events, eventId, fixedEvent, onDone }: { open: boolean; onClose: () => void; events: EventItem[]; eventId: string; fixedEvent: boolean; onDone: () => void }) {
  const [mode, setMode] = useState<'one' | 'bulk'>('one')
  const [target, setTarget] = useState(eventId)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [bulk, setBulk] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const ev = fixedEvent ? eventId : target || eventId

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      if (mode === 'one') {
        await post(`/events/${ev}/guests`, { ...form, status: 'pending', companions: 0, message: '' })
        toast.ok(`${form.name} entrou na lista.`)
        setForm({ name: '', email: '', phone: '' })
      } else {
        const rows = parseBulk(bulk)
        const res = await post<{ created: number; skipped: number }>(`/events/${ev}/guests/bulk`, { guests: rows })
        toast.ok(`${plural(res.created, 'convidado adicionado', 'convidados adicionados')}${res.skipped ? `, ${res.skipped} já estavam na lista` : ''}.`)
        setBulk('')
        onClose()
      }
      onDone()
    } catch (err) {
      const f = fieldErrors(err)
      if (mode === 'bulk' && Object.keys(f).length) {
        const [key, msg] = Object.entries(f)[0]
        const line = Number(key.split('.')[1]) + 1
        setErrors({ bulk: `Linha ${line}: ${msg}` })
      } else if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar convidados">
      <div className="mb-4">
        <Tabs<'one' | 'bulk'>
          value={mode}
          onChange={setMode}
          tabs={[
            { id: 'one', label: 'Um por vez' },
            { id: 'bulk', label: 'Colar uma lista' },
          ]}
        />
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {!fixedEvent && (
          <Select label="Evento" value={ev} onChange={(e) => setTarget(e.target.value)}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </Select>
        )}
        {mode === 'one' ? (
          <>
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} autoFocus />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input label="Telefone (opcional)" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          </>
        ) : (
          <Textarea
            label="Um convidado por linha"
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            error={errors.bulk}
            rows={8}
            placeholder={'Ana Souza, ana@email.com, (11) 99999-0000\nBruno Lima, bruno@email.com'}
            hint="Nome, e-mail e telefone (opcional), separados por vírgula. Quem já está na lista é ignorado."
          />
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button type="submit" loading={loading}>
            {mode === 'one' ? 'Adicionar' : `Importar ${parseBulk(bulk).length || ''}`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function EditGuest({ guest, onClose, onDone }: { guest: Guest | null; onClose: () => void; onDone: () => void }) {
  return (
    <Modal open={!!guest} onClose={onClose} title="Editar convidado">
      {guest && <EditGuestForm key={guest.id} guest={guest} onClose={onClose} onDone={onDone} />}
    </Modal>
  )
}

function EditGuestForm({ guest, onClose, onDone }: { guest: Guest; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState<GuestInput>({ name: guest.name, email: guest.email, phone: guest.phone, status: guest.status, companions: guest.companions, message: guest.message })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await put(`/events/${guest.eventId}/guests/${guest.id}`, form)
      toast.ok('Convidado atualizado.')
      onDone()
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
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <Input label="Telefone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Resposta" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GuestStatus })}>
          <option value="pending">Sem resposta</option>
          <option value="confirmed">Confirmado</option>
          <option value="declined">Não vai</option>
        </Select>
        <Input
          label="Acompanhantes"
          type="number"
          min={0}
          max={10}
          value={form.companions}
          onChange={(e) => setForm({ ...form, companions: Math.max(0, Math.min(10, Number(e.target.value) || 0)) })}
          error={errors.companions}
        />
      </div>
      <Textarea label="Recado" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} rows={3} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </div>
    </form>
  )
}

function InvitesModal({ data, onClose }: { data: { title: string; slug: string; list: Invite[] } | null; onClose: () => void }) {
  return (
    <Modal open={!!data} onClose={onClose} title="Convites prontos" wide>
      {data && (
        <>
          <p className="mb-4 text-sm text-muted">Cada pessoa tem um link próprio: ao abrir, o nome já vem preenchido. Mande pelo WhatsApp ou copie.</p>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {data.list.map((i) => {
              const text = `Oi, ${i.name.split(' ')[0]}! Você está convidado(a) para ${data.title}. Confirme sua presença aqui: ${i.inviteUrl}`
              return (
                <li key={i.id} className="flex flex-wrap items-center gap-2 px-3 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{i.name}</span>
                  <a href={whatsappUrl(text)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ok px-3 text-xs font-semibold text-white">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                  <a href={`mailto:${i.email}?subject=${encodeURIComponent('Convite: ' + data.title)}&body=${encodeURIComponent(text)}`} className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-xs font-semibold">
                    E-mail
                  </a>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(text)
                      toast.ok('Mensagem copiada.')
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold"
                  >
                    <Copy className="size-3.5" /> Copiar
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Modal>
  )
}
