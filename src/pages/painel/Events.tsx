import { CalendarDays, CalendarHeart, Gift, MapPin, Plus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../../components/AdSlot'
import { Confetti, HandHeart, Sprig } from '../../components/Decor'
import { Badge, ButtonLink, Card, Empty, ErrorBox, Spinner, Tabs } from '../../components/ui'
import { countdown, shortDate } from '../../lib/format'
import { useEvents } from '../../lib/queries'
import { useMe } from '../../lib/session'
import type { EventItem } from '../../lib/types'

type Filter = 'all' | 'active' | 'draft'

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default function Events() {
  const me = useMe()
  const events = useEvents()
  const [filter, setFilter] = useState<Filter>('all')
  const list = useMemo(() => (events.data ?? []).filter((e) => filter === 'all' || e.status === filter), [events.data, filter])
  const count = (s: Filter) => (events.data ?? []).filter((e) => s === 'all' || e.status === s).length

  return (
    <>
      <div className="aura relative mb-6 overflow-hidden rounded-3xl border border-line px-5 py-6 sm:px-8 sm:py-8">
        <Confetti />
        <Sprig className="absolute -right-4 -bottom-6 size-32 text-brand/20" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-lg text-brand italic">Que bom te ver por aqui</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Oi, {me?.name.split(' ')[0] ?? ''}! <HandHeart className="inline size-8 -translate-y-1 rotate-12 text-brand" />
            </h1>
            <p className="mt-1 text-muted">Seus eventos, do primeiro rascunho ao grande dia.</p>
          </div>
          <ButtonLink to="/painel/eventos/novo">
            <Plus className="size-4" /> Novo evento
          </ButtonLink>
        </div>
      </div>
      {events.isPending ? (
        <Spinner />
      ) : events.error ? (
        <ErrorBox error={events.error} onRetry={() => events.refetch()} />
      ) : events.data.length === 0 ? (
        <Empty
          icon={<CalendarHeart className="size-6" />}
          title="Seu primeiro evento começa aqui"
          text="Crie a página, coloque a lista de presentes e mande o link para os convidados."
          action={<ButtonLink to="/painel/eventos/novo">Criar evento</ButtonLink>}
        />
      ) : (
        <>
          <Tabs<Filter>
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'all', label: 'Todos', count: count('all') },
              { id: 'active', label: 'Publicados', count: count('active') },
              { id: 'draft', label: 'Rascunhos', count: count('draft') },
            ]}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
          {list.length === 0 && <p className="py-10 text-center text-muted">Nenhum evento aqui.</p>}
        </>
      )}
      <div className="mt-8">
        <AdSlot />
      </div>
    </>
  )
}

function EventCard({ event: e }: { event: EventItem }) {
  return (
    <Link to={`/painel/eventos/${e.id}`} className="group block min-w-0">
      <Card className="h-full overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-brand/10">
        <div className="relative aspect-[16/9] bg-soft">
          {e.coverUrl ? <img src={e.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="aura grid h-full w-full place-items-center"><HandHeart className="size-12 text-brand/60" /></div>}
          <span className="absolute top-3 left-3">{e.status === 'active' ? <Badge tone="ok">Publicado</Badge> : <Badge tone="wait">Rascunho</Badge>}</span>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-brand">{countdown(e.date)}</p>
          <h2 className="mt-1 truncate font-sans text-lg font-semibold">{e.title}</h2>
          <div className="mt-2 space-y-1 text-sm text-muted">
            <p className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {shortDate(e.date)}
              {e.time && ` · ${e.time}`}
            </p>
            {e.location && (
              <p className="flex items-center gap-1.5 truncate">
                <MapPin className="size-4 shrink-0" /> <span className="truncate">{e.location}</span>
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-4 border-t border-line pt-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-muted" /> {e.counts.confirmed}/{e.counts.guests} confirmados
            </span>
            <span className="flex items-center gap-1.5">
              <Gift className="size-4 text-muted" /> {e.counts.giftReserved}/{e.counts.giftItems}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
