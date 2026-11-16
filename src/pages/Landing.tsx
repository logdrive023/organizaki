import { CalendarHeart, Check, Gift, Heart, MapPin, MessageCircle, Navigation, Share2, Users, X } from 'lucide-react'
import { Confetti, HandHeart, Sprig } from '../components/Decor'
import { Kiki } from '../components/Kiki'
import { SiteLayout } from '../components/SiteLayout'
import { ButtonLink, Card } from '../components/ui'
import { DEMO } from '../lib/paths'
import { DemoStart } from './Auth'
import { HeroShowcase } from './landing/HeroShowcase'

// Textos aprovados pela persona marketing (gatilhos honestos: dor, alívio, facilidade, gratuidade, pertencimento).

const steps = [
  { icon: CalendarHeart, title: 'Crie a página', text: 'Nome, data, foto e o endereço. O convite já nasce bonito, com mapa e rota.' },
  { icon: Gift, title: 'Monte a lista', text: 'Coloque o que vocês querem ganhar. O presente escolhido sai da lista na hora: nada repetido.' },
  { icon: Share2, title: 'Mande no WhatsApp', text: 'Cada convidado recebe o próprio link. As respostas chegam até você, sem ninguém perguntar no grupo.' },
]

const before = ['Planilha que ninguém atualiza', 'Tia perguntando o endereço pela 3ª vez', 'Duas cafeteiras iguais', '"Quem confirmou mesmo?"']
const after = ['Um link com tudo, até o caminho no Waze', 'Confirmações chegando num painel', 'Presente escolhido some da lista', 'Você sabe quantos vão, com acompanhantes']

const forHost = [
  { icon: Users, text: 'Quem vai, quem falta responder e quantos acompanhantes' },
  { icon: Heart, text: 'Aviso a cada confirmação e a cada presente escolhido' },
  { icon: MessageCircle, text: 'Convite individual pronto para o WhatsApp' },
]
const forGuest = [
  { icon: Check, text: 'Confirma presença em um toque, sem baixar nada' },
  { icon: Navigation, text: 'Abre o Waze ou o Google Maps com a rota até a festa' },
  { icon: Gift, text: 'Escolhe o presente e vê na hora o que ainda está livre' },
]

// O que quem acabou de chegar quer saber antes de experimentar (na ordem em que a dúvida aparece).
const faq = [
  {
    q: 'É grátis mesmo? Qual é a pegadinha?',
    a: 'Não tem pegadinha. Criar o evento, convidar e montar a lista é grátis, sem limite de convidados e sem cartão. O único pago é o Premium: R$ 10,00, uma vez só, e ele só tira os anúncios do seu painel. Seus convidados nunca veem anúncio.',
  },
  {
    q: 'Dá para testar antes de criar conta?',
    a: 'Dá. Toque em "Testar a demonstração": tem um casamento de exemplo pronto, com convidados e lista de presentes. Mexa à vontade e veja também o convite do jeito que o convidado recebe.',
  },
  {
    q: 'Em quanto tempo o convite fica pronto?',
    a: 'Uns 2 minutos: nome do evento, data, endereço e uma foto. A lista de presentes e os convidados você coloca quando quiser, aos poucos.',
  },
  {
    q: 'Meus convidados precisam baixar aplicativo ou criar conta?',
    a: 'Não. Eles abrem o link no celular, veem o convite com o mapa, tocam em "Vou!" e escolhem o presente. Funciona até para quem não se dá bem com tecnologia.',
  },
  {
    q: 'Como eu mando o convite para as pessoas?',
    a: 'Pelo WhatsApp, com um toque: cada convidado ganha um link próprio, que já abre com o nome dele preenchido. Se preferir, copie o link ou mande por e-mail.',
  },
  {
    q: 'Como eu sei quem vai e quantas pessoas são?',
    a: 'No seu painel: quem confirmou, quem não vai, quem ainda não respondeu e quantos acompanhantes cada um leva. E você recebe um aviso a cada resposta.',
  },
  {
    q: 'Posso colocar presente de qualquer loja?',
    a: 'Pode: você coloca o nome, o preço, a foto e o link da loja que quiser. O convidado compra onde preferir e o dinheiro não passa pelo Organizaki. Quando alguém escolhe, o presente fica reservado e ninguém repete.',
  },
  {
    q: 'Dá para mudar alguma coisa depois de mandar o link?',
    a: 'Dá. Mudou o horário, o local ou o recado? É só editar: o link continua o mesmo e quem abrir já vê a versão nova.',
  },
  {
    q: 'Quem vê os dados dos meus convidados?',
    a: 'Só você. Na página do convite ninguém vê e-mail nem telefone dos outros, e a gente não vende dado de ninguém. Se quiser, você apaga a conta e tudo some na hora.',
  },
]

export default function Landing() {
  return (
    <SiteLayout>
      {/* Topo */}
      <section className="aura relative overflow-x-clip">
        <Confetti />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-12 pb-20 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div className="enter">
            <p className="inline-flex items-center gap-2 rounded-full bg-card/90 py-1 pr-4 pl-1 text-sm shadow-sm ring-1 ring-blush backdrop-blur">
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">Grátis</span>
              <span className="text-ink/80">
                Seu convite lindo e no ar em <strong className="font-semibold text-brand-dark">2 minutos</strong>
              </span>
              <Heart className="size-3.5 fill-rose text-rose" />
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.05] font-semibold sm:text-6xl">
              Você organiza a festa.{' '}
              <span className="text-brand italic">
                A gente organiza o resto.
                <HandHeart className="ml-1 hidden size-9 -translate-y-4 rotate-12 align-baseline text-rose sm:inline" />
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted">
              Convite com mapa, confirmação de presença e lista de presentes em um link só. Chega de responder “o que vocês querem ganhar?” no WhatsApp: você manda o link e curte a espera.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/criar-conta" className="h-12 px-6 text-base">
                Criar meu evento grátis
              </ButtonLink>
              {DEMO ? (
                <DemoStart className="h-12 px-6 text-base" label="Testar a demonstração" />
              ) : (
                <ButtonLink to="/e/demo" variant="secondary" className="h-12 px-6 text-base">
                  Ver um convite de exemplo
                </ButtonLink>
              )}
            </div>
            <p className="mt-4 text-sm text-muted">Sem cartão. Seus convidados não precisam baixar nada nem criar conta.</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[
                ['💌', 'Convite lindo'],
                ['📍', 'Mapa e rota no Waze'],
                ['🎁', 'Nada de presente repetido'],
              ].map(([e, t]) => (
                <li key={t} className="rounded-full bg-rosewash px-3 py-1.5 text-ink/80 ring-1 ring-blush/70">
                  <span aria-hidden>{e}</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="enter [animation-delay:.15s]">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* Antes × depois */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold sm:text-4xl">Você já passou por isso?</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="bg-soft/60 p-6">
            <p className="text-sm font-semibold tracking-wide text-muted uppercase">Sem o Organizaki</p>
            <ul className="mt-4 space-y-3">
              {before.map((t) => (
                <li key={t} className="flex gap-3 text-muted">
                  <X className="mt-0.5 size-5 shrink-0 text-no/70" /> {t}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="relative overflow-hidden p-6 ring-2 ring-brand/15">
            <Sprig className="absolute -right-3 -bottom-3 size-24 text-brand/25" />
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">Com o Organizaki</p>
            <ul className="mt-4 space-y-3">
              {after.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-ok" /> {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <p className="mt-8 text-center font-display text-xl text-brand-dark italic">Cada dia sem lista é mais uma pergunta no grupo. Resolva hoje.</p>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-20 border-y border-line bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Em 2 minutos, seu convite está no ar</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">Crie a página, monte a lista e mande o link. Daqui pra frente, as respostas chegam até você.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl bg-paper p-6">
                <span className="absolute top-5 right-6 font-display text-5xl text-blush italic">{i + 1}</span>
                <span className="grid size-11 place-items-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="text-center text-3xl font-semibold sm:text-4xl">Feito pra você curtir a festa, não administrar</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">Você vê tudo num painel. O convidado resolve em poucos toques, até pelo celular da vó.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { title: 'Para quem organiza', items: forHost, tone: 'bg-brand-soft text-brand-dark' },
            { title: 'Para quem é convidado', items: forGuest, tone: 'bg-ok-soft text-ok' },
          ].map((col) => (
            <Card key={col.title} className="p-6">
              <h3 className="text-xl font-semibold">{col.title}</h3>
              <ul className="mt-5 space-y-4">
                {col.items.map((it) => (
                  <li key={it.text} className="flex items-start gap-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${col.tone}`}>
                      <it.icon className="size-4" />
                    </span>
                    <span className="pt-1.5">{it.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="mt-6 flex flex-col items-center gap-4 overflow-hidden p-6 text-center sm:flex-row sm:text-left">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blush text-brand-dark">
            <MapPin className="size-6" />
          </span>
          <p className="flex-1">
            <strong>Ninguém se perde no caminho.</strong> O convite mostra o mapa do local e abre o Waze ou o Google Maps com a rota em um toque.
          </p>
        </Card>
      </section>

      {/* Perguntas */}
      <section id="perguntas" className="scroll-mt-20 border-t border-line bg-card py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Ficou alguma dúvida?</h2>
          <p className="mt-3 text-center text-muted">O que todo mundo quer saber antes de criar o primeiro convite.</p>
          <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-paper">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-xl text-brand transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-rosewash p-5 text-center sm:flex-row sm:text-left">
            <Kiki mood="feliz" size={56} />
            <p className="flex-1">
              <strong>Ficou outra dúvida?</strong> Pergunte para a Kiki, aqui no cantinho da tela — ou experimente agora, sem criar conta.
            </p>
            {DEMO ? (
              <DemoStart label="Testar a demonstração" />
            ) : (
              <ButtonLink to="/e/demo" variant="secondary">
                Ver um convite de exemplo
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      {/* Fechamento */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white">
          <Confetti className="opacity-60" />
          <HandHeart className="mx-auto size-10 text-blush" />
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Seu dia chega rápido. Deixe ele leve.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/75">Crie a página agora e mande o primeiro convite ainda hoje. É grátis.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/criar-conta" className="h-12 px-6 text-base">
              Criar meu evento grátis
            </ButtonLink>
            {DEMO && <DemoStart className="h-12 border-white/20 bg-white/10 px-6 text-base text-white hover:bg-white/20" label="Testar a demonstração" />}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
