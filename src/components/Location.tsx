import { MapPin, Navigation } from 'lucide-react'
import { Card } from './ui'

const enc = encodeURIComponent

/** Links "um toque": já abrem o app de navegação com o destino e a rota a partir de onde a pessoa está. */
export const wazeUrl = (place: string) => `https://waze.com/ul?q=${enc(place)}&navigate=yes`
export const gmapsRouteUrl = (place: string) => `https://www.google.com/maps/dir/?api=1&destination=${enc(place)}`

/**
 * Onde é a festa: mapa do local e os dois botões de rota (Waze e Google Maps). O mapa é do Google (embed sem chave) e só carrega
 * quando o cartão chega perto da tela (loading="lazy"); a Política de Cookies explica.
 */
export function Location({ place, compact }: { place: string; compact?: boolean }) {
  if (!place) return null
  return (
    <Card className="overflow-hidden">
      <div className={compact ? 'h-40' : 'h-56 sm:h-64'}>
        <iframe
          title={`Mapa: ${place}`}
          src={`https://maps.google.com/maps?q=${enc(place)}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full border-0 grayscale-[25%]"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-blush text-brand-dark">
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-brand uppercase">Onde vai ser</p>
            <p className="mt-0.5 font-medium">{place}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={wazeUrl(place)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#33ccff] whitespace-nowrap px-3 text-sm font-semibold text-[#062f3d] shadow-sm hover:brightness-95"
          >
            <WazeIcon /> Waze
          </a>
          <a
            href={gmapsRouteUrl(place)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-card whitespace-nowrap px-3 text-sm font-semibold shadow-sm hover:bg-soft"
          >
            <Navigation className="size-4 text-[#1a73e8]" /> Google Maps
          </a>
        </div>
      </div>
    </Card>
  )
}

function WazeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16.5C3.6 15.6 3 14.3 3 12.6 3 7.9 7 4 12 4s9 3.9 9 8.6c0 3.3-2 5.4-5 6.3" />
      <path d="M9.5 18.6c1 .3 2 .4 3.1.3" />
      <circle cx="7.5" cy="18.5" r="1.6" fill="currentColor" />
      <circle cx="15" cy="18.5" r="1.6" fill="currentColor" />
      <circle cx="9.5" cy="11" r=".9" fill="currentColor" />
      <circle cx="14.5" cy="11" r=".9" fill="currentColor" />
      <path d="M10 14c1.2 1 2.8 1 4 0" />
    </svg>
  )
}
