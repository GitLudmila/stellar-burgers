import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  TNewOrder
} from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from '../../services/store';

const initialState: {
  isFeedLoading: boolean;
  isHistoryLoading: boolean;
  isOrderNumberLoading: boolean;
  orderData: TOrder | null;
  orderByNumber: TOrder | null;
  history: TOrdersData;
  feed: TOrdersData;
} = {
  isFeedLoading: false,
  isHistoryLoading: false,
  isOrderNumberLoading: false,
  orderData: null,
  orderByNumber: null,
  history: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
);

export const getFeedsThunk = createAsyncThunk('orders/getFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getOrdersThunk = createAsyncThunk('orders/getOrdersUser', () =>
  getOrdersApi()
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    makeOrder: (state, { payload }: PayloadAction<TOrder>) => {
      state.history.orders.push(payload);
    },
    resetOrderData: (state) => {
      state.orderData = null;
    },
    resetOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderByNumberThunk.pending, (state) => {
      state.isOrderNumberLoading = true;
    });
    builder.addCase(getOrderByNumberThunk.fulfilled, (state, { payload }) => {
      state.isOrderNumberLoading = false;
      state.orderByNumber = payload.orders[0];
    });
    builder.addCase(getOrderByNumberThunk.rejected, (state) => {
      state.isOrderNumberLoading = false;
    });
    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isFeedLoading = true;
    });
    builder.addCase(getFeedsThunk.fulfilled, (state, { payload }) => {
      state.isFeedLoading = false;
      state.feed = payload;
    });
    builder.addCase(getFeedsThunk.rejected, (state) => {
      state.isFeedLoading = false;
    });
    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isHistoryLoading = true;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
      state.isHistoryLoading = false;
      state.history.orders = payload;
    });
    builder.addCase(getOrdersThunk.rejected, (state) => {
      state.isHistoryLoading = false;
    });
  }
});

export const { makeOrder, resetOrderData, resetOrderByNumber } =
  ordersSlice.actions;

export const selectFeedOrders = (state: RootState) => state.orders.feed.orders;
export const selectHistoryOrders = (state: RootState) =>
  state.orders.history.orders;
export const selectOrderByNumber = (state: RootState) =>
  state.orders.orderByNumber;
export const selectFeed = (state: RootState) => state.orders.feed;
export const selectIsFeedLoading = (state: RootState) =>
  state.orders.isFeedLoading;
export const selectIsHistoryLoading = (state: RootState) =>
  state.orders.isHistoryLoading;
export const selectIsOrderNumberLoading = (state: RootState) =>
  state.orders.isOrderNumberLoading;

export default ordersSlice.reducer;
