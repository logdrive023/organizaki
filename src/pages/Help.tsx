import { CalendarPlus, CheckCircle2, ChevronDown, Gift, Users } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { toast } from '../components/toast'
import { Button, Card, Input, Textarea } from '../components/ui'
import { ApiError, errorMessage, fieldErrors, post } from '../lib/api'

const faq: { q: string; a: ReactNode }[] = [
  {
    q: 'O Organizaki é grátis?',
    a: 'Sim. No plano gratuito você cria o evento, cadastra convidados, recebe confirmações e monta a lista de presentes. Ele mostra um espaço de anúncio na página. O Premium custa R$ 10,00, em pagamento único, e tira os anúncios — não é assinatura.',
  },
  {
    q: 'Meus convidados precisam criar conta?',
    a: 'Não. Eles abrem o link do evento, confirmam presença (com acompanhantes e um recado, se quiserem) e escolhem um presente informando só nome e e-mail.',
  },
  {
    q: 'O Organizaki manda o convite por e-mail ou SMS?',
    a: 'Ainda não. Você copia o link do evento e envia por onde preferir — o painel tem um atalho para o WhatsApp. Assim o convite chega de você, por um canal que seus convidados já conhecem.',
  },
  {
    q: 'O dinheiro dos presentes passa pelo Organizaki?',
    a: 'Não. A lista mostra o que você gostaria de ganhar e quem escolheu cada item. A compra e a entrega são combinadas entre você e seus convidados.',
  },
  {
    q: 'Escolhi um presente por engano. Como desfaço?',
    a: 'Abra o evento no mesmo aparelho e navegador em que fez a escolha: ali aparece a opção de desfazer ou de marcar como comprado. Se você limpou os dados do navegador ou trocou de aparelho, peça a quem organiza para liberar o presente.',
  },
  {
    q: 'Posso editar o evento depois de publicado?',
    a: 'Pode. Tudo o que você muda na aba Detalhes aparece na página do evento — quem já tem o link vê a versão atualizada.',
  },
  {
    q: 'Quem consegue ver os dados dos meus convidados?',
    a: (
      <>
        Só você, no painel. A página pública do evento não mostra e-mails nem telefones. Não vendemos dados nem usamos rastreadores — veja a{' '}
        <Link to="/privacidade" className="font-medium text-brand underline underline-offset-2">
          Política de privacidade
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Como apago minha conta?',
    a: 'No painel, em Configurações, use “Excluir conta”. Isso apaga na hora a conta, os eventos, os convidados, as listas de presentes e as notificações. Não dá para desfazer.',
  },
]

const guides: { icon: ReactNode; title: string; steps: ReactNode[] }[] = [
  {
    icon: <CalendarPlus className="size-5" />,
    title: 'Criar o evento e publicar',
    steps: [
      <>
        Entre na sua conta e abra o <strong>painel</strong> (/painel).
      </>,
      <>
        Toque em <strong>Novo evento</strong>, dê um nome e escolha a data.
      </>,
      <>
        Na aba <strong>Detalhes</strong>, complete local, horário e uma descrição curta.
      </>,
      <>
        Confira a aba <strong>Resumo</strong> e toque em <strong>Publicar</strong>. Pronto: o link do evento já pode ser enviado.
      </>,
    ],
  },
  {
    icon: <Users className="size-5" />,
    title: 'Convidar e acompanhar as confirmações',
    steps: [
      <>
        Abra o evento e vá até a aba <strong>Convidados</strong>.
      </>,
      'Cadastre cada convidado com nome e, se quiser, e-mail e telefone.',
      <>
        Copie o link do convite ou use o botão do <strong>WhatsApp</strong> para enviar.
      </>,
      <>
        Acompanhe quem confirmou, quantos acompanhantes vêm e os recados — os números aparecem também no <strong>Resumo</strong>.
      </>,
    ],
  },
  {
    icon: <Gift className="size-5" />,
    title: 'Montar a lista de presentes',
    steps: [
      <>
        No evento, abra a aba <strong>Presentes</strong>.
      </>,
      'Adicione cada item com nome e, se quiser, foto, valor de referência e link da loja.',
      'Seus convidados escolhem pelo link do evento, informando nome e e-mail.',
      'Você vê no painel quem escolheu cada presente e o que já foi marcado como comprado.',
    ],
  },
]

type Form = { name: string; email: string; subject: string; message: string }
const empty: Form = { name: '', email: '', subject: '', message: '' }

function ContactForm() {
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSending(true)
    setErrors({})
    try {
      await post('/support/messages', form)
      setSent(true)
      setForm(empty)
      toast.ok('Mensagem enviada. Obrigado!')
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(fieldErrors(err))
        toast.error('Confira os campos destacados.')
      } else {
        toast.error(errorMessage(err))
      }
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center" role="status">
        <div className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
          <CheckCircle2 className="size-6" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold">Recebemos sua mensagem</h3>
        <p className="max-w-sm text-sm text-muted">Respondemos em até 2 dias úteis no e-mail informado.</p>
        <Button variant="secondary" onClick={() => setSent(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Seu nome" name="name" autoComplete="name" required value={form.name} onChange={set('name')} error={errors.name} />
        <Input
          label="Seu e-mail"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
      </div>
      <Input label="Assunto" name="subject" required value={form.subject} onChange={set('subject')} error={errors.subject} />
      <Textarea label="Mensagem" name="message" required rows={5} value={form.message} onChange={set('message')} error={errors.message} />
      <Button type="submit" loading={sending} className="w-full sm:w-auto">
        Enviar mensagem
      </Button>
    </form>
  )
}

export function Help() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl space-y-14 px-4 py-10 sm:py-14">
        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Como podemos ajudar?</h1>
          <p className="text-muted">Respostas rápidas, um passo a passo do essencial e um jeito fácil de falar com a gente.</p>
        </header>

        <section aria-labelledby="faq" className="space-y-4">
          <h2 id="faq" className="text-2xl font-semibold">
            Perguntas frequentes
          </h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-card">
            {faq.map((f) => (
              <details key={f.q} className="group px-4 sm:px-5">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-4 text-[15px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="passo" className="space-y-4">
          <h2 id="passo" className="text-2xl font-semibold">
            Passo a passo
          </h2>
          <div className="grid gap-4">
            {guides.map((g) => (
              <Card key={g.title} className="p-5">
                <h3 className="mb-3 flex items-center gap-3 text-lg font-semibold">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">{g.icon}</span>
                  {g.title}
                </h3>
                <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed marker:font-semibold marker:text-brand">
                  {g.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="contato" className="space-y-4">
          <div className="space-y-1">
            <h2 id="contato" className="text-2xl font-semibold">
              Fale com a gente
            </h2>
            <p className="text-sm text-muted">
              Não achou a resposta? Mande uma mensagem ou escreva para{' '}
              <a href="mailto:contato@organizaki.com.br" className="font-medium text-brand underline underline-offset-2">
                contato@organizaki.com.br
              </a>
              .
            </p>
          </div>
          <Card className="p-5 sm:p-6">
            <ContactForm />
          </Card>
        </section>
      </div>
    </SiteLayout>
  )
}
