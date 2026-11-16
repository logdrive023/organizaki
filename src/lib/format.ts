// Formatação pt-BR. Datas do evento chegam como AAAA-MM-DD (sem fuso): nunca passar por new Date(str),
// que leria como UTC e mostraria o dia anterior no Brasil.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const money = (cents: number) => brl.format(cents / 100)

/** "R$ 1.299,90", "1299,9", "1299.90" → centavos; NaN quando não dá para entender. */
export function parseMoney(input: string): number {
  const clean = input.replace(/[^\d,.]/g, '')
  if (!clean) return NaN
  const lastSep = Math.max(clean.lastIndexOf(','), clean.lastIndexOf('.'))
  const hasCents = lastSep >= 0 && clean.length - lastSep - 1 <= 2
  const intPart = (hasCents ? clean.slice(0, lastSep) : clean).replace(/[,.]/g, '')
  const centPart = hasCents ? clean.slice(lastSep + 1).padEnd(2, '0') : '00'
  return Number(intPart || '0') * 100 + Number(centPart)
}

export const centsToInput = (cents: number) => (cents ? (cents / 100).toFixed(2).replace('.', ',') : '')

function localDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const longDate = (iso: string) =>
  localDate(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const shortDate = (iso: string) => localDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function daysUntil(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((localDate(iso).getTime() - today.getTime()) / 86_400_000)
}

export function countdown(iso: string) {
  const d = daysUntil(iso)
  if (d < 0) return 'Já aconteceu'
  if (d === 0) return 'É hoje!'
  if (d === 1) return 'É amanhã'
  return `Faltam ${d} dias`
}

export const todayISO = () => {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'agora'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`
  if (diff < 7 * 86400) return `há ${Math.floor(diff / 86400)} d`
  return new Date(iso).toLocaleDateString('pt-BR')
}

export const percent = (r: number) => `${Math.round(r * 100)}%`

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export const whatsappUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`
