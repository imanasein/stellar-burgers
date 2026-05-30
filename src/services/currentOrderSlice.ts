import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../utils/burger-api';

type CurrentOrderState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: CurrentOrderState = {
  order: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'currentOrder/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number); // Получаем заказ по номеру с сервера
    return response.orders[0]; // API возвращает массив, берём первый
  }
);

const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true; // Проверить нужен ли флаг загрузки для страницы заказа
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrder } = currentOrderSlice.actions;
export default currentOrderSlice.reducer;
