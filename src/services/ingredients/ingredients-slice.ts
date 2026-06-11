import { getIngredientsApi } from '../../utils/burger-api';
import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const initialState: {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
} = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка загрузки ингредиентов'
      );
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = payload;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });
  }
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

// Мемоизированные селекторы с помощью createSelector
export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'sauce')
);

export default ingredientsSlice.reducer;
