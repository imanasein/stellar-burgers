import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userDataSelector } from '../../services/selectors';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const navigate = useNavigate(); // Получаем функцию навигации из react-router-dom
  const location = useLocation(); // Получаем информацию о текущем местоположении
  const user = useSelector(userDataSelector); // Получаем данные пользователя из стора
  const userName = user?.name || '';

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile'); // Если пользователь авторизован, перенаправляем на страницу профиля
    } else {
      // перенаправляем на логин, указывая, что пользователь хотел попасть в профиль
      navigate('/login', { state: { from: '/profile' } });
    }
  };

  const handleConstructorClick = () => {
    navigate('/'); // Перенаправляем на главную страницу с конструктором бургеров
  };

  const handleFeedClick = () => {
    navigate('/feed'); // Перенаправляем на страницу ленты заказов
  };

  // Определяем активный маршрут
  const isConstructorActive =
    location.pathname === '/' || location.pathname.startsWith('/ingredients'); // Главная страница и страницы ингредиентов считаются активными для конструктора
  const isFeedActive = location.pathname.startsWith('/feed'); // Страницы, начинающиеся с /feed, считаются активными для ленты заказов
  const isProfileActive = location.pathname.startsWith('/profile'); // Страницы, начинающиеся с /profile, считаются активными для профиля

  return (
    <AppHeaderUI
      userName={userName}
      onProfileClick={handleProfileClick}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      isConstructorActive={isConstructorActive}
      isFeedActive={isFeedActive}
      isProfileActive={isProfileActive}
    />
  );
};
