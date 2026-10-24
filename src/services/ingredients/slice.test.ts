import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  getIngredientsThunk,
  initialState
} from './ingredients-slice';

describe('Тесты синхронных экшенов в ingredients-slice', () => {
  test('Неизвестный экшен не изменяет состояние', () => {
    const state = ingredientsSlice(initialState, { type: 'unknown/action' });
    expect(state).toEqual(initialState);
  });
});

describe('Тесты асинхронных экшенов в ingredients-slice', () => {
  const initialStateForTests = { ...initialState };
  const expectedResult = [
    {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      image: '',
      image_large: '',
      image_mobile: '',
      name: 'Ингредиент-1',
      price: 0,
      proteins: 0,
      type: 'main',
      _id: '1'
    },
    {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      image: '',
      image_large: '',
      image_mobile: '',
      name: 'Ингредиент-2',
      price: 0,
      proteins: 0,
      type: 'main',
      _id: '2'
    }
  ];

  test('Состояние getIngredientsThunk.pending при получении списка ингредиентов', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = ingredientsSlice(initialStateForTests, action);
    expect(state.isLoading).toBe(true);
  });

  test('Состояние getIngredientsThunk.fulfilled при получении списка ингредиентов', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = ingredientsSlice(initialStateForTests, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(expectedResult);
  });

  test('Состояние getIngredientsThunk.rejected при получении списка ингредиентов', () => {
    const action = { type: getIngredientsThunk.rejected.type };
    const state = ingredientsSlice(initialStateForTests, action);
    expect(state.isLoading).toBe(false);
  });
});
