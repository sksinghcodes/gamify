import type {
  CategoryWeightTraining,
  CategoryWithoutTarget,
  MonthIndex,
  RecurrenceDaily,
  RecurrenceEnum,
  RecurrenceMonthly,
  RecurrenceWeekly,
  RecurrenceYearly,
  RemoveAfterGivenDate,
  RemoveNever,
  ScheduleNotTimed,
  ScheduleTimed,
} from './task-types';

export interface UserIF {
  _id: string;
  email: string;
  username: string;
  role: number;
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

export interface InitialValues {
  REGULAR: CategoryWithoutTarget;
  CALISTHENICS: CategoryWithoutTarget;
  CARDIO: CategoryWithoutTarget;
  WEIGHT_TRAINING: CategoryWeightTraining;
  DAILY: RecurrenceDaily;
  WEEKLY: RecurrenceWeekly;
  MONTHLY: RecurrenceMonthly;
  YEARLY: RecurrenceYearly;
  NOT_TIMED: ScheduleNotTimed;
  TIMED: ScheduleTimed;
  NEVER: RemoveNever;
  AFTER_GIVEN_DATE: RemoveAfterGivenDate;
}

export interface TaskBase {
  name: string;
  description: string;
}

export enum DurationEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum UnitEnum {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}
export interface WeekValue {
  type: UnitEnum.WEEK;
  year: number;
  week: number;
}

export interface MonthValue {
  type: UnitEnum.MONTH;
  year: number;
  month: MonthIndex;
}

export interface YearValue {
  type: UnitEnum.YEAR;
  year: number;
}

export interface InitialUnitValues {
  WEEK: WeekValue;
  MONTH: MonthValue;
  YEAR: YearValue;
}

export type PriodCarouselValue = WeekValue | MonthValue | YearValue;
