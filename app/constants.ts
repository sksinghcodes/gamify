import type { RoutesIF } from './types/common-types';
import { HeaderType, RoutesEnum } from './types/common-types';
import {
  DurationEnum,
  InvalidDateStrategy,
  RecurrenceEnum,
  RemoveTypeEnum,
  type InitialRecurrenceIF,
  type TaskReqBodyIF,
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

export const MONTHS_3_LETTER = MONTHS.map((month) => month.slice(0, 3));

export const WEEKS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const WEEKS_3_LETTER = WEEKS.map((week) => week.slice(0, 3));

export const WEEKS_1_LETTER = WEEKS.map((week) => week.slice(0, 1));

export const DATES = Array.from({ length: 31 }, (_, i) => i + 1);

export const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

export const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(((i + 1) * 5) % 60).padStart(2, '0')
);

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
  DAY: DurationEnum.DAY as DurationEnum.DAY,
  WEEK: DurationEnum.WEEK as DurationEnum.WEEK,
  MONTH: DurationEnum.MONTH as DurationEnum.MONTH,
  YEAR: DurationEnum.YEAR as DurationEnum.YEAR,
};

export const REMOVE_TYPE = {
  NEVER: RemoveTypeEnum.NEVER as RemoveTypeEnum.NEVER,
  AFTER_N_UNIT: RemoveTypeEnum.AFTER_N_UNIT as RemoveTypeEnum.AFTER_N_UNIT,
  ON_DATE: RemoveTypeEnum.ON_DATE as RemoveTypeEnum.ON_DATE,
};

export const RECURRENCE = {
  DAILY: RecurrenceEnum.DAILY as RecurrenceEnum.DAILY,
  WEEKLY: RecurrenceEnum.WEEKLY as RecurrenceEnum.WEEKLY,
  MONTHLY: RecurrenceEnum.MONTHLY as RecurrenceEnum.MONTHLY,
  YEARLY: RecurrenceEnum.YEARLY as RecurrenceEnum.YEARLY,
};

export const INVALID_DATE_STRATEGY = {
  LAST_VALID: 'LAST_VALID' as InvalidDateStrategy.LAST_VALID,
  SKIP: 'SKIP' as InvalidDateStrategy.SKIP,
  NONE: '' as InvalidDateStrategy.NONE,
};

export const INVALID_DATE_STRATEGY_LABELS = {
  [InvalidDateStrategy.LAST_VALID]: 'Skip month',
  [InvalidDateStrategy.SKIP]: 'Move to last date',
  [InvalidDateStrategy.NONE]: '',
};

export const INITIAL_TASK: TaskReqBodyIF = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  reccurrence: {
    type: RECURRENCE.DAILY,
  },
  removeIt: {
    type: REMOVE_TYPE.NEVER,
  },
};

export const INITIAL_RECURRENCE_AND_REMOVE: InitialRecurrenceIF = {
  DAILY: {
    type: RECURRENCE.DAILY,
  },
  WEEKLY: {
    type: RECURRENCE.WEEKLY,
    weekDays: [],
  },
  MONTHLY: {
    type: RECURRENCE.MONTHLY,
    dates: [],
    invalidDateStrategy: INVALID_DATE_STRATEGY.NONE,
  },
  YEARLY: {
    type: RECURRENCE.YEARLY,
    monthAndDates: {},
    feb29Strategy: INVALID_DATE_STRATEGY.NONE,
  },
  NEVER: {
    type: REMOVE_TYPE.NEVER,
  },
  AFTER_N_UNIT: {
    type: REMOVE_TYPE.AFTER_N_UNIT,
    unit: DURATION_UNIT.DAY,
    nValue: 5,
  },
  ON_DATE: {
    type: REMOVE_TYPE.ON_DATE,
    dateEpoch: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })(),
  },
};
