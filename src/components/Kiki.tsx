import clsx from 'clsx'
import { useId } from 'react'

/**
 * KIKI — o mascote do Organizaki: uma caixinha de presente com laço, olhos grandes e bochechas rosadas.
 * Humores: normal (pisca de vez em quando) · feliz (olhos de sorriso) · uau (boquinha aberta, para celebrar).
 * Decorativo (aria-hidden): quem informa é o texto ao lado. Mesmo esquema da VanIA do VanAaki.
 */
export type KikiMood = 'normal' | 'feliz' | 'uau'

const INK = '#2b2420'

export function Kiki({ mood = 'normal', size = 48, className }: { mood?: KikiMood; size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false" className={clsx('kiki shrink-0', mood === 'normal' && 'kiki-pisca', className)}>
      <defs>
        <linearGradient id={`kb${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3b7ae" />
          <stop offset="1" stopColor="#e3968c" />
        </linearGradient>
        <linearGradient id={`kt${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d0675c" />
          <stop offset="1" stopColor="#b4493f" />
        </linearGradient>
      </defs>
      {/* sombra */}
      <ellipse cx="32" cy="61" rx="20" ry="2.4" fill={INK} opacity=".1" />
      {/* laço */}
      <path d="M32 15c-4-8-14-11-16-5-2 5 7 7 16 5Z" fill={`url(#kt${id})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 15c4-8 14-11 16-5 2 5-7 7-16 5Z" fill={`url(#kt${id})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="15" r="3.4" fill="#b4493f" stroke={INK} strokeWidth="2" />
      {/* tampa */}
      <rect x="7" y="17" width="50" height="11" rx="4" fill={`url(#kt${id})`} stroke={INK} strokeWidth="2.2" />
      {/* caixa */}
      <rect x="10" y="27" width="44" height="30" rx="7" fill={`url(#kb${id})`} stroke={INK} strokeWidth="2.2" />
      {/* fita */}
      <rect x="28.5" y="17" width="7" height="40" fill="#fbeae6" opacity=".9" />
      <path d="M28.5 17v40M35.5 17v40" stroke={INK} strokeWidth="1.2" opacity=".35" />
      {/* brilho */}
      <path d="M14 31h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      {/* olhos */}
      {mood === 'feliz' ? (
        <>
          <path d="M16 39q4-5 8 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 39q4-5 8 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <g className="kiki-olho">
            <ellipse cx="20" cy="38.5" rx="3.6" ry="4.2" fill={INK} />
            <circle cx="21.3" cy="37" r="1.3" fill="#fff" />
          </g>
          <g className="kiki-olho">
            <ellipse cx="44" cy="38.5" rx="3.6" ry="4.2" fill={INK} />
            <circle cx="45.3" cy="37" r="1.3" fill="#fff" />
          </g>
        </>
      )}
      {/* bochechas */}
      <ellipse cx="16" cy="46" rx="3.6" ry="2.4" fill="#e36d7e" opacity=".45" />
      <ellipse cx="48" cy="46" rx="3.6" ry="2.4" fill="#e36d7e" opacity=".45" />
      {/* boca */}
      {mood === 'uau' ? (
        <ellipse cx="32" cy="47" rx="3.2" ry="3.6" fill={INK} />
      ) : (
        <>
          <path d="M26 45.5q6 6 12 0" fill={mood === 'feliz' ? INK : 'none'} stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          {mood === 'feliz' && <path d="M29.5 48.4q2.5 1.5 5 0" fill="#e36d7e" />}
        </>
      )}
    </svg>
  )
}
