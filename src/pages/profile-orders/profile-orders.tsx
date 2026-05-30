import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/userOrdersSlice';
import {
  userOrdersSelector,
  userOrdersLoadingSelector
} from '../../services/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  // const orders: TOrder[] = [];
  const dispatch = useDispatch(); // Получаем dispatch для отправки экшенов
  const orders = useSelector(userOrdersSelector); // Получаем заказы пользователя из стора
  const loading = useSelector(userOrdersLoadingSelector); // Получаем статус загрузки заказов пользователя из стора

  useEffect(() => {
    dispatch(fetchUserOrders()); // При монтировании компонента отправляем экшен для получения данных о заказах пользователя
  }, [dispatch]);

  if (loading) {
    return <Preloader />; // Если данные загружаются, отображаем прелоадер
  }

  return <ProfileOrdersUI orders={orders} />;
};
