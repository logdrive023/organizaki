import { Check, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from '../../components/toast'
import { Button, Card, Input, Modal, Select, Switch, Tabs, Textarea } from '../../components/ui'
import { del, errorMessage, fieldErrors, post, put } from '../../lib/api'
import { money } from '../../lib/format'
import { useMe, useSession } from '../../lib/session'
import type { Me, NotificationSettings } from '../../lib/types'
import { PageTitle } from './Events'

type Tab = 'perfil' | 'senha' | 'notificacoes' | 'premium' | 'conta'

/** Salva e já atualiza a conta guardada na sessão (nome no menu, anúncios). */
function useSave() {
  const setUser = useSession((s) => s.setUser)
  return async (fn: () => Promise<Me>, ok: string, onErr?: (f: Record<string, string>) => void) => {
    try {
      setUser(await fn())
      toast.ok(ok)
      return true
    } catch (e) {
      const f = fieldErrors(e)
      if (onErr && Object.keys(f).length) onErr(f)
      else toast.error(errorMessage(e))
      return false
    }
  }
}

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('aba') as Tab) || 'perfil'
  const me = useMe()
  if (!me) return null
  return (
    <>
      <PageTitle title="Ajustes" />
      <Tabs<Tab>
        value={tab}
        onChange={(t) => setParams({ aba: t }, { replace: true })}
        tabs={[
          { id: 'perfil', label: 'Perfil' },
          { id: 'senha', label: 'Senha' },
          { id: 'notificacoes', label: 'Notificações' },
          { id: 'premium', label: 'Anúncios' },
          { id: 'conta', label: 'Conta' },
        ]}
      />
      <Card className="mt-6 max-w-2xl p-5 sm:p-6">
        {tab === 'perfil' && <Profile me={me} />}
        {tab === 'senha' && <Password />}
        {tab === 'notificacoes' && <NotificationsTab me={me} />}
        {tab === 'premium' && <Premium me={me} />}
        {tab === 'conta' && <Account me={me} />}
      </Card>
    </>
  )
}

function Profile({ me }: { me: Me }) {
  const save = useSave()
  const [form, setForm] = useState({ name: me.name, email: me.email, phone: me.phone, bio: me.bio })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    await save(() => put<Me>('/me/profile', form), 'Perfil salvo.', setErrors)
    setLoading(false)
  }
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} hint="Aparece como anfitrião na página do evento." />
      <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <Input label="Telefone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
      <Textarea label="Sobre você" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} error={errors.bio} rows={3} maxLength={160} hint={`${form.bio.length}/160`} />
      <Button type="submit" loading={loading}>
        Salvar perfil
      </Button>
    </form>
  )
}

function Password() {
  const navigate = useNavigate()
  const setSession = useSession((s) => s.setSession)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      setErrors({ confirm: 'As senhas não são iguais.' })
      return
    }
    setLoading(true)
    setErrors({})
    try {
      await put('/me/password', { currentPassword: form.currentPassword, newPassword: form.newPassword })
      // A troca derruba as sessões abertas: entra de novo com a senha nova.
      navigate('/entrar', { replace: true })
      setSession(null)
      toast.ok('Senha trocada. Entre de novo com a senha nova.')
    } catch (err) {
      const f = fieldErrors(err)
      if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input label="Senha atual" type="password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} error={errors.currentPassword} />
      <Input label="Nova senha" type="password" autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} error={errors.newPassword} hint="Pelo menos 8 caracteres." />
      <Input label="Repita a nova senha" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />
      <p className="text-xs text-muted">Depois de trocar, você entra de novo em todos os aparelhos.</p>
      <Button type="submit" loading={loading}>
        Trocar senha
      </Button>
    </form>
  )
}

function NotificationsTab({ me }: { me: Me }) {
  const save = useSave()
  const [n, setN] = useState<NotificationSettings>(me.notifications)
  const [loading, setLoading] = useState(false)
  const set = (k: keyof NotificationSettings) => (v: boolean) => setN({ ...n, [k]: v })
  return (
    <div>
      <h2 className="font-sans text-base font-semibold">No app</h2>
      <div className="divide-y divide-line">
        <Switch label="Avisos de atividade" hint="Confirmações, recusas e presentes escolhidos aparecem no sino." checked={n.inAppAll} onChange={set('inAppAll')} />
      </div>
      <h2 className="mt-6 font-sans text-base font-semibold">Por e-mail</h2>
      <p className="mb-2 text-xs text-muted">O envio por e-mail está chegando. Suas escolhas já ficam guardadas.</p>
      <div className="divide-y divide-line">
        <Switch label="Convidado confirmou" checked={n.emailGuestConfirm} onChange={set('emailGuestConfirm')} />
        <Switch label="Presente escolhido" checked={n.emailGiftReserved} onChange={set('emailGiftReserved')} />
        <Switch label="Lembrete do evento" checked={n.emailEventReminder} onChange={set('emailEventReminder')} />
        <Switch label="Novidades do Organizaki" checked={n.emailSystemUpdates} onChange={set('emailSystemUpdates')} />
      </div>
      <Button
        className="mt-6"
        loading={loading}
        onClick={async () => {
          setLoading(true)
          await save(() => put<Me>('/me/notification-settings', n), 'Preferências salvas.')
          setLoading(false)
        }}
      >
        Salvar preferências
      </Button>
    </div>
  )
}

function Premium({ me }: { me: Me }) {
  const save = useSave()
  const [buying, setBuying] = useState(false)
  const [loading, setLoading] = useState(false)
  const premium = me.plan === 'premium'
  return (
    <div>
      {premium ? (
        <>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-brand" />
            <h2 className="font-sans text-lg font-semibold">Você é Premium</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Obrigado por apoiar o Organizaki!{me.premiumSince && ` Desde ${new Date(me.premiumSince).toLocaleDateString('pt-BR')}.`}</p>
          <div className="mt-4 divide-y divide-line">
            <Switch label="Mostrar anúncios mesmo assim" hint="Se quiser ajudar ainda mais o projeto." checked={me.showAds} onChange={(v) => save(() => put<Me>('/me/ads', { showAds: v }), v ? 'Anúncios ligados.' : 'Anúncios desligados.')} />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-sans text-lg font-semibold">Painel sem anúncios</h2>
          <p className="mt-1 text-sm text-muted">Todos os recursos são grátis. O Premium só tira os anúncios — para sempre, sem mensalidade.</p>
          <div className="mt-5 rounded-2xl border border-brand/30 bg-brand-soft/50 p-5">
            <p className="font-display text-3xl font-semibold">{money(me.premiumPriceCents)}</p>
            <p className="text-sm text-muted">pagamento único</p>
            <ul className="mt-4 space-y-2 text-sm">
              {['Nenhum anúncio no painel', 'Vale para todos os seus eventos', 'Ajuda a manter o básico grátis para todo mundo'].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="size-4 shrink-0 text-ok" /> {t}
                </li>
              ))}
            </ul>
            <Button className="mt-5 w-full sm:w-auto" onClick={() => setBuying(true)}>
              <Sparkles className="size-4" /> Quero o Premium
            </Button>
          </div>
        </>
      )}
      <Modal open={buying} onClose={() => setBuying(false)} title="Confirmar Premium">
        <p className="text-sm text-muted">
          Valor: <strong className="text-ink">{money(me.premiumPriceCents)}</strong>, uma vez só.
        </p>
        <p className="mt-3 rounded-xl bg-wait-soft p-3 text-sm text-wait">Ambiente de teste: o pagamento é simulado e nada é cobrado.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setBuying(false)}>
            Cancelar
          </Button>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true)
              if (await save(() => post<Me>('/me/premium'), 'Pronto! Seu painel está sem anúncios.')) setBuying(false)
              setLoading(false)
            }}
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

const timezones = [
  ['America/Sao_Paulo', 'Brasília (São Paulo, Rio, Sul, Nordeste)'],
  ['America/Manaus', 'Manaus (Amazonas)'],
  ['America/Cuiaba', 'Cuiabá (MT, MS)'],
  ['America/Rio_Branco', 'Rio Branco (Acre)'],
  ['America/Noronha', 'Fernando de Noronha'],
  ['Europe/Lisbon', 'Lisboa'],
  ['America/New_York', 'Nova York'],
]

function Account({ me }: { me: Me }) {
  const save = useSave()
  const navigate = useNavigate()
  const setSession = useSession((s) => s.setSession)
  const [a, setA] = useState(me.account)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function remove() {
    setBusy(true)
    setErr('')
    try {
      await del('/me', { password })
      navigate('/', { replace: true })
      setSession(null)
      toast.ok('Conta excluída. Até a próxima festa!')
    } catch (e) {
      setErr(fieldErrors(e).password ?? errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Select label="Idioma" value={a.language} onChange={(e) => setA({ ...a, language: e.target.value })}>
          <option value="pt-BR">Português (Brasil)</option>
        </Select>
        <Select label="Fuso horário" value={a.timezone} onChange={(e) => setA({ ...a, timezone: e.target.value })}>
          {timezones.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true)
            await save(() => put<Me>('/me/account-settings', a), 'Ajustes salvos.')
            setLoading(false)
          }}
        >
          Salvar
        </Button>
      </div>
      <div className="rounded-2xl border border-no/30 p-4">
        <h2 className="font-sans text-base font-semibold text-no">Excluir conta</h2>
        <p className="mt-1 text-sm text-muted">Apaga sua conta, todos os eventos, convidados, presentes e escolhas. Não dá para desfazer.</p>
        <Button variant="danger" className="mt-3" onClick={() => setDeleting(true)}>
          Excluir minha conta
        </Button>
      </div>
      <Modal open={deleting} onClose={() => setDeleting(false)} title="Excluir sua conta?">
        <p className="mb-4 text-sm text-muted">Para confirmar, digite sua senha. Tudo será apagado na hora.</p>
        <Input label="Senha" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={err} />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(false)}>
            Cancelar
          </Button>
          <Button variant="danger" loading={busy} disabled={!password} onClick={remove}>
            Excluir para sempre
          </Button>
        </div>
      </Modal>
    </div>
  )
}
