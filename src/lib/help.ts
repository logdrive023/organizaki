/**
 * "Precisa de ajuda?" da Kiki: perguntas prontas por lugar do app, cada resposta com um atalho para a tela certa.
 * Sem servidor e sem IA: respostas curtas, conferidas com o que o produto faz de verdade (mesmo esquema do VanAaki).
 */
export interface HelpAction {
  label: string
  /** rota do app (ex.: '/painel/convidados') */
  to?: string
  /** clica num elemento da página (ex.: '[data-tab=presenca]') */
  click?: string
  /** rola até um elemento (ex.: '#local') */
  scroll?: string
  /** entra na demonstração (só no build do Pages) */
  demo?: boolean
}
export interface HelpItem {
  q: string
  a: string
  action?: HelpAction
}
export type HelpPlace = 'site' | 'painel' | 'convite'

export const HELP: Record<HelpPlace, { hi: string; items: HelpItem[] }> = {
  site: {
    hi: 'Oi! Eu sou a Kiki 🎁 Ajudo você a organizar a sua festa sem planilha. O que você quer saber?',
    items: [
      { q: 'Como eu vejo funcionando?', a: 'Abra a demonstração: tem um casamento de exemplo pronto, com convidados e lista de presentes. Sem cadastro e sem cartão.', action: { label: 'Testar a demonstração', demo: true, to: '/e/demo' } },
      { q: 'Quanto custa?', a: 'Criar o evento, convidar e montar a lista é grátis, sem limite de convidados. O Premium (R$ 10,00, uma vez só) só tira os anúncios do seu painel.' },
      { q: 'Meus convidados precisam baixar algo?', a: 'Não. Eles abrem o link pelo WhatsApp, tocam em "Vou!" e pronto. Nada de conta nem aplicativo.' },
      { q: 'Como o convidado chega no local?', a: 'O convite mostra o mapa e tem os botões do Waze e do Google Maps: um toque e a rota já começa.' },
      { q: 'E se duas pessoas quiserem o mesmo presente?', a: 'Não acontece: cada escolha é reservada na hora, e quando acabam as unidades o presente sai da lista.' },
      { q: 'Não fica feio mandar lista de presentes?', a: 'Pelo contrário! O convidado agradece por não ter que adivinhar — e você não ganha a terceira cafeteira.' },
    ],
  },
  painel: {
    hi: 'Oi! Sou a Kiki 🎁 Me pergunte qualquer coisa do seu evento.',
    items: [
      { q: 'Como eu publico o meu evento?', a: 'Abra o evento e toque em "Publicar". Antes disso ele é um rascunho e o link não abre para ninguém.', action: { label: 'Ver meus eventos', to: '/painel' } },
      { q: 'Como eu convido pelo WhatsApp?', a: 'Em Convidados, marque quem você quer e toque em "Convidar". Cada pessoa ganha um link próprio, com o nome já preenchido.', action: { label: 'Abrir convidados', to: '/painel/convidados' } },
      { q: 'Como eu monto a lista de presentes?', a: 'Em Presentes, toque em "Adicionar presente": nome, preço, foto e o link da loja. Pode colocar quantidade também.', action: { label: 'Abrir presentes', to: '/painel/presentes' } },
      { q: 'Como eu sei quem confirmou?', a: 'Na aba Resumo de cada evento (ou em Números): quantas pessoas vão, com acompanhantes, e quem ainda não respondeu.', action: { label: 'Ver os números', to: '/painel/estatisticas' } },
      { q: 'Alguém desistiu do presente. E agora?', a: 'Abra o presente e toque na setinha ao lado do nome da pessoa: a escolha é liberada e o presente volta para a lista.' },
      { q: 'Como eu tiro os anúncios?', a: 'Em Ajustes → Anúncios. É o Premium: R$ 10,00, uma vez só, para sempre.', action: { label: 'Abrir ajustes', to: '/painel/configuracoes?aba=premium' } },
    ],
  },
  convite: {
    hi: 'Oi! Sou a Kiki 🎁 Posso ajudar com o convite?',
    items: [
      { q: 'Como eu confirmo presença?', a: 'Toque em "Confirmar", escolha "Vou!" e coloque seu nome e e-mail. Quem convidou fica sabendo na hora.', action: { label: 'Confirmar agora', click: '[data-tab=presenca]' } },
      { q: 'Como eu chego lá?', a: 'No convite tem o mapa e os botões do Waze e do Google Maps: toque em um e a rota abre pronta.', action: { label: 'Ver o mapa', click: '[data-tab=info]', scroll: '#local' } },
      { q: 'Posso levar acompanhante?', a: 'Ao confirmar, diga quantas pessoas vão com você. Assim quem organiza já conta o seu lugar.' },
      { q: 'Como eu escolho um presente?', a: 'Em "Presentes", toque em "Escolher este" e coloque seu nome. Ele sai da lista para ninguém repetir. A compra é na loja que você preferir.', action: { label: 'Ver a lista', click: '[data-tab=presentes]' } },
      { q: 'Escolhi errado. E agora?', a: 'Neste mesmo celular, abra a lista e toque em "Desfazer". Se trocou de aparelho, avise quem convidou que eles liberam.' },
      { q: 'Posso mudar minha resposta?', a: 'Pode: é só responder de novo com o mesmo e-mail (ou pelo seu link de convite).' },
    ],
  },
}
