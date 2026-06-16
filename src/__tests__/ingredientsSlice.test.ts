import { describe, expect, test } from '@jest/globals';
import type { TIngredient } from '@utils-types';

import ingredientsReducer, {
  fetchIngredients
} from '../services/ingredientsSlice';

// создадим моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: 'ing-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png'
  },
  {
    _id: 'ing-2',
    name: 'Соус с шипами',
    type: 'sauce',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png'
  }
];

describe('тестирование редьюсера ingredients', () => {
  test('тестирование начального состояния для UNKNOWN action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });

  test('тестирование состояния при pending', () => {
    expect(
      ingredientsReducer(undefined, {
        type: fetchIngredients.pending.type
      })
    ).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  test('тестирование состояния при fulfilled', () => {
    expect(
      ingredientsReducer(undefined, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      })
    ).toEqual({
      items: mockIngredients,
      loading: false,
      error: null
    });
  });

  test('тестирование состояния при rejected', () => {
    expect(
      ingredientsReducer(undefined, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка загрузки ингредиентов' }
      })
    ).toEqual({
      items: [],
      loading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
