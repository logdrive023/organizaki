import { BarChart3, Bell, CalendarHeart, Check, Gift, Link2, MapPin, MessageCircle, Share2, Sparkles, Users } from 'lucide-react'
import { SiteLayout } from '../components/SiteLayout'
import { ButtonLink, Card } from '../components/ui'

const steps = [
  { icon: CalendarHeart, title: 'Crie a página', text: 'Nome, data, local e uma foto de capa. Em dois minutos o evento está de pé.' },
  { icon: Gift, title: 'Monte a lista de presentes', text: 'Coloque o que você quer ganhar, com preço e link da loja. Ninguém dá presente repetido.' },
  { icon: Share2, title: 'Mande o link', text: 'Cada convidado recebe o seu link pelo WhatsApp. Você acompanha quem confirmou em tempo real.' },
]

const forHosts = [
  { icon: Users, text: 'Lista de convidados com importação em massa' },
  { icon: Bell, text: 'Aviso quando alguém confirma ou escolhe um presente' },
  { icon: BarChart3, text: 'Quantas pessoas vão, quem falta responder e o que já foi escolhido' },
  { icon: Link2, text: 'Link individual de convite, pronto para o WhatsApp' },
]

const forGuests = [
  { icon: Check, text: 'Confirma presença em um toque, com acompanhantes' },
  { icon: Gift, text: 'Escolhe o presente e vê na hora o que ainda está livre' },
  { icon: MapPin, text: 'Data, horário e como chegar no mesmo lugar' },
  { icon: MessageCircle, text: 'Deixa um recado carinhoso para quem convidou' },
]

const faq = [
  { q: 'Quanto custa?', a: 'Criar eventos, convidar e montar a lista de presentes é grátis, sem limite. O Premium (R$ 10,00, pagamento único) só tira os anúncios.' },
  { q: 'O convidado precisa baixar algo ou criar conta?', a: 'Não. Ele abre o link, confirma a presença e escolhe o presente direto do navegador.' },
  { q: 'O dinheiro do presente passa pelo Organizaki?', a: 'Não. O convidado compra na loja que você indicou e marca o presente como comprado. A gente só organiza a lista.' },
  { q: 'Serve para que tipo de evento?', a: 'Casamento, chá de casa nova, chá de bebê, aniversário, formatura — qualquer festa com convidados e presentes.' },
]

function EventPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-soft/70 blur-2xl" aria-hidden />
      <Card className="overflow-hidden shadow-xl">
        <img src="/img/evento-casamento.webp" alt="" className="h-44 w-full object-cover" />
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand uppercase">Faltam 58 dias</p>
            <h3 className="mt-1 text-xl font-semibold">Casamento de Maria e João</h3>
            <p className="text-sm text-muted">Sábado, 17h · Espaço Villa Garden</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-xl bg-ok-soft py-2.5 font-semibold text-ok">Vou! 🎉</div>
            <div className="rounded-xl bg-soft py-2.5 font-semibold text-muted">Não poderei</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line p-2.5">
            <img src="/img/presente-cafeteira.webp" alt="" className="size-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Cafeteira elétrica</p>
              <p className="text-xs text-muted">R$ 189,90</p>
            </div>
            <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">Escolher</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function Landing() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-12 overflow-x-clip px-4 pt-12 pb-20 md:grid-cols-2 md:pt-20">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
            <Sparkles className="size-3.5" /> Grátis para sempre no básico
          </p>
          <h1 className="mt-5 text-4xl leading-[1.1] font-semibold sm:text-5xl">
            Seu evento organizado <span className="text-brand italic">em um link.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            A página do evento, a confirmação de presença e a lista de presentes no mesmo lugar. Você manda o link; o Organizaki cuida do resto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/criar-conta" className="h-12 px-6 text-base">
              Criar meu evento
            </ButtonLink>
            <ButtonLink to="/e/demo" variant="secondary" className="h-12 px-6 text-base">
              Ver um exemplo
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">Sem cartão. O convidado não precisa criar conta.</p>
        </div>
        <EventPreview />
      </section>

      <section id="como-funciona" className="scroll-mt-20 border-y border-line bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-semibold">Três passos e pronto</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-paper p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-brand text-white">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-display text-sm text-muted">Passo {i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="text-center text-3xl font-semibold">Bom para quem convida, fácil para quem vai</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { title: 'Para quem organiza', items: forHosts },
            { title: 'Para quem é convidado', items: forGuests },
          ].map((col) => (
            <Card key={col.title} className="p-6">
              <h3 className="text-xl font-semibold">{col.title}</h3>
              <ul className="mt-5 space-y-4">
                {col.items.map((it) => (
                  <li key={it.text} className="flex gap-3">
                    <it.icon className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section id="perguntas" className="scroll-mt-20 border-t border-line bg-card py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-semibold">Perguntas frequentes</h2>
          <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-paper">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-brand transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-ink px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-semibold">Sua festa merece menos planilha</h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">Crie a página agora e mande o primeiro convite ainda hoje.</p>
          <ButtonLink to="/criar-conta" className="mt-8 h-12 px-6 text-base">
            Criar meu evento grátis
          </ButtonLink>
        </div>
      </section>
    </SiteLayout>
  )
}
