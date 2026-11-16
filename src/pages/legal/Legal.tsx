import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SiteLayout } from '../../components/SiteLayout'

const UPDATED = '16 de novembro de 2026'
const CONTACT = 'contato@organizaki.com.br'

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { title: string; body: ReactNode }[] }) {
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="mb-8 border-b border-line pb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Última atualização: {updated}</p>
        </header>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={s.title} aria-labelledby={`sec-${i}`} className="space-y-3 text-[15px] leading-relaxed text-ink/90">
              <h2 id={`sec-${i}`} className="text-xl font-semibold text-ink">
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </article>
    </SiteLayout>
  )
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-brand">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

const Mail = () => (
  <a href={`mailto:${CONTACT}`} className="font-medium text-brand underline underline-offset-2">
    {CONTACT}
  </a>
)

const A = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-medium text-brand underline underline-offset-2">
    {children}
  </Link>
)

export function Terms() {
  return (
    <LegalPage
      title="Termos de uso"
      updated={UPDATED}
      sections={[
        {
          title: 'Aceite',
          body: (
            <p>
              Ao criar uma conta ou usar o Organizaki, você concorda com estes termos. Se não concordar com algum ponto, por favor não use o serviço. Para saber
              como tratamos dados pessoais, leia também a <A to="/privacidade">Política de privacidade</A>.
            </p>
          ),
        },
        {
          title: 'O que é o Organizaki',
          body: (
            <>
              <p>O Organizaki ajuda você a organizar um evento (casamento, aniversário, chá, formatura…) num único link. Hoje o serviço permite:</p>
              <List
                items={[
                  'criar a página do evento, com data, local e descrição;',
                  'cadastrar convidados (nome, e-mail e telefone) e acompanhar quem confirmou presença;',
                  'receber confirmações com acompanhantes e um recado de cada convidado;',
                  'montar uma lista de presentes, em que cada convidado escolhe o que vai dar;',
                  'compartilhar o link do evento (por exemplo, pelo WhatsApp).',
                ]}
              />
              <p>
                O Organizaki ainda não envia e-mails nem SMS aos convidados: quem compartilha o convite é você. Não intermediamos a compra dos presentes nem
                recebemos dinheiro em nome de quem organiza.
              </p>
            </>
          ),
        },
        {
          title: 'Sua conta',
          body: (
            <>
              <p>Para criar eventos você precisa de uma conta, e para isso deve ter pelo menos 18 anos. Você se compromete a:</p>
              <List
                items={[
                  'informar dados verdadeiros e mantê-los atualizados;',
                  'guardar sua senha com cuidado — você responde pelo que for feito na sua conta;',
                  `nos avisar em ${CONTACT} se perceber uso que não foi seu.`,
                ]}
              />
              <p>
                Convidados não precisam de conta para confirmar presença ou escolher um presente.
              </p>
            </>
          ),
        },
        {
          title: 'Planos e pagamento',
          body: (
            <>
              <p>
                O plano gratuito tem tudo o que é preciso para o evento e exibe um espaço de anúncio. O plano Premium custa R$ 10,00, em pagamento único, e
                remove os anúncios. Não é assinatura: não há cobrança recorrente.
              </p>
              <p>
                Neste momento o pagamento do Premium é simulado (ambiente de teste) e nenhuma cobrança real é feita. Quando o pagamento real entrar no ar,
                atualizaremos estes termos antes.
              </p>
            </>
          ),
        },
        {
          title: 'Dados dos seus convidados',
          body: (
            <p>
              Ao cadastrar convidados, você insere dados pessoais de outras pessoas. Você declara que tem o direito de usá-los para o convite (por exemplo,
              porque a própria pessoa lhe passou o contato) e que vai usá-los apenas para o seu evento. Se um convidado pedir para ser removido, apague o
              cadastro dele no painel.
            </p>
          ),
        },
        {
          title: 'Seu conteúdo',
          body: (
            <>
              <p>
                Textos, fotos e listas que você publica continuam sendo seus. Você nos autoriza a armazená-los e exibi-los apenas para fazer o serviço
                funcionar — por exemplo, mostrar a página do evento a quem tem o link. Não usamos seu conteúdo para publicidade.
              </p>
              <p>Você garante que tem direito sobre o que publica e que isso não viola direitos de ninguém (imagem, autoria, privacidade).</p>
            </>
          ),
        },
        {
          title: 'O que não é permitido',
          body: (
            <List
              items={[
                'usar o Organizaki para algo ilegal, ofensivo, discriminatório ou enganoso;',
                'criar eventos falsos para coletar dados de pessoas ou aplicar golpes;',
                'enviar spam a partir dos contatos cadastrados;',
                'tentar acessar contas, eventos ou dados de outras pessoas, ou atrapalhar o funcionamento do serviço.',
              ]}
            />
          ),
        },
        {
          title: 'Suspensão e encerramento',
          body: (
            <p>
              Você pode excluir sua conta quando quiser, em Configurações, no painel. A exclusão apaga a conta e tudo o que está ligado a ela (eventos,
              convidados, listas de presentes e notificações) e não pode ser desfeita. Podemos suspender contas ou eventos que violem estes termos, avisando
              pelo e-mail cadastrado sempre que possível.
            </p>
          ),
        },
        {
          title: 'Limites da nossa responsabilidade',
          body: (
            <p>
              Fazemos o possível para o Organizaki ficar no ar e funcionar bem, mas ele é oferecido como está e pode ter falhas ou ficar indisponível por um
              tempo. Não respondemos pela realização do evento, pela compra ou entrega dos presentes, nem pelo conteúdo publicado por quem organiza. Nada
              aqui afasta os direitos que o Código de Defesa do Consumidor garante a você.
            </p>
          ),
        },
        {
          title: 'Mudanças nestes termos',
          body: (
            <p>
              Se mudarmos algo importante, avisaremos com antecedência no site ou pelo e-mail da conta. A data no topo desta página sempre indica a versão em
              vigor.
            </p>
          ),
        },
        {
          title: 'Lei aplicável e contato',
          body: (
            <p>
              Estes termos seguem as leis do Brasil. Dúvidas? Escreva para <Mail /> ou use o formulário da página de <A to="/ajuda">Ajuda</A>.
            </p>
          ),
        },
      ]}
    />
  )
}

export function Privacy() {
  return (
    <LegalPage
      title="Política de privacidade"
      updated={UPDATED}
      sections={[
        {
          title: 'Quem cuida dos seus dados',
          body: (
            <>
              <p>
                O Organizaki é o controlador dos dados das contas de quem organiza eventos, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei
                13.709/2018). Para qualquer assunto de privacidade, inclusive falar com quem responde pelo tratamento de dados, escreva para <Mail />.
              </p>
              <p>
                Os dados de convidados são cadastrados por quem organiza o evento. Nesse caso, quem organiza decide para que eles servem (o convite) e o
                Organizaki os guarda e processa em nome dessa pessoa.
              </p>
            </>
          ),
        },
        {
          title: 'Quais dados guardamos',
          body: (
            <>
              <p>
                <strong>Se você organiza um evento:</strong> nome, e-mail, telefone, bio (se você preencher) e senha — guardada só em forma criptografada
                (bcrypt), nem nós conseguimos lê-la. Também guardamos os eventos que você cria, fotos que envia, a lista de presentes e as notificações do
                painel.
              </p>
              <p>
                <strong>Se você é convidado:</strong> nome, e-mail e telefone que o organizador cadastrou, sua resposta de presença, acompanhantes e o recado
                que você deixar.
              </p>
              <p>
                <strong>Se você escolhe um presente:</strong> o nome e o e-mail informados na escolha, para quem organiza saber quem vai dar o quê.
              </p>
              <p>
                <strong>Se você fala com a gente:</strong> nome, e-mail, assunto e mensagem enviados pelo formulário de ajuda.
              </p>
              <p>
                Não usamos ferramentas de análise (como Google Analytics), pixels de anúncio nem rastreamento entre sites. Saiba o que fica no seu navegador
                na <A to="/cookies">Política de cookies e armazenamento</A>.
              </p>
            </>
          ),
        },
        {
          title: 'Para que usamos',
          body: (
            <List
              items={[
                'criar e manter sua conta e permitir que você entre nela;',
                'mostrar a página do evento a quem tem o link e registrar confirmações e escolhas de presentes;',
                'mostrar ao organizador quem confirmou, com quantos acompanhantes, e quem escolheu cada presente;',
                'liberar o plano Premium para quem comprou;',
                'responder às mensagens de suporte;',
                'manter o serviço seguro e evitar abuso.',
              ]}
            />
          ),
        },
        {
          title: 'Base legal',
          body: (
            <List
              items={[
                <>
                  <strong>Execução de contrato</strong> (art. 7º, V): os dados da sua conta e dos seus eventos, necessários para prestar o serviço.
                </>,
                <>
                  <strong>Legítimo interesse</strong> (art. 7º, IX): segurança, prevenção de fraude e atendimento ao suporte.
                </>,
                <>
                  <strong>Cumprimento de obrigação legal</strong> (art. 7º, II): quando a lei exigir que guardemos algum registro.
                </>,
                <>
                  <strong>Dados de convidados:</strong> quem organiza é responsável por ter uma base legal para cadastrá-los — normalmente, a própria pessoa
                  passou o contato para receber o convite.
                </>,
              ]}
            />
          ),
        },
        {
          title: 'Com quem compartilhamos',
          body: (
            <>
              <p>
                <strong>Não vendemos nem alugamos dados pessoais.</strong> Os dados só aparecem para:
              </p>
              <List
                items={[
                  'quem organiza o evento, que vê os convidados, as confirmações, os recados e quem escolheu cada presente;',
                  'quem tem o link do evento, que vê a página pública — e-mails e telefones de convidados não aparecem nela;',
                  'empresas que hospedam o serviço para nós, sob contrato e só para mantê-lo no ar;',
                  'autoridades, quando houver ordem judicial ou obrigação legal.',
                ]}
              />
            </>
          ),
        },
        {
          title: 'Por quanto tempo',
          body: (
            <p>
              Guardamos os dados enquanto sua conta existir. Ao excluir a conta em Configurações, apagamos na hora a conta e tudo o que está ligado a ela:
              eventos, convidados, confirmações, listas e escolhas de presentes e notificações. Mensagens de suporte ficam guardadas só pelo tempo necessário
              para resolver o assunto. Registros exigidos por lei são mantidos pelo prazo legal.
            </p>
          ),
        },
        {
          title: 'Seus direitos',
          body: (
            <>
              <p>Pela LGPD, você pode a qualquer momento:</p>
              <List
                items={[
                  'saber se tratamos seus dados e ter acesso a eles;',
                  'corrigir dados incompletos ou errados;',
                  'pedir a exclusão, a anonimização ou o bloqueio de dados desnecessários;',
                  'pedir a portabilidade dos dados;',
                  'saber com quem eles são compartilhados;',
                  'se opor a um tratamento ou revogar um consentimento.',
                ]}
              />
              <p>
                Quem organiza pode corrigir os próprios dados em Configurações e excluir a conta ali mesmo. Para os demais pedidos — e se você é convidado e
                quer seus dados fora de um evento — escreva para <Mail /> ou use a página de <A to="/ajuda">Ajuda</A>. Respondemos em até 15 dias. Se o
                pedido for sobre um evento específico, também pode falar direto com quem organiza. Você ainda pode reclamar à ANPD (Autoridade Nacional de
                Proteção de Dados).
              </p>
            </>
          ),
        },
        {
          title: 'Segurança',
          body: (
            <p>
              A conexão com o site é criptografada (HTTPS), as senhas são guardadas com bcrypt e cada organizador só acessa os próprios eventos. Nenhum
              sistema é 100% seguro; se acontecer um incidente que possa trazer risco a você, avisaremos você e a ANPD.
            </p>
          ),
        },
        {
          title: 'Menores de idade',
          body: (
            <p>
              Para criar uma conta é preciso ter 18 anos ou mais. Convidados menores de idade podem ser cadastrados por quem organiza, que deve ter a
              autorização dos responsáveis.
            </p>
          ),
        },
        {
          title: 'Mudanças nesta política',
          body: (
            <p>Quando esta política mudar, a data no topo será atualizada. Se a mudança for importante, avisaremos no site ou pelo e-mail da conta.</p>
          ),
        },
      ]}
    />
  )
}

export function Cookies() {
  const keys = [
    { name: 'ok.session', what: 'Mantém você conectado ao painel (tokens de acesso).', until: 'Até você sair da conta' },
    { name: 'ok.tickets', what: 'Lembra quais presentes você escolheu neste aparelho, para poder desfazer a escolha.', until: 'Até você limpar o navegador' },
    { name: 'ok.purchased', what: 'Lembra quais presentes você marcou como comprados neste aparelho.', until: 'Até você limpar o navegador' },
  ]
  return (
    <LegalPage
      title="Cookies e armazenamento"
      updated={UPDATED}
      sections={[
        {
          title: 'Resumo',
          body: (
            <p>
              O Organizaki não usa cookies de publicidade, de análise nem de terceiros. Guardamos apenas o mínimo no seu navegador para o site funcionar —
              por isso não mostramos aquele aviso de cookies.
            </p>
          ),
        },
        {
          title: 'O que fica no seu navegador',
          body: (
            <>
              <p>
                Usamos o armazenamento local do navegador (localStorage), que fica só no seu aparelho e não é enviado automaticamente a nenhum site. São três
                itens, todos essenciais:
              </p>
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-soft text-ink">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Nome
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Para que serve
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Quanto tempo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((k) => (
                      <tr key={k.name} className="border-t border-line align-top">
                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{k.name}</td>
                        <td className="px-3 py-2">{k.what}</td>
                        <td className="px-3 py-2 text-muted">{k.until}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Se você apagar os dados do site, a escolha de presente continua registrada para quem organiza, mas você não conseguirá mais desfazê-la por
                este aparelho. Nesse caso, fale com quem organiza o evento.
              </p>
            </>
          ),
        },
        {
          title: 'O que não usamos',
          body: (
            <List
              items={[
                'ferramentas de análise, como Google Analytics;',
                'pixels de redes sociais ou de anúncios;',
                'fontes ou scripts carregados de outros sites — as fontes são servidas pelo próprio Organizaki;',
                'anúncios de redes externas: o espaço de anúncio do plano gratuito mostra apenas conteúdo do próprio Organizaki, sem rastreamento.',
              ]}
            />
          ),
        },
        {
          title: 'Mapa e links externos',
          body: (
            <p>
              Quando o evento tem endereço, o convite mostra um mapa do Google Maps embutido, que só carrega ao chegar perto dele na tela. Ao carregar, o
              Google recebe dados técnicos do seu navegador (como o endereço IP) e pode usar cookies próprios, conforme a política de privacidade dele. Os
              botões “Abrir no Waze” e “Google Maps” só levam você ao aplicativo escolhido quando você toca neles.
            </p>
          ),
        },
        {
          title: 'Como apagar',
          body: (
            <>
              <p>Você pode sair da conta a qualquer momento, o que remove a sessão. Para apagar tudo, use as configurações do navegador:</p>
              <List
                items={[
                  <>
                    <strong>Chrome:</strong> Configurações › Privacidade e segurança › Cookies e outros dados do site.
                  </>,
                  <>
                    <strong>Safari (iPhone):</strong> Ajustes › Safari › Avançado › Dados dos Sites.
                  </>,
                  <>
                    <strong>Firefox:</strong> Configurações › Privacidade e Segurança › Cookies e dados de sites.
                  </>,
                  <>
                    <strong>Edge:</strong> Configurações › Cookies e permissões de site.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          title: 'Contato',
          body: (
            <p>
              Dúvidas sobre esta página? Escreva para <Mail />. Mais detalhes sobre seus dados estão na <A to="/privacidade">Política de privacidade</A>.
            </p>
          ),
        },
      ]}
    />
  )
}
