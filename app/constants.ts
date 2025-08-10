import type { FormFieldState } from './types/auth-types';
import type { InitialValues, RoutesIF } from './types/common-types';
import {
  DurationEnum,
  HeaderType,
  RoutesEnum,
  UnitEnum,
} from './types/common-types';
import {
  InvalidDateStrategyEnum,
  RecurrenceEnum,
  AutoRemoveEnum,
  type TaskFormState,
  ScheduleEnum,
  CategoryEnum,
  type TaskFormStep1,
  type TaskFormStep2,
  type TaskFormStep3,
  type TaskRecordFormState,
  type WeightTrainingSetForm,
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
  TASK_PROGRESS: {
    headerType: HeaderType.DEFAULT,
    showBottomNav: false,
    path: RoutesEnum.TASK_PROGRESS,
    title: 'Task Progress',
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
  CREATE_TASK: '/task/create',
  GET_ONE_TASK: '/task/get-one',
  GET_ALL_TASKS: '/task/get-all',
  GET_TASKS_BY_DATE: '/task/get-by-date',
  CREATE_TASK_RECORD: '/task-record/create',
};

export const DURATION_UNIT = {
  DAY: DurationEnum.DAY as DurationEnum.DAY,
  WEEK: DurationEnum.WEEK as DurationEnum.WEEK,
  MONTH: DurationEnum.MONTH as DurationEnum.MONTH,
  YEAR: DurationEnum.YEAR as DurationEnum.YEAR,
};

export const VIEW_BY_UNITS_MAP = {
  WEEK: UnitEnum.WEEK as UnitEnum.WEEK,
  MONTH: UnitEnum.MONTH as UnitEnum.MONTH,
  YEAR: UnitEnum.YEAR as UnitEnum.YEAR,
};

export const VIEW_BY_UNITS = [
  VIEW_BY_UNITS_MAP.WEEK,
  VIEW_BY_UNITS_MAP.MONTH,
  VIEW_BY_UNITS_MAP.YEAR,
];

export const CATEGORY = {
  REGULAR: CategoryEnum.REGULAR as CategoryEnum.REGULAR,
  CARDIO: CategoryEnum.CARDIO as CategoryEnum.CARDIO,
  CALISTHENICS: CategoryEnum.CALISTHENICS as CategoryEnum.CALISTHENICS,
  WEIGHT_TRAINING: CategoryEnum.WEIGHT_TRAINING as CategoryEnum.WEIGHT_TRAINING,
};

export const AUTO_REMOVE = {
  NEVER: AutoRemoveEnum.NEVER as AutoRemoveEnum.NEVER,
  AFTER_GIVEN_DATE:
    AutoRemoveEnum.AFTER_GIVEN_DATE as AutoRemoveEnum.AFTER_GIVEN_DATE,
};

export const RECURRENCE = {
  DAILY: RecurrenceEnum.DAILY as RecurrenceEnum.DAILY,
  WEEKLY: RecurrenceEnum.WEEKLY as RecurrenceEnum.WEEKLY,
  MONTHLY: RecurrenceEnum.MONTHLY as RecurrenceEnum.MONTHLY,
  YEARLY: RecurrenceEnum.YEARLY as RecurrenceEnum.YEARLY,
};

export const SCHEDULE = {
  NOT_TIMED: ScheduleEnum.NOT_TIMED as ScheduleEnum.NOT_TIMED,
  TIMED: ScheduleEnum.TIMED as ScheduleEnum.TIMED,
};

export const INVALID_DATE_STRATEGY = {
  SHIFT: InvalidDateStrategyEnum.SHIFT as InvalidDateStrategyEnum.SHIFT,
  SKIP: InvalidDateStrategyEnum.SKIP as InvalidDateStrategyEnum.SKIP,
};

export const INVALID_DATE_STRATEGY_LABELS = {
  [InvalidDateStrategyEnum.SHIFT]: 'Move to last date',
  [InvalidDateStrategyEnum.SKIP]: 'Skip month',
};

export const AUTO_REMOVE_LABELS = {
  [AutoRemoveEnum.NEVER]: "Don't remove it automatically",
  [AutoRemoveEnum.AFTER_GIVEN_DATE]: 'Remove it after a date',
};

export const getFormValues: <T>(
  value: T,
  async?: boolean
) => FormFieldState<T> = (value, async) => {
  return {
    value: value,
    error: '',
    touched: false,
    ...(async ? { validatingAsync: false } : {}),
  };
};

export const INITIAL_TASK_STEP_1: TaskFormStep1 = {
  name: getFormValues(''),
  description: getFormValues(''),
  category: getFormValues(CATEGORY.REGULAR),
};

export const INITIAL_TASK_STEP_2: TaskFormStep2 = {
  recurrence: getFormValues(RECURRENCE.DAILY),
  recurrenceValues: getFormValues(null),
  recurrenceInvalidDateStrategy: getFormValues(null),
};

export const INITIAL_TASK_STEP_3: TaskFormStep3 = {
  schedule: getFormValues(SCHEDULE.NOT_TIMED),
  scheduleStartTime: getFormValues(null),
  scheduleEndTime: getFormValues(null),
  autoRemove: getFormValues(AUTO_REMOVE.NEVER),
  autoRemoveDate: getFormValues(null),
};

export const INITIAL_TASK_RECORD_FORM: TaskRecordFormState = {
  score: getFormValues(null),
  calisthenicsReps: getFormValues(null),
  cardioMinutes: getFormValues(null),
  cardioSeconds: getFormValues(null),
};

export const INITIAL_WEIGHT_TRAINIG_SETS: WeightTrainingSetForm = {
  id: getFormValues(''),
  weight: getFormValues(null),
  reps: getFormValues(null),
};
