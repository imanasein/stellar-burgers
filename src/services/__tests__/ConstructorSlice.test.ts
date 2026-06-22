import { describe, expect, test } from '@jest/globals';
import type { TConstructorIngredient } from '@utils-types';

import burgerConstructorReducer, {
  addBun,
  addIngredient,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../constructorSlice';

// Создадим моковые данные для тестов

const bun: TConstructorIngredient = {
  id: '1',
  _id: 'bun-1',
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
};

const ingredient1: TConstructorIngredient = {
  id: '2',
  _id: 'ing-1',
  name: 'Соус с шипами',
  type: 'sauce',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'https://example.com/ing1.png',
  image_mobile: 'https://example.com/ing1-mobile.png',
  image_large: 'https://example.com/ing1-large.png'
};

const ingredient2: TConstructorIngredient = {
  id: '3',
  _id: 'ing-2',
  name: 'Говяжья котлета',
  type: 'main',
  proteins: 25,
  fat: 30,
  carbohydrates: 10,
  calories: 300,
  price: 250,
  image: 'https://example.com/ing2.png',
  image_mobile: 'https://example.com/ing2-mobile.png',
  image_large: 'https://example.com/ing2-large.png'
};

const ingredient3: TConstructorIngredient = {
  id: '4',
  _id: 'ing-3',
  name: 'Сыр',
  type: 'main',
  proteins: 15,
  fat: 15,
  carbohydrates: 5,
  calories: 150,
  price: 80,
  image: 'https://example.com/ing3.png',
  image_mobile: 'https://example.com/ing3-mobile.png',
  image_large: 'https://example.com/ing3-large.png'
};

describe('тестирование редьюсера burgerConstructor', () => {
  test('тестируем начальное состояние для UNKNOWN action', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('тестируем начальное состояние при добавлении булочки', () => {
    expect(burgerConstructorReducer(undefined, addBun(bun))).toEqual({
      bun,
      ingredients: []
    });
  });

  test('тестируем добавление ингредиента', () => {
    expect(
      burgerConstructorReducer(
        { bun: null, ingredients: [] },
        addIngredient(ingredient1)
      )
    ).toEqual({
      bun: null,
      ingredients: [ingredient1]
    });
  });

  test('тестируем удаление ингредиента', () => {
    expect(
      burgerConstructorReducer(
        {
          bun: null,
          ingredients: [ingredient1, ingredient2, ingredient3]
        },
        removeIngredient(1)
      )
    ).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient3]
    });
  });

  test('тестируем перемещение ингредиента вверх', () => {
    expect(
      burgerConstructorReducer(
        {
          bun: null,
          ingredients: [ingredient1, ingredient2, ingredient3]
        },
        moveIngredientUp(1)
      )
    ).toEqual({
      bun: null,
      ingredients: [ingredient2, ingredient1, ingredient3]
    });
  });

  test('тестируем перемещение ингредиента вниз', () => {
    expect(
      burgerConstructorReducer(
        {
          bun: null,
          ingredients: [ingredient1, ingredient2, ingredient3]
        },
        moveIngredientDown(1)
      )
    ).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient3, ingredient2]
    });
  });

  test('тестируем очистку конструктора', () => {
    expect(
      burgerConstructorReducer(
        {
          bun,
          ingredients: [ingredient1, ingredient2]
        },
        clearConstructor()
      )
    ).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
