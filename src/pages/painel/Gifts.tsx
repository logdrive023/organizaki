import { GiftManager } from '../../components/GiftManager'
import { ButtonLink, ErrorBox, Spinner } from '../../components/ui'
import { useEvents, useGifts } from '../../lib/queries'
import { PageTitle } from './Events'

export default function Gifts() {
  const gifts = useGifts()
  const events = useEvents()
  return (
    <>
      <PageTitle title="Presentes" subtitle="As listas de presentes de todos os seus eventos." />
      {gifts.isPending || events.isPending ? (
        <Spinner />
      ) : gifts.error || events.error ? (
        <ErrorBox error={gifts.error ?? events.error} onRetry={() => gifts.refetch()} />
      ) : events.data.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-muted">Crie um evento para montar a lista de presentes.</p>
          <ButtonLink to="/painel/eventos/novo">Criar evento</ButtonLink>
        </div>
      ) : (
        <GiftManager gifts={gifts.data} events={events.data} />
      )}
    </>
  )
}
