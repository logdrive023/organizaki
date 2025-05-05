import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Gift, Users, CheckCircle, MapPin, Camera, List, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Crie seu evento em apenas 3 passos
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-xl">
                    Organize casamentos, aniversários e chás de bebê com facilidade. Convites, lista de presentes e
                    confirmações em um só lugar.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button size="lg" className="gap-1" asChild>
                    <Link href="/register">
                      Começar agora <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#como-funciona">Saiba mais</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center mt-6 lg:mt-0">
                <Image
                  src="/placeholder.svg?key=s4e2i"
                  alt="Celebração de evento"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full max-w-[400px] md:max-w-[500px]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Simples e Rápido
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Como funciona o Evento Fácil</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Crie sua página de evento personalizada em apenas 3 passos simples
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1. Personalize seu evento</h3>
                <p className="text-muted-foreground">
                  Adicione fotos, descrição, data, horário e localização do seu evento.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2. Monte sua lista de presentes</h3>
                <p className="text-muted-foreground">Crie uma lista de presentes com links para lojas parceiras.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3. Convide seus convidados</h3>
                <p className="text-muted-foreground">Cadastre a lista de convidados e envie os convites digitais.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades Section */}
        <section id="funcionalidades" className="bg-muted py-16 md:py-24">
          <div className="container px-4 md:px-6">
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
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold">Para Organizadores do Evento</h3>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Lista de Presentes</h4>
                      <p className="text-muted-foreground">
                        Monte listas com nome, imagem e link para compra. Acompanhe presentes escolhidos e organize por
                        categorias.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <List className="h-5 w-5 text-primary" />
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
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold">Para Convidados</h3>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Escolha de Presente</h4>
                      <p className="text-muted-foreground">
                        Navegue pela lista, reserve itens, seja redirecionado para compra e marque como comprado.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Localização Fácil</h4>
                      <p className="text-muted-foreground">
                        Acesse o mapa do local do evento diretamente na página, com opções de navegação.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Bell className="h-5 w-5 text-primary" />
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

        {/* Benefícios Section */}
        <section id="beneficios" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Por que escolher
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Benefícios do Evento Fácil</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tudo o que você precisa para organizar seu evento com tranquilidade
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="rounded-xl border bg-background p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 text-xl font-bold">Economize Tempo</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Organize tudo em minutos, sem precisar lidar com múltiplas plataformas.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 text-xl font-bold">Tudo Integrado</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Convites, presentes e confirmações em um só lugar, facilitando o controle.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 text-xl font-bold">Experiência Agradável</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Interface intuitiva e bonita tanto para organizadores quanto para convidados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Pronto para criar seu evento?</h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comece agora mesmo e organize seu evento em minutos
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="gap-1" asChild>
                  <Link href="/register">
                    Criar meu evento <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
  )
}
