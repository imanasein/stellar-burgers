import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector
} from '../../services/selectors';

const getOrders = (
  orders: TOrder[],
  status: string
): number[] => // Получаем номера заказов по статусу
  orders
    .filter((item) => item.status === status) // Фильтруем заказы по статусу
    .map((item) => item.number) // Получаем номера заказов
    .slice(0, 20); // Ограничиваем количество отображаемых заказов до 20

export const FeedInfo: FC = () => {
  const orders = useSelector(feedOrdersSelector);
  const total = useSelector(feedTotalSelector);
  const totalToday = useSelector(feedTotalTodaySelector);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }} // Передаем данные о заказах и статистику в UI компонент для отображения
    />
  );
};
