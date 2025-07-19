export interface UserIF {
  _id: string;
  email: string;
  username: string;
  role: number;
}

export interface ContextInterface {
  isSignedIn: boolean | null;
  checkSignedInStatus: () => void;
  deviceHeight: string;
  user: UserIF;
  loading: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  isSigningOut: boolean;
  signOut: () => void;
}

export enum RoutesEnum {
  TASK_LIST = '/',
  TASK_PREVIEW = '/task-preview',
  CREATE_TASK = '/create-task',
  EDIT_TASK = '/edit-task',
  PROGRESS_OVERVIEW = '/progress-overview',
  TASK_PROGRESS = '/task-progress',
  PROFILE = '/profile',
  SETTINGS = '/settings',
  SIGN_IN = '/auth/sign-in',
  SIGN_UP = '/auth/sign-up',
  RESET_PASSWORD = '/auth/reset-password',
  VERIFY_PROFILE = '/auth/verify-profile',
}

export type RoutesIF = Record<
  keyof typeof RoutesEnum,
  {
    headerType: HeaderType;
    showBottomNav: boolean;
    path: RoutesEnum;
    title: string;
  }
>;

export enum HeaderType {
  TASK_LIST = 'TASK_LIST',
  TASK_PREVIEW = 'TASK_PREVIEW',
  TASK_PROGRESS = 'TASK_PROGRESS',
  PROGRESS_PAGE = 'PROGRESS_PAGE',
  DEFAULT = 'DEFAULT',
  HIDDEN = 'HIDDEN',
}
