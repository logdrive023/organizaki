// Vitrine do topo da landing: convites de exemplo que se revezam sozinhos (textos aprovados pela persona marketing).
// Tudo aqui é ilustração — nomes, datas e "atividade" são fictícios, não números do produto.
// Fotos: Unsplash (licença livre), baixadas para public/img/vitrine — créditos em public/img/vitrine/CREDITOS.md.

export interface ShowcaseGift {
  name: string
  priceCents: number
  img: string
}

export interface Showcase {
  type: string
  title: string
  daysLeft: number
  when: string
  place: string
  covers: string[] // mais de uma foto: a capa também varia entre as voltas
  gifts: ShowcaseGift[]
}

const g = (name: string, priceCents: number, img: string): ShowcaseGift => ({ name, priceCents, img })


export const showcase: Showcase[] = [
  {
    type: 'Casamento', title: 'Casamento de Ana e Leo', daysLeft: 58, when: 'Sábado, 17h', place: 'Espaço Villa Garden',
    covers: ['capa-casamento-1', 'capa-casamento-5'],
    gifts: [g('Cafeteira elétrica', 18990, 'presente-cafeteira'), g('Jogo de taças de cristal', 24990, 'vitrine/presente-tacas'), g('Jogo de cama queen 400 fios', 32900, 'presente-cama')],
  },
  {
    type: 'Chá de casa nova', title: 'Casa nova da Bia e do Rafa', daysLeft: 12, when: 'Domingo, 14h', place: 'Ap. 302 · Vila Mariana',
    covers: ['capa-casa-nova'],
    gifts: [g('Jogo de panelas antiaderente', 39990, 'presente-panelas'), g('Aspirador robô', 89990, 'presente-aspirador'), g('Kit de toalhas de banho', 14990, 'vitrine/presente-toalhas')],
  },
  {
    type: 'Chá de bebê', title: 'Chá de bebê do Theo', daysLeft: 21, when: 'Sábado, 15h', place: 'Salão Jardim das Flores',
    covers: ['capa-cha-bebe'],
    gifts: [g('Kit de roupinhas RN', 15990, 'vitrine/presente-bebe'), g('Vale-fraldas', 18990, 'presente-caixa'), g('Jogo de lençol de berço', 12990, 'presente-cama')],
  },
  {
    type: 'Casamento', title: 'Casamento de Camila e Diego', daysLeft: 94, when: 'Sexta, 19h30', place: 'Fazenda Recanto do Sol',
    covers: ['capa-casamento-rustico', 'capa-casamento-3'],
    gifts: [g('Jogo de jantar 20 peças', 27990, 'vitrine/presente-jantar'), g('Batedeira planetária', 34990, 'vitrine/presente-batedeira'), g('Kit de vinhos', 19990, 'vitrine/presente-vinhos')],
  },
  {
    type: 'Chá de cozinha', title: 'Chá de cozinha da Larissa', daysLeft: 9, when: 'Sábado, 16h', place: 'Casa da Dona Célia',
    covers: ['capa-cha-cozinha'],
    gifts: [g('Batedeira planetária', 34990, 'vitrine/presente-batedeira'), g('Jogo de panelas antiaderente', 39990, 'presente-panelas'), g('Cafeteira elétrica', 18990, 'presente-cafeteira')],
  },
  {
    type: '15 anos', title: 'Os 15 anos da Valentina', daysLeft: 33, when: 'Sábado, 21h', place: 'Buffet Estrela Dourada',
    covers: ['capa-quinze-anos'],
    gifts: [g('Caixa de som Bluetooth', 29990, 'vitrine/presente-caixa-som'), g('Vale-presente surpresa', 15000, 'presente-caixa'), g('Jogo de cama solteiro', 18990, 'presente-cama')],
  },
  {
    type: 'Casamento', title: 'Casamento de Juliana e Thiago', daysLeft: 41, when: 'Sábado, 11h', place: 'Igreja São Bento',
    covers: ['capa-aliancas', 'capa-casamento-2'],
    gifts: [g('Aspirador robô', 89990, 'presente-aspirador'), g('Jogo de jantar 20 peças', 27990, 'vitrine/presente-jantar'), g('Jogo de taças de cristal', 24990, 'vitrine/presente-tacas')],
  },
  {
    type: 'Bodas', title: 'Bodas de prata de Rosa e Antônio', daysLeft: 27, when: 'Domingo, 12h', place: 'Restaurante Varanda',
    covers: ['capa-bodas'],
    gifts: [g('Kit de vinhos', 19990, 'vitrine/presente-vinhos'), g('Jogo de taças de cristal', 24990, 'vitrine/presente-tacas'), g('Jantar para dois', 30000, 'vitrine/presente-jantar')],
  },
]

/** Linhas de "atividade" que aparecem no convite de exemplo, com ar de notificação. */
export const activity = [
  'Juliana confirmou presença +1',
  'Tia Rosa escolheu o Jogo de taças',
  'Marcos deixou um recado 💛',
  'Carla e Pedro confirmaram presença',
  'Vó Lúcia escolheu a Cafeteira',
  'Fernanda marcou o presente como comprado',
]
