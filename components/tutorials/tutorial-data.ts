import type { TutorialContent } from "./tutorial-modal"

// Adicionando propriedades extras para os cards
export interface TutorialData extends TutorialContent {
  subtitle: string
  description: string
}

export const tutorials: TutorialData[] = [
  {
    id: "primeiro-evento",
    title: "Criando seu primeiro evento",
    subtitle: "Tutorial passo a passo para iniciantes",
    description: "Aprenda a criar seu primeiro evento do zero, configurando todas as opções essenciais.",
    steps: [
      {
        title: "Acesse a página de criação de eventos",
        content:
          "Após fazer login, navegue até o Dashboard e clique no botão 'Criar Novo Evento' ou acesse diretamente a página de criação de eventos através do menu lateral.",
        image: "/placeholder.svg?key=lv55g",
      },
      {
        title: "Preencha as informações básicas",
        content:
          "Insira o nome do evento, data, horário e local. Estas são informações essenciais que seus convidados precisarão saber. Seja específico com o nome do evento para que ele seja facilmente identificável.",
        image: "/placeholder.svg?key=ottzr",
      },
      {
        title: "Adicione uma descrição e imagens",
        content:
          "Escreva uma descrição detalhada do seu evento e adicione imagens que representem bem a ocasião. Imagens de alta qualidade ajudam a criar uma primeira impressão positiva para seus convidados.",
        image: "/placeholder.svg?key=a1rv4",
      },
      {
        title: "Configure as opções de RSVP",
        content:
          "Defina como os convidados confirmarão presença. Você pode permitir que tragam acompanhantes, solicitar informações adicionais como restrições alimentares, e estabelecer uma data limite para confirmação.",
        image: "/placeholder.svg?key=zz0z8",
      },
      {
        title: "Publique seu evento",
        content:
          "Revise todas as informações e, quando estiver satisfeito, clique em 'Publicar Evento'. Você receberá um link único que pode ser compartilhado com seus convidados através de e-mail, mensagens ou redes sociais.",
        image: "/placeholder.svg?key=yfoac",
      },
    ],
  },
  {
    id: "gerenciando-convidados",
    title: "Gerenciando convidados",
    subtitle: "Como organizar e acompanhar sua lista",
    description: "Aprenda técnicas avançadas para gerenciar grandes listas de convidados com eficiência.",
    steps: [
      {
        title: "Importe sua lista de convidados",
        content:
          "Comece importando seus contatos de uma planilha ou adicionando-os manualmente. Organize-os em grupos como 'Família', 'Amigos', 'Colegas de trabalho' para facilitar a comunicação.",
        image: "/placeholder.svg?height=400&width=600&query=importando lista de convidados",
      },
      {
        title: "Envie convites personalizados",
        content:
          "Utilize os modelos de convite disponíveis ou crie o seu próprio. Personalize a mensagem para cada grupo de convidados para tornar o convite mais especial e relevante.",
        image: "/placeholder.svg?height=400&width=600&query=enviando convites personalizados",
      },
      {
        title: "Acompanhe as confirmações",
        content:
          "Monitore quem confirmou, recusou ou ainda não respondeu através do painel de controle. O sistema atualiza automaticamente quando um convidado responde ao convite.",
        image: "/placeholder.svg?height=400&width=600&query=dashboard de confirmações de convidados",
      },
      {
        title: "Envie lembretes e atualizações",
        content:
          "Configure lembretes automáticos para serem enviados aos convidados que ainda não responderam. Também é possível enviar atualizações sobre mudanças no evento para todos os convidados.",
        image: "/placeholder.svg?height=400&width=600&query=enviando lembretes para convidados",
      },
      {
        title: "Exporte relatórios detalhados",
        content:
          "Gere relatórios com informações detalhadas sobre seus convidados, incluindo preferências alimentares, necessidades especiais e outras informações coletadas durante a confirmação.",
        image: "/placeholder.svg?height=400&width=600&query=relatório de lista de convidados",
      },
    ],
  },
  {
    id: "listas-presentes",
    title: "Criando listas de presentes",
    subtitle: "Organize presentes por categorias",
    description: "Aprenda a criar listas de presentes organizadas e atraentes para seus convidados.",
    steps: [
      {
        title: "Crie categorias para sua lista",
        content:
          "Organize sua lista de presentes em categorias como 'Cozinha', 'Quarto', 'Sala de Estar', etc. Isso facilita a navegação dos convidados e ajuda a garantir que você receba presentes de todas as áreas necessárias.",
        image: "/placeholder.svg?height=400&width=600&query=categorias de lista de presentes",
      },
      {
        title: "Adicione itens com detalhes",
        content:
          "Para cada item, adicione uma descrição detalhada, preço estimado, prioridade e, se possível, um link para compra online. Quanto mais informações você fornecer, mais fácil será para seus convidados escolherem o presente perfeito.",
        image: "/placeholder.svg?height=400&width=600&query=adicionando itens à lista de presentes",
      },
      {
        title: "Defina opções de colaboração",
        content:
          "Para itens mais caros, habilite a opção de 'presente coletivo', permitindo que vários convidados contribuam com um valor para o mesmo item. Defina valores mínimos de contribuição se necessário.",
        image: "/placeholder.svg?height=400&width=600&query=configurando presente coletivo",
      },
      {
        title: "Personalize a visualização da lista",
        content:
          "Escolha como sua lista será exibida para os convidados. Você pode optar por mostrar ou ocultar preços, ordenar por prioridade ou categoria, e adicionar uma mensagem personalizada no topo da página.",
        image: "/placeholder.svg?height=400&width=600&query=personalizando visualização de lista de presentes",
      },
      {
        title: "Acompanhe os presentes escolhidos",
        content:
          "Monitore quais presentes já foram escolhidos e por quem. O sistema atualiza automaticamente a lista para evitar presentes duplicados e você pode enviar agradecimentos personalizados diretamente pela plataforma.",
        image: "/placeholder.svg?height=400&width=600&query=monitorando presentes escolhidos",
      },
    ],
  },
  {
    id: "personalizando-evento",
    title: "Personalizando seu evento",
    subtitle: "Dicas de design e personalização",
    description: "Aprenda técnicas de design para criar uma página de evento única e memorável.",
    steps: [
      {
        title: "Escolha um tema visual",
        content:
          "Selecione um tema que reflita o estilo do seu evento. A plataforma oferece diversos temas pré-definidos que podem ser personalizados com suas cores e fontes preferidas.",
        image: "/placeholder.svg?height=400&width=600&query=selecionando tema visual para evento",
      },
      {
        title: "Personalize cores e fontes",
        content:
          "Ajuste as cores principais e secundárias para combinar com o tema do seu evento. Escolha fontes que sejam legíveis e que complementem o estilo visual que você deseja criar.",
        image: "/placeholder.svg?height=400&width=600&query=personalizando cores e fontes de página de evento",
      },
      {
        title: "Adicione elementos visuais",
        content:
          "Incorpore fotos de alta qualidade, vídeos curtos ou animações sutis para tornar sua página mais dinâmica. Lembre-se que menos é mais - mantenha o design limpo e focado nas informações importantes.",
        image: "/placeholder.svg?height=400&width=600&query=adicionando elementos visuais à página de evento",
      },
      {
        title: "Crie seções personalizadas",
        content:
          "Além das seções padrão, crie áreas personalizadas como 'Nossa História', 'Como Chegar', ou 'Acomodações Sugeridas'. Organize as seções na ordem que fizer mais sentido para o seu evento.",
        image: "/placeholder.svg?height=400&width=600&query=criando seções personalizadas em página de evento",
      },
      {
        title: "Teste em diferentes dispositivos",
        content:
          "Verifique como sua página aparece em smartphones, tablets e computadores. A plataforma é responsiva, mas é sempre bom conferir se todos os elementos estão sendo exibidos corretamente em todos os dispositivos.",
        image: "/placeholder.svg?height=400&width=600&query=testando página de evento em diferentes dispositivos",
      },
    ],
  },
]
