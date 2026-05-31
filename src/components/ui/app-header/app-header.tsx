import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onProfileClick,
  onConstructorClick,
  onFeedClick,
  isConstructorActive,
  isFeedActive,
  isProfileActive
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <BurgerIcon
            type={isConstructorActive ? 'primary' : 'secondary'}
            onClick={onConstructorClick}
          />
          <p
            className='text text_type_main-default ml-2 mr-10'
            onClick={onConstructorClick}
          >
            Конструктор
          </p>
        </>
        <>
          <ListIcon
            type={isFeedActive ? 'primary' : 'secondary'}
            onClick={onFeedClick}
          />
          <p className='text text_type_main-default ml-2' onClick={onFeedClick}>
            Лента заказов
          </p>
        </>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last} onClick={onProfileClick}>
        <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </div>
    </nav>
  </header>
);
