import clsx from 'clsx'

/** Coração desenhado à mão (traço solto, não ícone de sistema): é o "feito com carinho" das telas. */
export function HandHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden fill="none">
      <path
        d="M24 40C14 32 4 25 4 14.5 4 8.6 8.6 4 14.3 4c4.2 0 7.6 2.3 9.7 5.9C26.1 6.3 29.5 4 33.7 4 39.4 4 44 8.6 44 14.5 44 25 34 32 24 40Z"
        fill="currentColor"
        fillOpacity=".18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Raminho de folhas, para cantos de cartões e seções. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 56C24 40 34 26 54 8" />
      <path d="M22 42c-6-1-10-6-10-12 6 1 10 6 10 12Zm8-10c-6-2-9-7-8-13 6 2 9 7 8 13Zm9-11c-5-3-7-8-5-14 5 3 7 8 5 14Z" fill="currentColor" fillOpacity=".15" />
      <path d="M26 46c1-6 6-10 12-10-1 6-6 10-12 10Zm10-11c2-6 7-9 13-8-2 6-7 9-13 8Z" fill="currentColor" fillOpacity=".15" />
    </svg>
  )
}

const dots = [
  { x: '6%', y: '18%', s: 10, r: '12deg', d: '0s', c: 'bg-brand/30' },
  { x: '92%', y: '12%', s: 8, r: '-8deg', d: '1.2s', c: 'bg-blush' },
  { x: '84%', y: '70%', s: 12, r: '20deg', d: '.6s', c: 'bg-brand/20' },
  { x: '12%', y: '78%', s: 7, r: '-15deg', d: '2s', c: 'bg-wait/25' },
  { x: '48%', y: '6%', s: 6, r: '30deg', d: '1.6s', c: 'bg-ok/25' },
]

/** Confetes discretos flutuando ao fundo (não roubam a cena; somem com "reduzir movimento"). */
export function Confetti({ className }: { className?: string }) {
  return (
    <div className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className={clsx('float absolute rounded-[3px]', d.c)}
          style={{ left: d.x, top: d.y, width: d.s, height: d.s * 1.6, animationDelay: d.d, ['--r' as string]: d.r }}
        />
      ))}
    </div>
  )
}
