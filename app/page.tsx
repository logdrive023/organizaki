import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Gift, Users, CheckCircle, MapPin, Camera, List, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AdBanner } from "@/components/ads/ad-banner"
import Script from "next/script"

export default function Home() {
  return (
    <>
      {/* Adiciona JSON-LD para Rich Snippets */}
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Organizaki",
            url: "https://organizaki.com.br",
            logo: "https://organizaki.com.br/logo.png",
            sameAs: [
              "https://facebook.com/organizaki",
              "https://instagram.com/organizaki",
              "https://twitter.com/organizaki",
              "https://linkedin.com/company/organizaki",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+551130001000",
              contactType: "customer service",
              availableLanguage: "Portuguese",
            },
          }),
        }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://organizaki.com.br",
            name: "Organizaki - Organize seus eventos em 3 passos",
            description: "Plataforma para organização de eventos como casamentos, aniversários e chás de bebê.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://organizaki.com.br/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section - Melhorado */}
          <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-16 md:pt-20 pb-16 md:pb-24">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-10 -top-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-5 text-center lg:text-left">
                  <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mx-auto lg:mx-0">
                    Organize seus eventos com facilidade
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none">
                      Crie seu evento em <span className="text-primary">apenas 3 passos</span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-xl max-w-[600px] mx-auto lg:mx-0">
                      Organize casamentos, aniversários e chás de bebê com facilidade. Convites, lista de presentes e
                      confirmações em um só lugar.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Button size="lg" className="gap-1 text-base" asChild>
                      <Link href="/register">
                        Começar agora <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-base" asChild>
                      <Link href="#como-funciona">Saiba mais</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                          <Image
                            src="/diverse-user-avatars.png"
                            alt="Usuário satisfeito com a plataforma Organizaki"
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">+2.500</span> eventos organizados
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-6 lg:mt-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/10">
                    <Image
                      src="/outdoor-wedding-ceremony.png"
                      alt="Cerimônia de casamento ao ar livre organizada com Organizaki"
                      width={600}
                      height={400}
                      className="rounded-xl object-cover w-full max-w-[500px] md:max-w-[600px]"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">15 de Dezembro, 2025</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-2">Casamento de João e Maria</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 relative">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-sm">
                  <div className="text-3xl font-bold text-primary">2.5K+</div>
                  <p className="text-muted-foreground">Eventos criados</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-sm">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-muted-foreground">Clientes satisfeitos</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-sm">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <p className="text-muted-foreground">Presentes escolhidos</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-sm">
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <p className="text-muted-foreground">Convidados gerenciados</p>
                </div>
              </div>
            </div>
          </section>

          {/* Anúncio após a seção hero */}
          <div className="container py-6">
            <AdBanner slot="1234567890" format="horizontal" className="mx-auto max-w-5xl" />
          </div>

          {/* Como Funciona Section - Melhorado */}
          <section id="como-funciona" className="py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Simples e Rápido
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Como funciona o Organizaki</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Crie sua página de evento personalizada em apenas 3 passos simples
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3 md:gap-12">
                <div className="flex flex-col items-center space-y-4 text-center relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Camera className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">1. Personalize seu evento</h3>
                  <p className="text-muted-foreground">
                    Adicione fotos, descrição, data, horário e localização do seu evento.
                  </p>
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Gift className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">2. Monte sua lista de presentes</h3>
                  <p className="text-muted-foreground">Crie uma lista de presentes com links para lojas parceiras.</p>
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">3. Convide seus convidados</h3>
                  <p className="text-muted-foreground">Cadastre a lista de convidados e envie os convites digitais.</p>
                </div>
              </div>

              {/* Demo Preview */}
              <div className="mt-8 flex justify-center">
                <div className="relative max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl border border-primary/10">
                  <Image
                    src="/placeholder.svg?key=bpljd"
                    alt="Preview da plataforma Organizaki mostrando o painel de controle"
                    width={1200}
                    height={600}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                    <div className="p-6 md:p-8 w-full">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        Veja como é fácil gerenciar seu evento
                      </h3>
                      <p className="text-white/80 mb-4 max-w-2xl">
                        Interface intuitiva para controlar todos os aspectos do seu evento em um só lugar.
                      </p>
                      <Button asChild size="lg" className="mt-2">
                        <Link href="/evento/demo">Ver demonstração</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Anúncio após a seção como funciona */}
          <div className="container py-6">
            <AdBanner slot="2345678901" format="rectangle" className="mx-auto max-w-5xl" />
          </div>

          {/* Funcionalidades Section - Melhorado */}
          <section id="funcionalidades" className="bg-muted/40 py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Recursos Completos
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Funcionalidades para todos</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Tudo o que você e seus convidados precisam em um só lugar
                  </p>
                </div>
              </div>

              {/* Para Organizadores */}
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div className="rounded-xl border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl">
                  <h3 className="mb-6 text-2xl font-bold">Para Organizadores do Evento</h3>
                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Criação de Evento</h4>
                        <p className="text-muted-foreground">
                          Upload de foto, descrição personalizada, data, horário e localização com integração ao Google
                          Maps.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Lista de Presentes</h4>
                        <p className="text-muted-foreground">
                          Monte listas com nome, imagem e link para compra. Acompanhe presentes escolhidos e organize
                          por categorias.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Lista de Convidados</h4>
                        <p className="text-muted-foreground">
                          Insira e-mails, nomes ou compartilhe um link único. Controle de confirmações e visualização de
                          status.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <List className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Painel de Controle</h4>
                        <p className="text-muted-foreground">
                          Visualize confirmações, presentes escolhidos, edite dados e acompanhe estatísticas do evento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Para Convidados */}
                <div className="rounded-xl border bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl">
                  <h3 className="mb-6 text-2xl font-bold">Para Convidados</h3>
                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Página do Evento</h4>
                        <p className="text-muted-foreground">
                          Visualização bonita com foto, descrição, data, local e mapa. Botões para confirmar presença e
                          escolher presentes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Escolha de Presente</h4>
                        <p className="text-muted-foreground">
                          Navegue pela lista, reserve itens, seja redirecionado para compra e marque como comprado.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Localização Fácil</h4>
                        <p className="text-muted-foreground">
                          Acesse o mapa do local do evento diretamente na página, com opções de navegação.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Bell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">Notificações</h4>
                        <p className="text-muted-foreground">
                          Receba lembretes sobre o evento e atualizações caso haja mudanças de data ou local.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Anúncio após a seção funcionalidades */}
          <div className="container py-6">
            <AdBanner slot="3456789012" format="horizontal" className="mx-auto max-w-5xl" />
          </div>

          {/* Benefícios Section - Melhorado */}
          <section id="beneficios" className="py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute right-1/3 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Por que escolher
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Benefícios do Organizaki</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Tudo o que você precisa para organizar seu evento com tranquilidade
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
                <div className="rounded-xl border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Economize Tempo</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Organize tudo em minutos, sem precisar lidar com múltiplas plataformas.
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Tudo Integrado</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Convites, presentes e confirmações em um só lugar, facilitando o controle.
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Experiência Agradável</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Interface intuitiva e bonita tanto para organizadores quanto para convidados.
                  </p>
                </div>
              </div>

              {/* Testimonials */}
              <div className="mt-8 max-w-5xl mx-auto">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-background p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src="/diverse-user-avatars.png"
                          alt="Ana Silva, usuária satisfeita do Organizaki"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="italic text-muted-foreground">
                          "Organizei meu casamento em menos de uma semana! A plataforma é super intuitiva e os
                          convidados adoraram a facilidade para confirmar presença."
                        </p>
                        <p className="mt-2 font-medium">Ana Silva</p>
                        <p className="text-sm text-muted-foreground">Noiva, São Paulo</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src="/diverse-user-avatars.png"
                          alt="Carlos Oliveira, usuário satisfeito do Organizaki"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="italic text-muted-foreground">
                          "A lista de presentes foi um sucesso! Consegui organizar tudo por categorias e os convidados
                          puderam escolher facilmente o que queriam dar."
                        </p>
                        <p className="mt-2 font-medium">Carlos Oliveira</p>
                        <p className="text-sm text-muted-foreground">Aniversariante, Rio de Janeiro</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Anúncio após a seção benefícios */}
          <div className="container py-6">
            <AdBanner slot="4567890123" format="rectangle" className="mx-auto max-w-5xl" />
          </div>

          {/* FAQ Section - Nova */}
          <section id="faq" className="bg-muted/40 py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/3 bottom-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Dúvidas Frequentes
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Perguntas Frequentes</h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Encontre respostas para as perguntas mais comuns sobre o Organizaki
                  </p>
                </div>
              </div>

              <div className="mx-auto max-w-3xl mt-12">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="item-1"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      Quanto custa usar o Organizaki?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      O Organizaki oferece um plano gratuito que permite criar um evento com até 50 convidados e 20
                      itens na lista de presentes. Para eventos maiores, oferecemos planos pagos a partir de R$ 29,90
                      por evento, com recursos adicionais como personalização avançada, domínio personalizado e suporte
                      prioritário.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      Como os convidados confirmam presença?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      Os convidados recebem um link único por e-mail ou mensagem que os direciona para a página do seu
                      evento. Lá, eles podem confirmar ou recusar o convite, informar quantas pessoas irão e até deixar
                      uma mensagem para os anfitriões. Você recebe notificações em tempo real para cada confirmação.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      Como funciona a lista de presentes?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      Você pode adicionar presentes manualmente com nome, descrição, preço e link para compra, ou
                      importar produtos diretamente de lojas parceiras. Os convidados podem reservar presentes, sendo
                      redirecionados para o site da loja para finalizar a compra. Após a compra, eles marcam o presente
                      como comprado, e você recebe uma notificação.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      Posso personalizar a aparência da página do meu evento?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      Sim! Você pode personalizar cores, fontes, imagens de fundo e outros elementos visuais da página
                      do seu evento. Nos planos pagos, você tem acesso a temas exclusivos e opções avançadas de
                      personalização, incluindo a possibilidade de adicionar seu próprio logotipo e usar um domínio
                      personalizado.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-5"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      É possível enviar lembretes para os convidados?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      Sim, o Organizaki permite enviar lembretes automáticos por e-mail ou SMS para os convidados que
                      ainda não confirmaram presença ou para todos os convidados alguns dias antes do evento. Você pode
                      personalizar o texto dos lembretes e escolher quando eles serão enviados.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-6"
                    className="border rounded-lg px-6 mb-4 bg-background/80 backdrop-blur-sm shadow-sm"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4">
                      Posso exportar a lista de convidados e presentes?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      Sim, você pode exportar a lista de convidados e presentes em formatos como Excel, CSV ou PDF. Isso
                      facilita o compartilhamento com outros organizadores ou para uso em outras ferramentas. As listas
                      exportadas incluem todas as informações relevantes, como status de confirmação, mensagens e
                      detalhes de contato.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">Não encontrou o que procurava? Entre em contato conosco</p>
                  <Button asChild variant="outline">
                    <Link href="#">Fale Conosco</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Anúncio antes do CTA final */}
          <div className="container py-6">
            <AdBanner slot="5678901234" format="horizontal" className="mx-auto max-w-5xl" />
          </div>

          {/* CTA Section - Melhorado */}
          <section className="bg-primary text-primary-foreground py-20 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-10 -top-10 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl"></div>
            </div>
            <div className="container relative px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Pronto para criar seu evento?
                  </h2>
                  <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Comece agora mesmo e organize seu evento em minutos
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" variant="secondary" className="gap-1 text-base" asChild>
                    <Link href="/register">
                      Criar meu evento <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base"
                    asChild
                  >
                    <Link href="/evento/demo">Ver demonstração</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
