import { BarChart3 } from 'lucide-react'
import { AdSlot } from '../../components/AdSlot'
import { StatsView } from '../../components/StatsView'
import { ButtonLink, Empty, ErrorBox, Spinner } from '../../components/ui'
import { useEvents, useStats } from '../../lib/queries'
import { PageTitle } from './Events'

export default function StatsPage() {
  const stats = useStats()
  const events = useEvents()
  return (
    <>
      <PageTitle title="Números" subtitle="Somando todos os seus eventos." />
      {stats.isPending || events.isPending ? (
        <Spinner />
      ) : stats.error ? (
        <ErrorBox error={stats.error} onRetry={() => stats.refetch()} />
      ) : !events.data?.length ? (
        <Empty
          icon={<BarChart3 className="size-6" />}
          title="Sem números ainda"
          text="Quando os convidados começarem a responder, tudo aparece aqui."
          action={<ButtonLink to="/painel/eventos/novo">Criar evento</ButtonLink>}
        />
      ) : (
        <StatsView s={stats.data} scope="all" />
      )}
      <div className="mt-8">
        <AdSlot />
      </div>
    </>
  )
}
