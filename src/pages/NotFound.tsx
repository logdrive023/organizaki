import { SiteLayout } from '../components/SiteLayout'
import { ButtonLink } from '../components/ui'

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-6xl font-semibold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Essa página não está na lista</h1>
        <p className="mt-2 text-muted">O link pode estar incompleto ou o evento foi removido.</p>
        <ButtonLink to="/" className="mt-8">
          Voltar ao início
        </ButtonLink>
      </div>
    </SiteLayout>
  )
}
