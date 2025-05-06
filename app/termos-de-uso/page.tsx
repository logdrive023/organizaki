import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Termos de Uso | Organizaki",
  description: "Termos e condições de uso da plataforma Organizaki",
}

export default function TermosDeUsoPage() {
  return (
    <>
      <Header />
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Termos de Uso</h1>
            <p className="text-muted-foreground text-sm border-b pb-4 mb-6">Última atualização: 6 de maio de 2024</p>
          </div>

          <div className="space-y-8 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 mb-4">
              Ao acessar ou usar o Organizaki, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você
              não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 mb-4">
              O Organizaki é uma plataforma online que permite aos usuários criar, gerenciar e compartilhar eventos, bem
              como gerenciar listas de presentes e convidados. Nossos serviços incluem, mas não se limitam a:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Criação e gerenciamento de eventos</li>
              <li>Gerenciamento de listas de presentes</li>
              <li>Gerenciamento de convidados</li>
              <li>Compartilhamento de eventos</li>
              <li>Confirmação de presença</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">3. Cadastro e Conta</h2>
            <p className="text-gray-700 mb-4">
              Para utilizar determinados recursos do Organizaki, você precisará criar uma conta. Você é responsável por
              manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua
              conta. Você concorda em:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Fornecer informações precisas, atuais e completas durante o processo de registro</li>
              <li>Manter e atualizar prontamente suas informações de registro</li>
              <li>Notificar imediatamente o Organizaki sobre qualquer uso não autorizado de sua conta</li>
              <li>Ser responsável por todas as atividades que ocorrem sob sua conta</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">4. Conteúdo do Usuário</h2>
            <p className="text-gray-700 mb-4">
              Ao enviar, postar ou exibir conteúdo no Organizaki, você concede ao Organizaki uma licença mundial, não
              exclusiva, livre de royalties para usar, reproduzir, adaptar, publicar, traduzir e distribuir seu conteúdo
              em qualquer mídia existente ou futura.
            </p>
            <p className="text-gray-700 mb-4">
              Você é o único responsável por todo o conteúdo que enviar, postar ou exibir no Organizaki. Você declara e
              garante que:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                Possui ou tem as licenças, direitos, consentimentos e permissões necessários para usar e autorizar o
                Organizaki a usar todo o conteúdo
              </li>
              <li>
                O conteúdo não viola os direitos de privacidade, direitos de publicidade, direitos autorais, direitos
                contratuais ou quaisquer outros direitos de qualquer pessoa
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">5. Conduta Proibida</h2>
            <p className="text-gray-700 mb-4">Você concorda em não usar o Organizaki para:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Violar qualquer lei aplicável ou regulamento</li>
              <li>Infringir os direitos de qualquer terceiro</li>
              <li>
                Publicar ou transmitir qualquer material que seja ilegal, ofensivo, difamatório, fraudulento ou de
                qualquer forma questionável
              </li>
              <li>Interferir na operação normal do Organizaki</li>
              <li>Coletar ou armazenar dados pessoais de outros usuários</li>
              <li>Enviar spam, correntes ou outros tipos de comunicações não solicitadas</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">6. Propriedade Intelectual</h2>
            <p className="text-gray-700 mb-4">
              O Organizaki e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva
              do Organizaki e seus licenciadores. O serviço é protegido por direitos autorais, marcas registradas e
              outras leis de propriedade intelectual do Brasil e de outros países.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 mb-4">
              Em nenhuma circunstância o Organizaki, seus diretores, funcionários, parceiros, agentes, fornecedores ou
              afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou
              punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas
              intangíveis, resultantes de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Seu acesso ou uso ou incapacidade de acessar ou usar o serviço</li>
              <li>Qualquer conduta ou conteúdo de terceiros no serviço</li>
              <li>Qualquer conteúdo obtido do serviço</li>
              <li>Acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">8. Modificações dos Termos</h2>
            <p className="text-gray-700 mb-4">
              O Organizaki reserva-se o direito de modificar ou substituir estes Termos a qualquer momento. Se uma
              revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que
              quaisquer novos termos entrem em vigor.
            </p>
            <p className="text-gray-700 mb-4">
              Ao continuar a acessar ou usar nosso serviço após essas revisões se tornarem efetivas, você concorda em
              estar vinculado aos termos revisados. Se você não concordar com os novos termos, deixe de usar o
              Organizaki.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">9. Lei Aplicável</h2>
            <p className="text-gray-700 mb-4">
              Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar suas
              disposições de conflito de leis.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">10. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail:
              contato@organizaki.com.br
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
