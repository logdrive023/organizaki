import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Política de Cookies | Organizaki",
  description: "Política de cookies da plataforma Organizaki",
}

export default function PoliticaDeCookiesPage() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Política de Cookies</h1>
            <p className="text-muted-foreground text-sm border-b pb-4 mb-6">Última atualização: 6 de maio de 2024</p>
          </div>

          <div className="space-y-8 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">1. O que são Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet,
              smartphone) quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de
              maneira mais eficiente, bem como fornecer informações aos proprietários do site.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">2. Como Usamos os Cookies</h2>
            <p className="text-gray-700 mb-4">O Organizaki utiliza cookies para diversos fins, incluindo:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                <strong className="font-medium">Cookies Essenciais:</strong> Necessários para o funcionamento básico do
                site. Eles permitem que você navegue pelo site e use recursos essenciais, como áreas seguras e criação
                de eventos.
              </li>
              <li>
                <strong className="font-medium">Cookies de Preferências:</strong> Permitem que o site lembre informações
                que mudam a aparência ou o comportamento do site, como seu idioma preferido ou a região em que você
                está.
              </li>
              <li>
                <strong className="font-medium">Cookies de Estatísticas:</strong> Ajudam-nos a entender como os
                visitantes interagem com o site, coletando e relatando informações anonimamente. Isso nos ajuda a
                melhorar o site.
              </li>
              <li>
                <strong className="font-medium">Cookies de Marketing:</strong> Usados para rastrear visitantes em sites.
                A intenção é exibir anúncios relevantes e envolventes para o usuário individual.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">3. Tipos de Cookies que Utilizamos</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.1 Cookies de Sessão</h3>
            <p className="text-gray-700 mb-4">
              Estes cookies são temporários e são excluídos do seu dispositivo quando você fecha o navegador. Eles são
              usados para manter o estado da sua sessão enquanto você navega pelo site.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.2 Cookies Persistentes</h3>
            <p className="text-gray-700 mb-4">
              Estes cookies permanecem no seu dispositivo por um período específico ou até que você os exclua
              manualmente. Eles são usados para lembrar suas preferências ou ações em nosso site.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.3 Cookies Próprios</h3>
            <p className="text-gray-700 mb-4">
              Estes são cookies definidos por nós e usados para melhorar a funcionalidade do nosso site.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3.4 Cookies de Terceiros</h3>
            <p className="text-gray-700 mb-4">
              Estes são cookies definidos por terceiros, como Google Analytics, que usamos para coletar informações
              sobre como os visitantes usam nosso site.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">4. Cookies Específicos que Utilizamos</h2>
            <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome do Cookie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Finalidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">session</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Mantém o estado da sessão do usuário
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Sessão</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Essencial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">auth_token</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Mantém o usuário conectado</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">30 dias</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Essencial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">language</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Armazena a preferência de idioma
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1 ano</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Preferência</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_ga</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Google Analytics - Distingue usuários
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2 anos</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Estatística</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_gid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Google Analytics - Distingue usuários
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">24 horas</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Estatística</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_fbp</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      Facebook Pixel - Rastreia conversões
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3 meses</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Marketing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">5. Controle de Cookies</h2>
            <p className="text-gray-700 mb-4">
              A maioria dos navegadores permite que você controle cookies através das configurações de preferências. No
              entanto, se você limitar a capacidade dos sites de definir cookies, isso pode afetar sua experiência geral
              do usuário e, em alguns casos, impedir que você salve configurações personalizadas, como informações de
              login.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">
              5.1 Como Gerenciar Cookies em Diferentes Navegadores
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                <strong className="font-medium">Google Chrome:</strong> Menu {">"} Configurações {">"} Avançado {">"}{" "}
                Privacidade e segurança {">"} Configurações de conteúdo {">"} Cookies
              </li>
              <li>
                <strong className="font-medium">Mozilla Firefox:</strong> Menu {">"} Opções {">"} Privacidade e
                Segurança {">"} Cookies e dados do site
              </li>
              <li>
                <strong className="font-medium">Safari:</strong> Preferências {">"} Privacidade {">"} Cookies e dados do
                site
              </li>
              <li>
                <strong className="font-medium">Microsoft Edge:</strong> Menu {">"} Configurações {">"} Cookies e
                permissões do site {">"} Cookies
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">6. Cookies e Publicidade</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies para personalizar anúncios exibidos em nosso site e em sites de terceiros. Esses
              cookies coletam informações sobre suas atividades online para tornar a publicidade mais relevante para
              seus interesses.
            </p>
            <p className="text-gray-700 mb-4">Você pode optar por não receber publicidade personalizada visitando:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                  Digital Advertising Alliance
                </a>
              </li>
              <li>
                <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">
                  European Interactive Digital Advertising Alliance
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">7. Alterações na Política de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Podemos atualizar nossa Política de Cookies periodicamente. Quando fizermos alterações, atualizaremos a
              data de "Última atualização" no topo desta política. Recomendamos que você revise esta política
              regularmente para estar ciente de quaisquer alterações.
            </p>

            <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">8. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco:
            </p>
            <p className="text-gray-700 mb-4">
              E-mail: contato@organizaki.com.br
              <br />
              Endereço: Av. Paulista, 1000, São Paulo - SP, 01310-100, Brasil
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
