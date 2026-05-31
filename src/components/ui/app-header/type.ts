export type TAppHeaderUIProps = {
  userName: string | undefined;
  onProfileClick?: () => void;
  onConstructorClick?: () => void;
  onFeedClick?: () => void;
  isConstructorActive?: boolean;
  isFeedActive?: boolean;
  isProfileActive?: boolean;
};
