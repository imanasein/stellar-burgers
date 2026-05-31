import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userDataSelector } from '../../services/selectors';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(userDataSelector);
  const userName = user?.name || '';

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
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
