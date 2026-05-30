import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';
import feedReducer from './feedSlice';
import userOrdersReducer from './userOrdersSlice';
import currentOrderReducer from './currentOrderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объект редьюсеров – сюда легко добавлять новые слайсы
const rootReducer = {
  auth: authReducer, // Редьюсер для управления состоянием аутентификации
  ingredients: ingredientsReducer, // Редьюсер для управления состоянием ингредиентов
  burgerConstructor: constructorReducer, // Редьюсер для управления состоянием конструктора бургера
  order: orderReducer, // Редьюсер для управления состоянием заказа
  feed: feedReducer, // Редьюсер для управления состоянием ленты заказов
  userOrders: userOrdersReducer, // Редьюсер для управления состоянием истории заказов пользователя
  currentOrder: currentOrderReducer // Редьюсер для управления состоянием текущего открытого заказа (на странице заказа)
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>; // было ранее <typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
