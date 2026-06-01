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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const user = useSelector(userDataSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthChecked) return; // ещё проверяем токен

    if (!user) {
      navigate('/login');
      return;
    }
    // Авторизован – создаём заказ
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)) // создаём заказ
      .unwrap()
      .then(() => {
        dispatch(clearConstructor()); // очищаем конструктор после успешного заказа
        dispatch(fetchUserOrders()); // обновляем историю заказов текущего пользователя
        dispatch(fetchFeeds()); // обновляем ленту заказов
      });
  };

  const closeModal = () => {
    dispatch(closeOrderModal());
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
