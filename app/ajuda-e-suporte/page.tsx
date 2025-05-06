import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactForm } from "@/components/support/contact-form"

export const metadata: Metadata = {
  title: "Ajuda e Suporte | Organizaki",
  description: "Central de ajuda e suporte da plataforma Organizaki",
}

export default function AjudaESuportePage() {
  return (
    <>
      <Header />
      <div className="container py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-primary">Central de Ajuda e Suporte</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Encontre respostas para suas dúvidas e obtenha suporte para usar o Organizaki
            </p>
          </div>

          <Tabs defaultValue="faq" className="max-w-4xl mx-auto mt-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">Perguntas frequentes</TabsTrigger>
              <TabsTrigger value="tutoriais">Tutoriais</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">
                    Como criar um novo evento?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">Para criar um novo evento, siga estes passos:</p>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                      <li>Faça login na sua conta Organizaki</li>
                      <li>Acesse o Dashboard e clique no botão "Novo Evento"</li>
                      <li>Preencha as informações básicas do evento (nome, data, local)</li>
                      <li>Adicione uma descrição e imagem de capa</li>
                      <li>Configure as opções adicionais conforme necessário</li>
                      <li>Clique em "Salvar" para criar seu evento</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">
                    Como gerenciar minha lista de convidados?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">Para gerenciar sua lista de convidados:</p>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                      <li>Acesse o Dashboard e selecione o evento desejado</li>
                      <li>Clique na aba "Convidados"</li>
                      <li>Para adicionar convidados individualmente, clique em "Adicionar Convidado"</li>
                      <li>Para importar uma lista, use a opção "Importar Convidados"</li>
                      <li>Você pode editar, remover ou enviar convites diretamente desta tela</li>
                      <li>Acompanhe as confirmações de presença em tempo real</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">
                    Como criar e gerenciar minha lista de presentes?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">Para criar e gerenciar sua lista de presentes:</p>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                      <li>Acesse o Dashboard e selecione o evento desejado</li>
                      <li>Clique na aba "Presentes"</li>
                      <li>Clique em "Adicionar Presente" para incluir itens individualmente</li>
                      <li>Preencha os detalhes do presente (nome, descrição, preço, imagem)</li>
                      <li>Você pode organizar os presentes em categorias</li>
                      <li>Acompanhe quais presentes já foram escolhidos pelos convidados</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">
                    Como compartilhar meu evento com os convidados?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">Existem várias maneiras de compartilhar seu evento:</p>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                      <li>Acesse o Dashboard e selecione o evento desejado</li>
                      <li>Clique no botão "Compartilhar" no topo da página</li>
                      <li>Você pode copiar o link direto para o evento</li>
                      <li>Compartilhar diretamente via WhatsApp, Facebook, Instagram ou e-mail</li>
                      <li>Enviar convites personalizados para sua lista de convidados</li>
                      <li>Gerar um QR Code que direciona para a página do evento</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">
                    Como personalizar a aparência da página do meu evento?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">Para personalizar a aparência da página do seu evento:</p>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                      <li>Acesse o Dashboard e selecione o evento desejado</li>
                      <li>Clique na aba "Personalização"</li>
                      <li>Escolha um tema predefinido ou personalize as cores</li>
                      <li>Adicione sua própria imagem de capa e logotipo</li>
                      <li>Personalize os textos e seções da página</li>
                      <li>Use a visualização prévia para ver como ficará para seus convidados</li>
                      <li>Salve as alterações quando estiver satisfeito com o resultado</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="tutoriais" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criando seu primeiro evento</CardTitle>
                    <CardDescription>Tutorial passo a passo para iniciantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Aprenda a criar seu primeiro evento do zero, configurando todas as opções essenciais.
                    </p>
                    <Button variant="outline" className="w-full">
                      Ver tutorial
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciando convidados</CardTitle>
                    <CardDescription>Como organizar e acompanhar sua lista</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Aprenda técnicas avançadas para gerenciar grandes listas de convidados com eficiência.
                    </p>
                    <Button variant="outline" className="w-full">
                      Ver tutorial
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Criando listas de presentes</CardTitle>
                    <CardDescription>Organize presentes por categorias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Aprenda a criar listas de presentes organizadas e atraentes para seus convidados.
                    </p>
                    <Button variant="outline" className="w-full">
                      Ver tutorial
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personalizando seu evento</CardTitle>
                    <CardDescription>Dicas de design e personalização</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Aprenda técnicas de design para criar uma página de evento única e memorável.
                    </p>
                    <Button variant="outline" className="w-full">
                      Ver tutorial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contato" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entre em contato conosco</CardTitle>
                  <CardDescription>Estamos aqui para ajudar com qualquer dúvida ou problema</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add a client component wrapper */}
                  <ContactForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  )
}
