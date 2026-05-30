import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutApi } from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';
import { setUser } from '../../services/authSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi(); // запрос на выход
    } catch (err) {
      // можно обработать ошибку, но всё равно чистим данные
    } finally {
      localStorage.removeItem('refreshToken'); // удаляем refreshToken из localStorage
      deleteCookie('accessToken'); // удаляем accessToken из cookie
      dispatch(setUser(null as any)); // очищаем пользователя в сторе (если setUser принимает null, приведите тип)
      navigate('/login', { replace: true }); // перенаправляем на страницу входа, заменяя текущую запись в истории
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
