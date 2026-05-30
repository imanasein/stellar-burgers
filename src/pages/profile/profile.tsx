import { updateUserApi } from '@api';
import { userDataSelector } from '@selectors';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector); // стабильный объект из стора

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '' // для индикации, что пароль уже есть, но не показываем реальный
      });
    }
  }, [user]); // теперь зависимость – ссылка на user из стора, меняется только при реальном обновлении

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;
    try {
      const updatedUser = await updateUserApi({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || undefined // если пароль не меняли – не отправляем
      });
      // Обновим стор после успешного запроса
      dispatch({ type: 'auth/setUser', payload: updatedUser.user }); // или используйте setUser из authSlice
      setFormValue((prev) => ({ ...prev, password: '' })); // сбрасываем пароль
    } catch (err) {
      console.error('Ошибка обновления профиля', err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
