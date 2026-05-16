import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrder } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

export type TCurrentOrder = {
  bun: null | TIngredient;
  ingredients: TConstructorIngredient[];
};

const initialState: {
  current: TCurrentOrder;
  isOrderLoading: boolean;
  orderData: TOrder | null;
} = {
  current: {
    bun: null,
    ingredients: []
  },
  isOrderLoading: false,
  orderData: null
};

export const orderBurgerThunk = createAsyncThunk(
  'constructor/orderBurger',
  async (data: string[]) => {
    const result = await orderBurgerApi(data);
    return result;
  }
);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredientToOrder: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.current.bun = action.payload;
        } else {
          state.current.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient) => ({
        payload:
          ingredient.type === 'bun'
            ? ingredient
            : { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, { payload }) => {
      state.current.ingredients = state.current.ingredients.filter(
        (item) => item.id !== payload.id
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      [
        state.current.ingredients[toIndex],
        state.current.ingredients[fromIndex]
      ] = [
        state.current.ingredients[fromIndex],
        state.current.ingredients[toIndex]
      ];
    },
    resetCurrentOrder: (state) => {
      state.current.bun = null;
      state.current.ingredients = [];
    },
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.isOrderLoading = true;
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, { payload }) => {
      state.isOrderLoading = false;
      state.orderData = {
        ...payload.order,
        ingredients: state.current.ingredients.map((item) => item._id)
      };
      state.current.bun = null;
      state.current.ingredients = [];
    });
    builder.addCase(orderBurgerThunk.rejected, (state) => {
      state.isOrderLoading = false;
    });
  }
});

export const {
  addIngredientToOrder,
  removeIngredient,
  moveIngredient,
  resetCurrentOrder,
  clearOrderData
} = constructorSlice.actions;

export const selectCurrentOrder = (state: RootState) =>
  state.constructor.current;
export const selectCurrentOrderIngredients = (state: RootState) =>
  state.constructor.current.ingredients;
export const selectIsOrderLoading = (state: RootState) =>
  state.constructor.isOrderLoading;
export const selectOrderData = (state: RootState) =>
  state.constructor.orderData;

export default constructorSlice.reducer;
