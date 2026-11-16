import { GuestManager } from '../../components/GuestManager'
import { ButtonLink, ErrorBox, Spinner } from '../../components/ui'
import { useEvents, useGuests } from '../../lib/queries'
import { PageTitle } from './Events'

export default function Guests() {
  const guests = useGuests()
  const events = useEvents()
  return (
    <>
      <PageTitle title="Convidados" subtitle="Todos os convidados, de todos os eventos." />
      {guests.isPending || events.isPending ? (
        <Spinner />
      ) : guests.error || events.error ? (
        <ErrorBox error={guests.error ?? events.error} onRetry={() => guests.refetch()} />
      ) : events.data.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-muted">Crie um evento antes de convidar alguém.</p>
          <ButtonLink to="/painel/eventos/novo">Criar evento</ButtonLink>
        </div>
      ) : (
        <GuestManager guests={guests.data} events={events.data} />
      )}
    </>
  )
}
