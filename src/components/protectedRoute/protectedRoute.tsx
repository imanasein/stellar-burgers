import { useSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/selectors';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // если true – маршрут только для неавторизованных
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector); // проверка авторизации завершена
  const user = useSelector(userDataSelector); // данные пользователя, если авторизован, иначе null
  const location = useLocation(); // для сохранения текущего пути при редиректе на логин

  if (!isAuthChecked) {
    return <Preloader />; // Пока идёт проверка токена – показываем прелоадер
  }

  // Если маршрут только для гостей и пользователь авторизован – на главную
  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string })?.from || '/'; // Если есть сохранённый путь, откуда пришёл пользователь, редиректим туда, иначе на главную
    return <Navigate to={from} replace />; // replace – чтобы не сохранять в истории путь /login
  }

  // Если маршрут для авторизованных и пользователь не вошёл – на /login
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />; // Сохраняем текущий путь в state, чтобы после логина вернуться
  }

  return children;
};
