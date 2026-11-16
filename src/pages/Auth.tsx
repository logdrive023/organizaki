import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from '../components/toast'
import { Button, Card, Input, Logo } from '../components/ui'
import { errorMessage, fieldErrors, post } from '../lib/api'
import { safeBack } from '../lib/nav'
import { DEMO } from '../lib/paths'
import { useSession } from '../lib/session'
import type { Session } from '../lib/types'

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8" aria-label="Voltar para o início">
        <Logo />
      </Link>
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
        {children}
      </Card>
      <p className="mt-6 text-sm text-muted">{footer}</p>
    </div>
  )
}


function useAuthSubmit(path: string) {
  const setSession = useSession((s) => s.setSession)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  async function submit(body: unknown) {
    setLoading(true)
    setErrors({})
    try {
      const s = await post<Session>(path, body)
      setSession(s)
      navigate(safeBack(params.get('volta')), { replace: true })
    } catch (e) {
      const f = fieldErrors(e)
      if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }
  return { submit, errors, setErrors, loading }
}

export function Login() {
  const { submit, errors, loading } = useAuthSubmit('/auth/login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit({ email, password })
  }
  return (
    <AuthShell
      title="Que bom te ver"
      subtitle="Entre para cuidar dos seus eventos."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/criar-conta" className="font-semibold text-brand-dark">
            Crie grátis
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input label="E-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
        <Input label="Senha" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>
      {DEMO && <DemoButtons />}
    </AuthShell>
  )
}

function DemoButtons() {
  const setSession = useSession((s) => s.setSession)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  async function enter() {
    const { demoSession } = await import('../lib/demo')
    setSession(demoSession() as Session)
    navigate(safeBack(params.get('volta')), { replace: true })
  }
  async function reset() {
    const { resetDemo } = await import('../lib/demo')
    resetDemo()
    toast.ok('Demonstração zerada: tudo voltou ao começo.')
  }
  return (
    <div className="mt-6 space-y-2 border-t border-line pt-6">
      <Button variant="secondary" className="w-full" onClick={enter}>
        Entrar na demonstração
      </Button>
      <button onClick={reset} className="w-full text-center text-xs text-muted underline">
        Recomeçar a demonstração do zero
      </button>
    </div>
  )
}

export function Register() {
  const { submit, errors, setErrors, loading } = useAuthSubmit('/auth/register')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setErrors({ confirm: 'As senhas não são iguais.' })
      return
    }
    submit({ name: form.name, email: form.email, password: form.password })
  }
  return (
    <AuthShell
      title="Crie seu evento grátis"
      subtitle="Leva um minuto. Sem cartão de crédito."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/entrar" className="font-semibold text-brand-dark">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input label="Seu nome" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Ex.: Maria Souza" />
        <Input label="E-mail" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Input label="Senha" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="Pelo menos 8 caracteres." />
        <Input label="Repita a senha" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" className="w-full" loading={loading}>
          Criar conta
        </Button>
        <p className="text-center text-xs text-muted">
          Ao criar a conta você concorda com os{' '}
          <Link to="/termos" className="underline">
            Termos
          </Link>{' '}
          e a{' '}
          <Link to="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  )
}
