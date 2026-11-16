import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Bell, CalendarHeart, Gift, Info, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../components/toast'
import { Button, Confirm, Empty, ErrorBox, Spinner, Tabs } from '../../components/ui'
import { del, errorMessage, post } from '../../lib/api'
import { relativeTime } from '../../lib/format'
import { useNotifications } from '../../lib/queries'
import type { AppNotification, NotificationType } from '../../lib/types'
import { PageTitle } from './Events'

const icons: Record<NotificationType, typeof Bell> = { guest: Users, gift: Gift, event: CalendarHeart, system: Info }
type Filter = 'all' | 'unread' | 'read'

export default function Notifications() {
  const list = useNotifications()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [clearing, setClearing] = useState(false)
  const items = useMemo(() => (list.data?.items ?? []).filter((n) => filter === 'all' || (filter === 'unread' ? !n.read : n.read)), [list.data, filter])
  const refresh = () => qc.invalidateQueries({ queryKey: ['notifications'] })

  async function run(fn: () => Promise<unknown>, ok?: string) {
    try {
      await fn()
      if (ok) toast.ok(ok)
      refresh()
    } catch (e) {
      toast.error(errorMessage(e))
    }
  }

  async function open(n: AppNotification) {
    if (!n.read) await run(() => post(`/notifications/${n.id}/read`))
    if (n.link) navigate(n.link)
  }

  const total = list.data?.items.length ?? 0
  const unread = list.data?.unread ?? 0

  return (
    <>
      <PageTitle
        title="Notificações"
        subtitle="Confirmações, recusas e presentes escolhidos."
        action={
          total > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" disabled={!unread} onClick={() => run(() => post('/notifications/read-all'), 'Tudo marcado como lido.')}>
                Marcar todas como lidas
              </Button>
              <Button variant="ghost" className="text-no" onClick={() => setClearing(true)}>
                Limpar
              </Button>
            </div>
          )
        }
      />
      {list.isPending ? (
        <Spinner />
      ) : list.error ? (
        <ErrorBox error={list.error} onRetry={() => list.refetch()} />
      ) : total === 0 ? (
        <Empty icon={<Bell className="size-6" />} title="Tudo calmo por aqui" text="Quando alguém confirmar presença ou escolher um presente, você fica sabendo aqui." />
      ) : (
        <>
          <Tabs<Filter>
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'all', label: 'Todas', count: total },
              { id: 'unread', label: 'Não lidas', count: unread },
              { id: 'read', label: 'Lidas', count: total - unread },
            ]}
          />
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {items.map((n) => {
              const Icon = icons[n.type]
              return (
                <li key={n.id} className={clsx('flex items-start gap-3 px-4 py-3', !n.read && 'bg-brand-soft/40')}>
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-soft text-brand">
                    <Icon className="size-4" />
                  </span>
                  <button onClick={() => open(n)} className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold">
                      {n.title} {!n.read && <span className="ml-1 inline-block size-2 rounded-full bg-brand align-middle" aria-label="não lida" />}
                    </p>
                    <p className="text-sm text-muted">{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted">{relativeTime(n.createdAt)}</p>
                  </button>
                  <button onClick={() => run(() => del(`/notifications/${n.id}`))} className="rounded-lg p-2 text-muted hover:bg-no-soft hover:text-no" aria-label="Excluir notificação">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              )
            })}
            {items.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted">Nada com esse filtro.</li>}
          </ul>
        </>
      )}
      <Confirm
        open={clearing}
        title="Limpar todas as notificações?"
        text="Elas somem da lista. Os convidados e presentes continuam como estão."
        confirmLabel="Limpar"
        onConfirm={() => run(() => del('/notifications'), 'Notificações apagadas.').then(() => setClearing(false))}
        onClose={() => setClearing(false)}
      />
    </>
  )
}
