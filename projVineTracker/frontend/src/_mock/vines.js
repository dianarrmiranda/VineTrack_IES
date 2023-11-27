import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const VINE_NAME = [
  'Vinícola Aurora',
  'Quinta do Vale Encantado',
  'Domaine BelleVigne',
  'Bodega El Dorado',
  'Château du Rêve',
];
const VINE_COLOR_GRAPES = [
  '#800020', //Vermelho Borgonha
  '#7B1113', //Vermelho Vinho
  '#922B3E', //Vermelho Rubi
  '#4E2A5A', //Púrpura Profundo
  '#FFD700', //Dourado
  '#90EE90', //Verde Claro
  '#FFE4B5', //Amarelo Marfim
  '#C0C0C0', //Cinza Claro
  '#FFA07A', //Salmão Claro
  '#D18F96', //Rosa claro
  '#F88379', //Rosa suave
];

// ----------------------------------------------------------------------

export const vines = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: index + 1,
    cover: `/assets/images/vines/vine_${setIndex}.jpg`,
    name: VINE_NAME[index],
    size: faker.number.int({ min: 100, max: 100000 }),
    colors:
      (setIndex === 1 && VINE_COLOR_GRAPES.slice(0, 2)) ||
      (setIndex === 2 && VINE_COLOR_GRAPES.slice(8, -1)) ||
      (setIndex === 3 && VINE_COLOR_GRAPES.slice(2, 4)) ||
      (setIndex === 4 && VINE_COLOR_GRAPES.slice(3, 4)) ||
      (setIndex === 5 && VINE_COLOR_GRAPES.slice(4, 6)) ||
      VINE_COLOR_GRAPES,
  };
});
