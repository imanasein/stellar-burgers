import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/authSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';

import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protectedRoute';

const App = () => {
  const dispatch = useDispatch(); // Получаем функцию dispatch из нашего кастомного хука

  useEffect(() => {
    dispatch(checkUserAuth()); // Проверяем авторизацию при загрузке приложения
    dispatch(fetchIngredients()); // загружаем ингредиенты при старте
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        {/* Гостевые маршруты (только для неавторизованных) */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        {/* Защищённые маршруты (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        {/* Модальные маршруты без проверки авторизации */}
        <Route
          path='/feed/:number'
          element={
            <Modal
              title='Информация о заказе' // Проверить что присать в заголовок
              onClose={() => window.history.back()} // Переделать
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Детали ингредиента' // Проверить что присать в заголовок
              onClose={() => window.history.back()} // Переделать
            >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal
                title='Информация о заказе' // Проверить что присать в заголовок
                onClose={() => window.history.back()} // Переделать
              >
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
