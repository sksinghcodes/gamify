import type { RoutesIF } from './types/common-types';
import { HeaderType, RoutesEnum } from './types/common-types';
import {
  DurationEnum,
  RecurrenceEnum,
  RemoveTypeEnum,
} from './types/task-types';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const ROUTES: RoutesIF = {
  TASK_LIST: {
    headerType: HeaderType.TASK_LIST,
    showBottomNav: true,
    path: RoutesEnum.TASK_LIST,
    title: 'GAMIFY',
  },
  TASK_PREVIEW: {
    headerType: HeaderType.TASK_PREVIEW,
    showBottomNav: false,
    path: RoutesEnum.TASK_PREVIEW,
    title: 'Task Preview',
  },
  CREATE_TASK: {
    headerType: HeaderType.DEFAULT,
    showBottomNav: false,
    path: RoutesEnum.CREATE_TASK,
    title: 'Create Task',
  },
  EDIT_TASK: {
    headerType: HeaderType.DEFAULT,
    showBottomNav: false,
    path: RoutesEnum.EDIT_TASK,
    title: 'Edit Task',
  },
  PROGRESS_OVERVIEW: {
    headerType: HeaderType.PROGRESS_PAGE,
    showBottomNav: true,
    path: RoutesEnum.PROGRESS_OVERVIEW,
    title: 'Progress Overview',
  },
  SETTINGS: {
    headerType: HeaderType.DEFAULT,
    showBottomNav: true,
    path: RoutesEnum.SETTINGS,
    title: 'Settings',
  },
  PROFILE: {
    headerType: HeaderType.DEFAULT,
    showBottomNav: true,
    path: RoutesEnum.PROFILE,
    title: 'Profile',
  },
  SIGN_IN: {
    headerType: HeaderType.HIDDEN,
    showBottomNav: false,
    path: RoutesEnum.SIGN_IN,
    title: 'Sign In',
  },
  SIGN_UP: {
    headerType: HeaderType.HIDDEN,
    showBottomNav: false,
    path: RoutesEnum.SIGN_UP,
    title: 'Sign Up',
  },
  RESET_PASSWORD: {
    headerType: HeaderType.HIDDEN,
    showBottomNav: false,
    path: RoutesEnum.RESET_PASSWORD,
    title: 'Reset Password',
  },
  VERIFY_PROFILE: {
    headerType: HeaderType.HIDDEN,
    showBottomNav: false,
    path: RoutesEnum.VERIFY_PROFILE,
    title: 'Verify Profile',
  },
};

// reverse map
export const ROUTES_BY_PATH = Object.values(ROUTES).reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {} as Record<string, (typeof ROUTES)[keyof typeof ROUTES]>);

export const BOTTOM_NAV_TABS = [
  { icon: 'check', title: 'Task List', path: RoutesEnum.TASK_LIST },
  { icon: 'stairs_2', title: 'Progress', path: RoutesEnum.PROGRESS_OVERVIEW },
  { icon: 'person', title: 'Profile', path: RoutesEnum.PROFILE },
  { icon: 'settings', title: 'Settings', path: RoutesEnum.SETTINGS },
];

export const API_ENDPOINTS = {
  CHECK_SIGNED_IN_STATUS: '/user/check-signed-in-status',
  RESET_PASSWORD: '/user/reset-password',
  SIGN_IN: '/user/sign-in',
  SIGN_UP: '/user/sign-up',
  SIGN_OUT: '/user/sign-out',
  CHECK_UNIQUE: '/user/check-unique',
  VERIFY_PROFILE: '/user/verify-profile',
};

export const DURATION_UNIT = {
  [DurationEnum.DAY]: DurationEnum.DAY as DurationEnum.DAY,
  [DurationEnum.WEEK]: DurationEnum.WEEK as DurationEnum.WEEK,
  [DurationEnum.MONTH]: DurationEnum.MONTH as DurationEnum.MONTH,
  [DurationEnum.YEAR]: DurationEnum.YEAR as DurationEnum.YEAR,
};

export const REMOVE_TYPE = {
  [RemoveTypeEnum.NEVER]: RemoveTypeEnum.NEVER as RemoveTypeEnum.NEVER,
  [RemoveTypeEnum.AFTER_N_UNIT]:
    RemoveTypeEnum.AFTER_N_UNIT as RemoveTypeEnum.AFTER_N_UNIT,
  [RemoveTypeEnum.ON_DATE]: RemoveTypeEnum.ON_DATE as RemoveTypeEnum.ON_DATE,
};

export const RECURRENCE = {
  [RecurrenceEnum.DAILY]: RecurrenceEnum.DAILY as RecurrenceEnum.DAILY,
  [RecurrenceEnum.WEEKLY]: RecurrenceEnum.WEEKLY as RecurrenceEnum.WEEKLY,
  [RecurrenceEnum.MONTHLY]: RecurrenceEnum.MONTHLY as RecurrenceEnum.MONTHLY,
  [RecurrenceEnum.YEARLY]: RecurrenceEnum.YEARLY as RecurrenceEnum.YEARLY,
};
