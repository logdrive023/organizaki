import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Política de Privacidade | Organizaki",
  description: "Política de privacidade da plataforma Organizaki",
}

export default function PoliticaDePrivacidadePage() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Política de Privacidade</h1>
            <p className="text-muted-foreground text-sm border-b pb-4 mb-6">Última atualização: 6 de maio de 2024</p>
          </div>

          <div className="space-y-8 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">1. Introdução</h2>
            <p className="text-gray-700 mb-4">
              O Organizaki ("nós", "nosso" ou "nossa") está comprometido em proteger sua privacidade. Esta Política de
              Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você
              usa nosso site e serviços.
            </p>
            <p className="text-gray-700 mb-4">
              Ao usar o Organizaki, você concorda com a coleta e uso de informações de acordo com esta política.
              Processamos seus dados pessoais apenas para os fins descritos nesta Política de Privacidade e de acordo
              com a legislação de proteção de dados aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD).
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">2. Informações que Coletamos</h2>
            <p className="text-gray-700 mb-4">Coletamos os seguintes tipos de informações:</p>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2.1 Informações Fornecidas por Você</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Informações de registro: nome, endereço de e-mail, senha, número de telefone</li>
              <li>Informações de perfil: foto, biografia, preferências</li>
              <li>
                Informações de evento: detalhes sobre eventos que você cria, incluindo datas, locais, descrições,
                imagens
              </li>
              <li>
                Informações de convidados: nomes e informações de contato das pessoas que você convida para seus eventos
              </li>
              <li>Informações de presentes: detalhes sobre itens em sua lista de presentes</li>
              <li>Comunicações: mensagens que você envia através de nossa plataforma</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2.2 Informações Coletadas Automaticamente</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Informações de uso: como você interage com nosso site e serviços</li>
              <li>Informações do dispositivo: tipo de dispositivo, sistema operacional, navegador</li>
              <li>Informações de localização: localização geral baseada no endereço IP</li>
              <li>Cookies e tecnologias similares: conforme descrito em nossa Política de Cookies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">3. Como Usamos Suas Informações</h2>
            <p className="text-gray-700 mb-4">Usamos suas informações para os seguintes fins:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar e gerenciar sua conta</li>
              <li>Facilitar a criação e gerenciamento de eventos</li>
              <li>Permitir a comunicação entre organizadores de eventos e convidados</li>
              <li>Enviar notificações, atualizações e informações relacionadas ao serviço</li>
              <li>Responder a suas solicitações, perguntas e comentários</li>
              <li>Monitorar e analisar tendências, uso e atividades</li>
              <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">4. Compartilhamento de Informações</h2>
            <p className="text-gray-700 mb-4">Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Com convidados e participantes de eventos que você organiza</li>
              <li>Com organizadores de eventos dos quais você participa</li>
              <li>Com prestadores de serviços que trabalham em nosso nome</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger direitos, propriedade ou segurança</li>
              <li>Em conexão com uma fusão, venda de ativos ou financiamento</li>
              <li>Com seu consentimento ou sob sua direção</li>
            </ul>
            <p className="text-gray-700 mb-4">Não vendemos suas informações pessoais a terceiros.</p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">5. Segurança de Dados</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações
              pessoais contra acesso não autorizado, uso indevido ou divulgação. No entanto, nenhum método de
              transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir sua
              segurança absoluta.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">6. Retenção de Dados</h2>
            <p className="text-gray-700 mb-4">
              Mantemos suas informações pessoais pelo tempo necessário para cumprir os fins descritos nesta Política de
              Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">7. Seus Direitos</h2>
            <p className="text-gray-700 mb-4">
              De acordo com a legislação de proteção de dados aplicável, você tem os seguintes direitos em relação às
              suas informações pessoais:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Direito de acesso: solicitar acesso às suas informações pessoais</li>
              <li>Direito de retificação: solicitar a correção de informações imprecisas</li>
              <li>Direito de exclusão: solicitar a exclusão de suas informações pessoais</li>
              <li>Direito de restrição: solicitar a restrição do processamento de suas informações</li>
              <li>Direito de portabilidade: receber suas informações em formato estruturado</li>
              <li>Direito de oposição: opor-se ao processamento de suas informações</li>
              <li>Direito de retirar o consentimento: retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Para exercer esses direitos, entre em contato conosco usando as informações fornecidas na seção "Contato"
              abaixo.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">8. Transferências Internacionais</h2>
            <p className="text-gray-700 mb-4">
              Suas informações podem ser transferidas e processadas em países diferentes daquele em que você reside.
              Esses países podem ter leis de proteção de dados diferentes das leis do seu país. Quando transferimos suas
              informações para outros países, tomamos medidas para garantir que elas sejam protegidas adequadamente.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">9. Crianças</h2>
            <p className="text-gray-700 mb-4">
              Nossos serviços não são direcionados a pessoas com menos de 18 anos, e não coletamos intencionalmente
              informações pessoais de crianças. Se soubermos que coletamos informações pessoais de uma criança,
              tomaremos medidas para excluir essas informações o mais rápido possível.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">10. Alterações nesta Política</h2>
            <p className="text-gray-700 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre
              disponível em nosso site, e a data da última atualização será indicada no topo desta página. Recomendamos
              que você revise esta política regularmente para estar ciente de quaisquer alterações.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">11. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao
              processamento de suas informações pessoais, entre em contato conosco:
            </p>
            <p className="text-gray-700 mb-4">
              E-mail: contato@organizaki.com.br
              <br />
              Endereço: Av. Paulista, 1000, São Paulo - SP, 01310-100, Brasil
            </p>
            <p className="text-gray-700 mb-4">
              Responderemos à sua solicitação dentro do prazo estabelecido pela legislação aplicável.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
