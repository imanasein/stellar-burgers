export type TAppHeaderUIProps = {
  userName: string | undefined;
  onProfileClick?: () => void; // новый пропс клика на кнопку профиля
  onConstructorClick?: () => void; // новый пропс клика на кнопку конструктора
  onFeedClick?: () => void; // новый пропс клика на кнопку ленты
  isConstructorActive?: boolean; // новый пропс для определения активного маршрута конструктора
  isFeedActive?: boolean; // новый пропс для определения активного маршрута ленты
  isProfileActive?: boolean; // новый пропс для определения активного маршрута профиля
};
