import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './user/user-slice';
import { constructorSlice } from './constructor/constructor-slice';
import { ordersSlice } from './orders/orders-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  constructor: constructorSlice.reducer,
  orders: ordersSlice.reducer,
  ingredients: ingredientsSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = (): AppDispatch => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
