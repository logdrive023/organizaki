// Modo demonstração (build do GitHub Pages, VITE_DEMO=true): o "servidor" roda aqui dentro, com os dados no
// localStorage deste navegador. Segue o mesmo contrato e as mesmas regras da API Go (organizaki-backend/README.md),
// então as telas não sabem a diferença. Nada sai do navegador; limpar os dados do site zera a demonstração.
import { ApiError } from './api'
import { appUrl, asset } from './paths'
import type { AppNotification, EventItem, Gift, Guest, GuestStatus, Me, NotificationType, Reservation, Stats } from './types'

// v2: endereço real no evento demo (o mapa marcava outro lugar). Mudar a chave recria a demonstração.
const KEY = 'ok.demo.db.v2'
export const DEMO_EMAIL = 'demo@organizaki.test'
const DEMO_PASSWORD = 'organizaki123'
const PREMIUM_CENTS = 1000

interface User extends Omit<Me, 'adsVisible' | 'premiumPriceCents'> {
  password: string
}
type EventRow = Omit<EventItem, 'counts'> & { ownerId: string }
type GuestRow = Omit<Guest, 'eventTitle' | 'inviteUrl'> & { token: string; source: 'host' | 'self' }
type GiftRow = Omit<Gift, 'eventTitle' | 'reserved' | 'purchased' | 'reservations'>
type ResRow = Reservation & { giftId: string; token: string }
type NotifRow = AppNotification & { userId: string }

interface DB {
  users: User[]
  events: EventRow[]
  guests: GuestRow[]
  gifts: GiftRow[]
  reservations: ResRow[]
  notifications: NotifRow[]
}

// ---------- utilidades ----------
const now = () => new Date().toISOString()
const id = () => crypto.randomUUID()
const rand = (n: number) => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(n)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const isoDay = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const urlOk = (u: string) => !u || /^https?:\/\/[^/\s]+/i.test(u)
const imageOk = (u: string) => !u || urlOk(u) || u.startsWith('data:image/') || u.startsWith(asset('img/'))
const norm = (e: unknown) => String(e ?? '').trim().toLowerCase()
const txt = (s: unknown) => String(s ?? '').trim()

const err = {
  validation: (fields: Record<string, string>) => new ApiError(422, 'validation', 'Confira os campos destacados.', fields),
  notFound: (code: string, msg: string) => new ApiError(404, code, msg),
  conflict: (code: string, msg: string) => new ApiError(409, code, msg),
  auth: () => new ApiError(401, 'token_invalid', 'Sessão expirada. Entre de novo.'),
}
const check = (f: Record<string, string>) => {
  if (Object.keys(f).length) throw err.validation(f)
}

// ---------- banco no localStorage ----------
function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch {
    /* banco corrompido: recomeça com a demonstração */
  }
  const db = seed()
  save(db)
  return db
}
function save(db: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    throw new ApiError(507, 'storage_full', 'O armazenamento deste navegador encheu. Use imagens menores.')
  }
}

function newUser(name: string, email: string, password: string): User {
  return {
    id: id(), name, email, password, phone: '', bio: '', plan: 'free', showAds: true, createdAt: now(),
    notifications: { emailGuestConfirm: true, emailGiftReserved: true, emailEventReminder: true, emailSystemUpdates: false, inAppAll: true, inAppSound: false },
    account: { language: 'pt-BR', timezone: 'America/Sao_Paulo' },
  }
}

function seed(): DB {
  const u = newUser('Maria e João', DEMO_EMAIL, DEMO_PASSWORD)
  const ev: EventRow = {
    id: id(), ownerId: u.id, slug: 'demo', title: 'Casamento de Maria e João', status: 'active',
    description: 'Queremos você com a gente nesse dia! Cerimônia ao ar livre seguida de jantar e música ao vivo.',
    date: isoDay(60), time: '17:00', location: 'Parque Villa-Lobos, Av. Professor Fonseca Rodrigues, 2001, São Paulo - SP',
    coverUrl: asset('img/evento-casamento.webp'), createdAt: now(), updatedAt: now(),
  }
  const guests: [string, string, GuestStatus][] = [
    ['Ana Souza', 'ana.souza@exemplo.test', 'confirmed'], ['Bruno Lima', 'bruno.lima@exemplo.test', 'confirmed'],
    ['Carla Dias', 'carla.dias@exemplo.test', 'pending'], ['Diego Alves', 'diego.alves@exemplo.test', 'declined'],
    ['Elisa Rocha', 'elisa.rocha@exemplo.test', 'pending'],
  ]
  const gifts: [string, string, string, number, number][] = [
    ['Jogo de panelas antiaderentes', 'Conjunto com 5 peças, serve no fogão de indução.', 'presente-panelas', 39990, 1],
    ['Jogo de cama casal', 'Algodão 300 fios, tons claros.', 'presente-cama', 24990, 2],
    ['Cafeteira elétrica', 'Para o café da manhã de domingo.', 'presente-cafeteira', 18990, 1],
    ['Aspirador robô', 'Limpa enquanto a gente comemora.', 'presente-aspirador', 129900, 1],
    ['Vale-surpresa', 'Uma ajudinha para a lua de mel.', 'presente-caixa', 10000, 10],
  ]
  return {
    users: [u],
    events: [ev],
    guests: guests.map(([name, email, status]) => ({
      id: id(), eventId: ev.id, name, email, phone: '', status, companions: 0, message: '', token: rand(32), source: 'host',
      invitedAt: null, respondedAt: status === 'pending' ? null : now(), createdAt: now(),
    })),
    gifts: gifts.map(([name, description, img, priceCents, quantity]) => ({
      id: id(), eventId: ev.id, name, description, priceCents, quantity, imageUrl: asset(`img/${img}.webp`), storeUrl: '', createdAt: now(),
    })),
    reservations: [],
    notifications: [],
  }
}

/** Entra na conta de demonstração sem pedir senha (botão na tela de entrada); recria se a pessoa excluiu. */
export function demoSession() {
  let db = load()
  let u = db.users.find((x) => x.email === DEMO_EMAIL)
  if (!u) {
    resetDemo()
    db = load()
    u = db.users.find((x) => x.email === DEMO_EMAIL)!
  }
  return session(u)
}

/** Zera a demonstração (botão na tela de entrada). */
export function resetDemo() {
  localStorage.removeItem(KEY)
  localStorage.removeItem('ok.tickets')
  localStorage.removeItem('ok.purchased')
}

// ---------- visões (o que a API devolveria) ----------
function meOf(u: User): Me {
  const { password: _pw, ...rest } = u
  void _pw
  return { ...rest, adsVisible: u.plan !== 'premium' || u.showAds, premiumPriceCents: PREMIUM_CENTS }
}
function session(u: User) {
  return { accessToken: 'demo.' + u.id, refreshToken: 'demo.' + u.id, expiresAt: new Date(Date.now() + 365 * 86400_000).toISOString(), user: meOf(u) }
}
const reservationsOf = (db: DB, giftId: string) => db.reservations.filter((r) => r.giftId === giftId)
function giftView(db: DB, g: GiftRow, withRes = false): Gift {
  const rs = reservationsOf(db, g.id)
  const ev = db.events.find((e) => e.id === g.eventId)!
  return {
    ...g, eventTitle: ev.title, reserved: rs.length, purchased: rs.filter((r) => r.purchasedAt).length,
    ...(withRes ? { reservations: rs.map(({ giftId: _g, token: _t, ...r }) => (void _g, void _t, r)) } : {}),
  }
}
function guestView(db: DB, g: GuestRow): Guest {
  const ev = db.events.find((e) => e.id === g.eventId)!
  const { token, source: _s, ...rest } = g
  void _s
  return { ...rest, eventTitle: ev.title, inviteUrl: appUrl(`/e/${ev.slug}?convite=${token}`) }
}
function countsOf(db: DB, eventIds: string[]) {
  const gs = db.guests.filter((g) => eventIds.includes(g.eventId))
  const gifts = db.gifts.filter((g) => eventIds.includes(g.eventId))
  const confirmed = gs.filter((g) => g.status === 'confirmed')
  return {
    guests: gs.length, confirmed: confirmed.length, pending: gs.filter((g) => g.status === 'pending').length,
    declined: gs.filter((g) => g.status === 'declined').length, people: confirmed.reduce((s, g) => s + 1 + g.companions, 0),
    gifts: gifts.length, giftItems: gifts.reduce((s, g) => s + g.quantity, 0),
    giftReserved: gifts.reduce((s, g) => s + reservationsOf(db, g.id).length, 0),
  }
}
const eventView = (db: DB, e: EventRow): EventItem => {
  const { ownerId: _o, ...rest } = e
  void _o
  return { ...rest, counts: countsOf(db, [e.id]) }
}
function statsOf(db: DB, eventIds: string[], top: number): Stats {
  const c = countsOf(db, eventIds)
  const gifts = db.gifts.filter((g) => eventIds.includes(g.eventId))
  const r = (a: number, b: number) => (b ? a / b : 0)
  return {
    ...c,
    confirmationRate: r(c.confirmed, c.guests), responseRate: r(c.confirmed + c.declined, c.guests), giftProgress: r(c.giftReserved, c.giftItems),
    giftValueCents: gifts.reduce((s, g) => s + g.priceCents * g.quantity, 0),
    reservedCents: gifts.reduce((s, g) => s + g.priceCents * reservationsOf(db, g.id).length, 0),
    topGifts: gifts
      .map((g) => ({ id: g.id, eventId: g.eventId, name: g.name, quantity: g.quantity, reserved: reservationsOf(db, g.id).length }))
      .filter((g) => g.reserved > 0)
      .sort((a, b) => b.reserved - a.reserved || a.name.localeCompare(b.name))
      .slice(0, top),
  }
}

function notify(db: DB, userId: string, type: NotificationType, title: string, message: string, link: string) {
  const u = db.users.find((x) => x.id === userId)
  if (!u?.notifications.inAppAll) return
  db.notifications.unshift({ id: id(), userId, type, title, message, link, read: false, createdAt: now() })
}

// ---------- validações (as mesmas mensagens da API) ----------
function validateEvent(b: Record<string, unknown>, checkPast: boolean) {
  const f: Record<string, string> = {}
  if (!txt(b.title)) f.title = 'Dê um nome ao evento.'
  if (!txt(b.date)) f.date = 'Escolha a data.'
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(txt(b.date))) f.date = 'Data inválida.'
  else if (checkPast && txt(b.date) < isoDay()) f.date = 'A data já passou.'
  if (txt(b.time) && !/^([01]\d|2[0-3]):[0-5]\d$/.test(txt(b.time))) f.time = 'Horário inválido.'
  if (!imageOk(txt(b.coverUrl))) f.coverUrl = 'Link inválido.'
  check(f)
}
function validateGuest(b: Record<string, unknown>) {
  const f: Record<string, string> = {}
  if (!txt(b.name)) f.name = 'Informe o nome do convidado.'
  if (!txt(b.email)) f.email = 'Informe o e-mail.'
  else if (!emailOk(norm(b.email))) f.email = 'E-mail inválido.'
  const c = Number(b.companions ?? 0)
  if (!(c >= 0 && c <= 10)) f.companions = 'Entre 0 e 10 acompanhantes.'
  return f
}
function validateGift(b: Record<string, unknown>, reserved: number) {
  const f: Record<string, string> = {}
  const q = Number(b.quantity)
  if (!txt(b.name)) f.name = 'Dê um nome ao presente.'
  if (!(Number(b.priceCents) >= 0)) f.priceCents = 'Preço inválido.'
  if (!(q >= 1 && q <= 999)) f.quantity = 'A quantidade vai de 1 a 999.'
  else if (q < reserved) f.quantity = 'Já escolheram mais do que essa quantidade.'
  if (!urlOk(txt(b.storeUrl))) f.storeUrl = 'Link inválido. Use um endereço que comece com https://'
  if (!imageOk(txt(b.imageUrl))) f.imageUrl = 'Link inválido.'
  check(f)
}

// ---------- roteador ----------
type Body = Record<string, unknown>
type Ctx = { db: DB; body: Body; q: URLSearchParams; user: () => User }
type Handler = (c: Ctx, p: string[]) => unknown
const routes: [string, RegExp, Handler][] = []
const on = (method: string, pattern: string, h: Handler) =>
  routes.push([method, new RegExp('^' + pattern.replace(/:\w+/g, '([^/]+)') + '$'), h])

function ownEvent(c: Ctx, eventId: string) {
  const e = c.db.events.find((x) => x.id === eventId && x.ownerId === c.user().id)
  if (!e) throw err.notFound('event_not_found', 'Evento não encontrado.')
  return e
}
function activeBySlug(db: DB, slug: string) {
  const e = db.events.find((x) => x.slug === slug)
  if (!e) throw err.notFound('event_not_found', 'Evento não encontrado.')
  if (e.status !== 'active') throw err.notFound('event_unpublished', 'Esse evento ainda não foi publicado pelo anfitrião.')
  return e
}
function ownGift(c: Ctx, eventId: string, giftId: string) {
  ownEvent(c, eventId)
  const g = c.db.gifts.find((x) => x.id === giftId && x.eventId === eventId)
  if (!g) throw err.notFound('gift_not_found', 'Presente não encontrado.')
  return g
}
const myEventIds = (c: Ctx) => c.db.events.filter((e) => e.ownerId === c.user().id).map((e) => e.id)

// auth
on('POST', '/auth/register', ({ db, body }) => {
  const name = txt(body.name), email = norm(body.email), password = String(body.password ?? '')
  const f: Record<string, string> = {}
  if (!name) f.name = 'Conte como você se chama.'
  if (!email) f.email = 'Informe seu e-mail.'
  else if (!emailOk(email)) f.email = 'E-mail inválido.'
  if (password.length < 8) f.password = 'A senha precisa de pelo menos 8 caracteres.'
  check(f)
  if (db.users.some((u) => u.email === email)) throw err.conflict('email_taken', 'Esse e-mail já tem conta. Que tal entrar?')
  const u = newUser(name, email, password)
  db.users.push(u)
  return session(u)
})
on('POST', '/auth/login', ({ db, body }) => {
  const u = db.users.find((x) => x.email === norm(body.email) && x.password === body.password)
  if (!u) throw new ApiError(401, 'invalid_credentials', 'E-mail ou senha incorretos.')
  return session(u)
})
on('POST', '/auth/logout', () => undefined)

// conta
on('GET', '/me', (c) => meOf(c.user()))
on('PUT', '/me/profile', (c) => {
  const u = c.user(), email = norm(c.body.email)
  const f: Record<string, string> = {}
  if (!txt(c.body.name)) f.name = 'Informe seu nome.'
  if (!emailOk(email)) f.email = 'E-mail inválido.'
  if (txt(c.body.bio).length > 160) f.bio = 'Use no máximo 160 caracteres.'
  check(f)
  if (c.db.users.some((x) => x.email === email && x.id !== u.id)) throw err.conflict('email_taken', 'Esse e-mail já está em uso em outra conta.')
  Object.assign(u, { name: txt(c.body.name), email, phone: txt(c.body.phone), bio: txt(c.body.bio) })
  return meOf(u)
})
on('PUT', '/me/password', (c) => {
  const u = c.user(), cur = String(c.body.currentPassword ?? ''), next = String(c.body.newPassword ?? '')
  if (cur !== u.password) throw err.validation({ currentPassword: 'Senha atual incorreta.' })
  if (next.length < 8) throw err.validation({ newPassword: 'A nova senha precisa de pelo menos 8 caracteres.' })
  if (next === cur) throw err.validation({ newPassword: 'A nova senha precisa ser diferente da atual.' })
  u.password = next
})
on('PUT', '/me/notification-settings', (c) => {
  const u = c.user()
  u.notifications = { ...u.notifications, ...(c.body as unknown as Me['notifications']) }
  return meOf(u)
})
on('PUT', '/me/account-settings', (c) => {
  const u = c.user()
  u.account = { language: txt(c.body.language) || 'pt-BR', timezone: txt(c.body.timezone) || 'America/Sao_Paulo' }
  return meOf(u)
})
on('PUT', '/me/ads', (c) => {
  const u = c.user()
  if (u.plan !== 'premium') throw new ApiError(403, 'premium_required', 'Desligar os anúncios é do Premium.')
  u.showAds = !!c.body.showAds
  return meOf(u)
})
on('POST', '/me/premium', (c) => {
  const u = c.user()
  if (u.plan === 'premium') throw err.conflict('already_premium', 'Sua conta já é Premium.')
  Object.assign(u, { plan: 'premium', premiumSince: now(), showAds: false })
  return meOf(u)
})
on('DELETE', '/me', (c) => {
  const u = c.user()
  if (c.body.password !== u.password) throw err.validation({ password: 'Senha incorreta.' })
  const evs = myEventIds(c)
  const giftIds = c.db.gifts.filter((g) => evs.includes(g.eventId)).map((g) => g.id)
  c.db.reservations = c.db.reservations.filter((r) => !giftIds.includes(r.giftId))
  c.db.gifts = c.db.gifts.filter((g) => !evs.includes(g.eventId))
  c.db.guests = c.db.guests.filter((g) => !evs.includes(g.eventId))
  c.db.events = c.db.events.filter((e) => !evs.includes(e.id))
  c.db.notifications = c.db.notifications.filter((n) => n.userId !== u.id)
  c.db.users = c.db.users.filter((x) => x.id !== u.id)
})

// eventos
on('GET', '/events', (c) =>
  c.db.events.filter((e) => e.ownerId === c.user().id).sort((a, b) => a.date.localeCompare(b.date)).map((e) => eventView(c.db, e)),
)
on('POST', '/events', (c) => {
  validateEvent(c.body, true)
  const e: EventRow = {
    id: id(), ownerId: c.user().id, slug: rand(6), status: 'draft', title: txt(c.body.title), description: txt(c.body.description),
    date: txt(c.body.date), time: txt(c.body.time), location: txt(c.body.location), coverUrl: txt(c.body.coverUrl), createdAt: now(), updatedAt: now(),
  }
  c.db.events.push(e)
  return eventView(c.db, e)
})
on('GET', '/events/:id', (c, [eid]) => eventView(c.db, ownEvent(c, eid)))
on('PUT', '/events/:id', (c, [eid]) => {
  const e = ownEvent(c, eid)
  validateEvent(c.body, txt(c.body.date) !== e.date)
  Object.assign(e, {
    title: txt(c.body.title), description: txt(c.body.description), date: txt(c.body.date), time: txt(c.body.time),
    location: txt(c.body.location), coverUrl: txt(c.body.coverUrl), updatedAt: now(),
  })
  return eventView(c.db, e)
})
on('PUT', '/events/:id/status', (c, [eid]) => {
  const e = ownEvent(c, eid)
  if (c.body.status !== 'draft' && c.body.status !== 'active') throw err.validation({ status: 'Status inválido.' })
  e.status = c.body.status
  e.updatedAt = now()
  return eventView(c.db, e)
})
on('DELETE', '/events/:id', (c, [eid]) => {
  ownEvent(c, eid)
  const giftIds = c.db.gifts.filter((g) => g.eventId === eid).map((g) => g.id)
  c.db.reservations = c.db.reservations.filter((r) => !giftIds.includes(r.giftId))
  c.db.gifts = c.db.gifts.filter((g) => g.eventId !== eid)
  c.db.guests = c.db.guests.filter((g) => g.eventId !== eid)
  c.db.events = c.db.events.filter((e) => e.id !== eid)
})
on('GET', '/events/:id/stats', (c, [eid]) => statsOf(c.db, [ownEvent(c, eid).id], 3))
on('GET', '/stats', (c) => statsOf(c.db, myEventIds(c), 5))

// convidados
const guestList = (c: Ctx, eventId: string) =>
  c.db.guests
    .filter((g) => (eventId ? g.eventId === eventId : myEventIds(c).includes(g.eventId)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((g) => guestView(c.db, g))
on('GET', '/guests', (c) => {
  const eid = c.q.get('eventId') ?? ''
  if (eid) ownEvent(c, eid)
  return guestList(c, eid)
})
on('GET', '/events/:id/guests', (c, [eid]) => (ownEvent(c, eid), guestList(c, eid)))
function addGuest(c: Ctx, eid: string, b: Body, strict: boolean) {
  const email = norm(b.email)
  if (c.db.guests.some((g) => g.eventId === eid && g.email === email)) {
    if (strict) throw err.conflict('guest_email_taken', 'Já existe um convidado com esse e-mail neste evento.')
    return null
  }
  const status = (['pending', 'confirmed', 'declined'].includes(String(b.status)) ? b.status : 'pending') as GuestStatus
  const g: GuestRow = {
    id: id(), eventId: eid, name: txt(b.name), email, phone: txt(b.phone), status, companions: Number(b.companions ?? 0), message: txt(b.message),
    token: rand(32), source: 'host', invitedAt: null, respondedAt: status === 'pending' ? null : now(), createdAt: now(),
  }
  c.db.guests.push(g)
  return g
}
on('POST', '/events/:id/guests', (c, [eid]) => {
  ownEvent(c, eid)
  check(validateGuest(c.body))
  return guestView(c.db, addGuest(c, eid, c.body, true)!)
})
on('POST', '/events/:id/guests/bulk', (c, [eid]) => {
  ownEvent(c, eid)
  const list = (c.body.guests as Body[]) ?? []
  if (!list.length) throw new ApiError(400, 'bulk_empty', 'Nenhum convidado na lista.')
  const fields: Record<string, string> = {}
  list.forEach((g, i) => Object.entries(validateGuest(g)).forEach(([k, v]) => (fields[`guests.${i}.${k}`] = v)))
  check(fields)
  let created = 0
  for (const g of list) if (addGuest(c, eid, { ...g, status: 'pending' }, false)) created++
  return { created, skipped: list.length - created }
})
on('POST', '/events/:id/guests/invites', (c, [eid]) => {
  ownEvent(c, eid)
  const ids = (c.body.guestIds as string[]) ?? []
  if (!ids.length) throw new ApiError(400, 'invite_empty', 'Escolha pelo menos um convidado.')
  return c.db.guests
    .filter((g) => g.eventId === eid && ids.includes(g.id))
    .map((g) => {
      g.invitedAt = now()
      const v = guestView(c.db, g)
      return { id: v.id, name: v.name, email: v.email, phone: v.phone, inviteUrl: v.inviteUrl }
    })
})
function ownGuest(c: Ctx, eid: string, gid: string) {
  ownEvent(c, eid)
  const g = c.db.guests.find((x) => x.id === gid && x.eventId === eid)
  if (!g) throw err.notFound('guest_not_found', 'Convidado não encontrado.')
  return g
}
on('PUT', '/events/:id/guests/:gid', (c, [eid, gid]) => {
  const g = ownGuest(c, eid, gid)
  check(validateGuest(c.body))
  const email = norm(c.body.email)
  if (c.db.guests.some((x) => x.eventId === eid && x.email === email && x.id !== gid))
    throw err.conflict('guest_email_taken', 'Já existe um convidado com esse e-mail neste evento.')
  const status = c.body.status as GuestStatus
  Object.assign(g, {
    name: txt(c.body.name), email, phone: txt(c.body.phone), companions: Number(c.body.companions ?? 0), message: txt(c.body.message),
    respondedAt: status === 'pending' ? null : status !== g.status ? now() : g.respondedAt, status,
  })
  return guestView(c.db, g)
})
on('DELETE', '/events/:id/guests/:gid', (c, [eid, gid]) => {
  ownGuest(c, eid, gid)
  c.db.guests = c.db.guests.filter((g) => g.id !== gid)
})

// presentes
const giftList = (c: Ctx, eventId: string) =>
  c.db.gifts
    .filter((g) => (eventId ? g.eventId === eventId : myEventIds(c).includes(g.eventId)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((g) => giftView(c.db, g))
on('GET', '/gifts', (c) => {
  const eid = c.q.get('eventId') ?? ''
  if (eid) ownEvent(c, eid)
  return giftList(c, eid)
})
on('GET', '/events/:id/gifts', (c, [eid]) => (ownEvent(c, eid), giftList(c, eid)))
const giftFields = (b: Body) => ({
  name: txt(b.name), description: txt(b.description), priceCents: Number(b.priceCents ?? 0), imageUrl: txt(b.imageUrl),
  storeUrl: txt(b.storeUrl), quantity: Number(b.quantity),
})
on('POST', '/events/:id/gifts', (c, [eid]) => {
  ownEvent(c, eid)
  validateGift(c.body, 0)
  const g: GiftRow = { id: id(), eventId: eid, createdAt: now(), ...giftFields(c.body) }
  c.db.gifts.push(g)
  return giftView(c.db, g, true)
})
on('GET', '/events/:id/gifts/:gid', (c, [eid, gid]) => giftView(c.db, ownGift(c, eid, gid), true))
on('PUT', '/events/:id/gifts/:gid', (c, [eid, gid]) => {
  const g = ownGift(c, eid, gid)
  validateGift(c.body, reservationsOf(c.db, gid).length)
  Object.assign(g, giftFields(c.body))
  return giftView(c.db, g, true)
})
on('DELETE', '/events/:id/gifts/:gid', (c, [eid, gid]) => {
  ownGift(c, eid, gid)
  c.db.reservations = c.db.reservations.filter((r) => r.giftId !== gid)
  c.db.gifts = c.db.gifts.filter((g) => g.id !== gid)
})
on('DELETE', '/events/:id/gifts/:gid/reservations/:rid', (c, [eid, gid, rid]) => {
  ownGift(c, eid, gid)
  if (!c.db.reservations.some((r) => r.id === rid && r.giftId === gid)) throw err.notFound('reservation_not_found', 'Escolha não encontrada.')
  c.db.reservations = c.db.reservations.filter((r) => r.id !== rid)
})

// página pública
on('GET', '/public/events/:slug', ({ db }, [slug]) => {
  const e = activeBySlug(db, slug)
  const host = db.users.find((u) => u.id === e.ownerId)!
  return {
    slug: e.slug, title: e.title, description: e.description, date: e.date, time: e.time, location: e.location, coverUrl: e.coverUrl,
    hostName: host.name, confirmed: countsOf(db, [e.id]).people,
  }
})
on('GET', '/public/events/:slug/gifts', ({ db }, [slug]) => {
  const e = activeBySlug(db, slug)
  return db.gifts
    .filter((g) => g.eventId === e.id)
    .sort((a, b) => a.priceCents - b.priceCents || a.name.localeCompare(b.name))
    .map((g) => ({ id: g.id, name: g.name, description: g.description, priceCents: g.priceCents, imageUrl: g.imageUrl, storeUrl: g.storeUrl, quantity: g.quantity, reserved: reservationsOf(db, g.id).length }))
})
on('GET', '/public/events/:slug/invites/:token', ({ db }, [slug, token]) => {
  const e = activeBySlug(db, slug)
  const g = db.guests.find((x) => x.eventId === e.id && x.token === token)
  if (!g) throw err.notFound('invite_not_found', 'Esse convite não vale mais. Confirme com seu nome e e-mail.')
  return { name: g.name, email: g.email, phone: g.phone, status: g.status, companions: g.companions, message: g.message }
})
on('POST', '/public/events/:slug/rsvp', ({ db, body }, [slug]) => {
  const e = activeBySlug(db, slug)
  const f = validateGuest(body)
  if (body.status !== 'confirmed' && body.status !== 'declined') f.status = 'Diga se você vai.'
  if (f.name) f.name = 'Conte seu nome.'
  if (f.email === 'Informe o e-mail.') f.email = 'Informe seu e-mail.'
  check(f)
  const status = body.status as GuestStatus
  const companions = status === 'declined' ? 0 : Number(body.companions ?? 0)
  const fields = { name: txt(body.name), email: norm(body.email), phone: txt(body.phone), status, companions, message: txt(body.message), respondedAt: now() }
  let g = body.inviteToken ? db.guests.find((x) => x.eventId === e.id && x.token === body.inviteToken) : undefined
  if (body.inviteToken && !g) throw err.notFound('invite_not_found', 'Esse convite não vale mais. Confirme com seu nome e e-mail.')
  const same = db.guests.find((x) => x.eventId === e.id && x.email === fields.email)
  if (g) {
    if (same && same.id !== g.id) throw err.conflict('rsvp_email_taken', 'Esse e-mail já respondeu por outro convite. Use o seu link de convite.')
    Object.assign(g, fields)
  } else if (same) {
    // Convidado cadastrado pelo anfitrião só responde pelo próprio link (saber o e-mail não basta).
    if (same.source === 'host') throw err.conflict('rsvp_use_invite', 'Esse e-mail está na lista de convidados. Responda pelo link do seu convite (peça a quem te convidou).')
    Object.assign(same, fields)
    g = same
  } else {
    g = { id: id(), eventId: e.id, token: rand(32), source: 'self', invitedAt: null, createdAt: now(), ...fields }
    db.guests.push(g)
  }
  const plus = companions === 1 ? ' com 1 acompanhante' : companions > 1 ? ` com ${companions} acompanhantes` : ''
  notify(db, e.ownerId, 'guest', status === 'declined' ? 'Presença recusada' : 'Presença confirmada',
    (status === 'declined' ? `${fields.name} não poderá ir.` : `${fields.name} confirmou presença${plus}.`) + ` (${e.title})`,
    `/painel/eventos/${e.id}?aba=convidados`)
})
on('POST', '/public/events/:slug/gifts/:gid/reservations', ({ db, body }, [slug, gid]) => {
  const e = activeBySlug(db, slug)
  const g = db.gifts.find((x) => x.id === gid && x.eventId === e.id)
  if (!g) throw err.notFound('gift_not_found', 'Presente não encontrado.')
  const f: Record<string, string> = {}
  if (!txt(body.name)) f.name = 'Conte seu nome.'
  if (!emailOk(norm(body.email))) f.email = norm(body.email) ? 'E-mail inválido.' : 'Informe seu e-mail.'
  check(f)
  if (reservationsOf(db, gid).length >= g.quantity) throw err.conflict('gift_sold_out', 'Alguém acabou de escolher a última unidade desse presente.')
  const r: ResRow = { id: id(), giftId: gid, token: rand(32), guestName: txt(body.name), guestEmail: norm(body.email), purchasedAt: null, createdAt: now() }
  db.reservations.push(r)
  notify(db, e.ownerId, 'gift', 'Presente escolhido', `${r.guestName} escolheu ${g.name} (${e.title}).`, `/painel/presentes/${e.id}/${g.id}`)
  return { reservationId: r.id, giftId: gid, token: r.token }
})
function ticket(db: DB, rid: string, token: unknown) {
  const r = db.reservations.find((x) => x.id === rid && x.token === token)
  const g = r && db.gifts.find((x) => x.id === r.giftId)
  const e = g && db.events.find((x) => x.id === g.eventId && x.status === 'active')
  if (!r || !g || !e) throw err.notFound('reservation_not_found', 'Não achamos essa escolha. Ela pode ter sido desfeita.')
  return { r, g, e }
}
on('POST', '/public/reservations/:rid/check', ({ db, body }, [rid]) => ({ purchased: !!ticket(db, rid, body.token).r.purchasedAt }))
on('POST', '/public/reservations/:rid/cancel', ({ db, body }, [rid]) => {
  const { r, g, e } = ticket(db, rid, body.token)
  db.reservations = db.reservations.filter((x) => x.id !== r.id)
  notify(db, e.ownerId, 'gift', 'Presente liberado', `${r.guestName} desistiu de ${g.name} (${e.title}).`, `/painel/presentes/${e.id}/${g.id}`)
})
on('POST', '/public/reservations/:rid/purchased', ({ db, body }, [rid]) => {
  const { r, g, e } = ticket(db, rid, body.token)
  if (r.purchasedAt) return
  r.purchasedAt = now()
  notify(db, e.ownerId, 'gift', 'Presente comprado', `${r.guestName} comprou ${g.name} (${e.title}).`, `/painel/presentes/${e.id}/${g.id}`)
})

// notificações
on('GET', '/notifications', (c) => {
  const items = c.db.notifications.filter((n) => n.userId === c.user().id).map(({ userId: _u, ...n }) => (void _u, n))
  return { items, unread: items.filter((n) => !n.read).length }
})
on('POST', '/notifications/read-all', (c) => c.db.notifications.forEach((n) => n.userId === c.user().id && (n.read = true)))
on('POST', '/notifications/:id/read', (c, [nid]) => {
  const n = c.db.notifications.find((x) => x.id === nid && x.userId === c.user().id)
  if (!n) throw err.notFound('notification_not_found', 'Notificação não encontrada.')
  n.read = true
})
on('DELETE', '/notifications/:id', (c, [nid]) => {
  c.db.notifications = c.db.notifications.filter((x) => !(x.id === nid && x.userId === c.user().id))
})
on('DELETE', '/notifications', (c) => {
  c.db.notifications = c.db.notifications.filter((x) => x.userId !== c.user().id)
})

on('POST', '/support/messages', ({ body }) => {
  const f: Record<string, string> = {}
  if (!txt(body.name)) f.name = 'Conte seu nome.'
  if (!emailOk(norm(body.email))) f.email = 'Informe seu e-mail para a resposta.'
  if (!txt(body.subject)) f.subject = 'Qual o assunto?'
  if (!txt(body.message)) f.message = 'Escreva sua mensagem.'
  check(f)
})

/** Imagem vira data URL reduzida (máx. 1200px, JPEG): o localStorage tem só ~5 MB. */
async function upload(file: File): Promise<{ url: string }> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new ApiError(400, 'upload_type', 'Use JPG, PNG ou WEBP.')
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, 1200 / bmp.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  return { url: canvas.toDataURL('image/jpeg', 0.75) }
}

const PUBLIC = /^\/(auth\/(register|login)|public\/|support\/)/

export async function demoApi<T>(path: string, method: string, json: unknown, body: BodyInit | null | undefined, token: string | null): Promise<T> {
  await new Promise((r) => setTimeout(r, 120)) // um respiro, para os estados de "carregando" aparecerem como no real
  if (path === '/uploads' && method === 'POST') {
    const f = body instanceof FormData ? body.get('file') : null
    if (!(f instanceof File)) throw new ApiError(400, 'upload_invalid', 'Envie uma imagem.')
    return (await upload(f)) as T
  }
  const [p, qs] = path.split('?')
  const db = load()
  const ctx: Ctx = {
    db,
    body: (json ?? {}) as Body,
    q: new URLSearchParams(qs ?? ''),
    user: () => {
      const u = token?.startsWith('demo.') ? db.users.find((x) => x.id === token.slice(5)) : undefined
      if (!u) throw err.auth()
      return u
    },
  }
  if (!PUBLIC.test(p) && p !== '/auth/logout') ctx.user()
  for (const [m, re, h] of routes) {
    const match = m === method && p.match(re)
    if (match) {
      const out = h(ctx, match.slice(1).map(decodeURIComponent))
      if (method !== 'GET') save(ctx.db)
      return out as T
    }
  }
  throw err.notFound('route_not_found', 'Rota não encontrada.')
}
