import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  constructorItemsSelector,
  orderRequestSelector,
  orderModalDataSelector,
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/selectors';
import { createOrder, closeOrderModal } from '../../services/orderSlice';
import { clearConstructor } from '../../services/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { fetchFeeds } from '../../services/feedSlice';
import { fetchUserOrders } from '../../services/userOrdersSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const user = useSelector(userDataSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  // const constructorItems = {
  //   bun: {
  //     price: 0
  //   },
  //   ingredients: []
  // };

  // const orderRequest = false;

  // const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthChecked) return; // ещё проверяем токен

    if (!user) {
      // Не авторизован – отправляем на логин, запомнив, откуда пришли
      navigate('/login', { state: { from: '/' } });
      return;
    }
    // Авторизован – создаём заказ
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)) // создаём заказ
      .unwrap() // unwrap для получения результата промиса
      .then(() => {
        // после успешного создания заказа
        dispatch(fetchFeeds()); // обновление ленты заказов
        dispatch(fetchUserOrders()); // обновляем историю заказов текущего пользователя
      });
  };

  const closeModal = () => {
    dispatch(closeOrderModal());
    // если нужно, очистить конструктор после закрытия модалки
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData as TOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
