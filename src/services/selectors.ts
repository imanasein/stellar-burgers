import { RootState } from './store';

export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;
export const userDataSelector = (state: RootState) => state.auth.user;
// селекторы для ошибки и загрузки логина:
export const loginErrorSelector = (state: RootState) => state.auth.loginError;
export const loginLoadingSelector = (state: RootState) =>
  state.auth.loginLoading;

// Конструктор
export const constructorItemsSelector = (state: RootState) =>
  state.burgerConstructor;
export const orderRequestSelector = (state: RootState) =>
  state.order.orderRequest;
export const orderModalDataSelector = (state: RootState) =>
  state.order.orderModalData;

// Ингредиенты
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.loading;
export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

// Лента заказов
export const feedOrdersSelector = (state: RootState) => state.feed.orders;
export const feedTotalSelector = (state: RootState) => state.feed.total;
export const feedTotalTodaySelector = (state: RootState) =>
  state.feed.totalToday;
export const feedLoadingSelector = (state: RootState) => state.feed.loading;

// История заказов пользователя
export const userOrdersSelector = (state: RootState) => state.userOrders.orders;
export const userOrdersLoadingSelector = (state: RootState) =>
  state.userOrders.loading;

// Просматриваемый заказ
export const currentOrderSelector = (state: RootState) =>
  state.currentOrder.order;
export const currentOrderLoadingSelector = (state: RootState) =>
  state.currentOrder.loading;
