import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/feedSlice';
import {
  feedOrdersSelector,
  feedLoadingSelector
} from '../../services/selectors';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch(); // получаем dispatch для отправки экшенов
  const orders = useSelector(feedOrdersSelector); // получаем заказы из стора
  const loading = useSelector(feedLoadingSelector); // получаем статус загрузки из стора

  useEffect(() => {
    dispatch(fetchFeeds()); // при монтировании компонента отправляем экшен для получения данных о заказах
  }, [dispatch]);

  if (loading || !orders.length) {
    return <Preloader />; // если данные загружаются или нет заказов, отображаем прелоадер
  }

  <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />; // отображаем UI компонент, передавая заказы и функцию для получения данных о заказах при необходимости
};
