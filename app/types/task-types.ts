export enum RecurrenceEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum RemoveTypeEnum {
  NEVER = 'NEVER',
  AFTER_GIVEN_DATE = 'AFTER_GIVEN_DATE',
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

export enum InvalidDateStrategy {
  NONE = 'NONE',
  LAST_VALID = 'LAST_VALID',
  SKIP = 'SKIP',
}

export interface RemoveNever {
  type: RemoveTypeEnum.NEVER;
}

export interface RemoveAfterGivenDate {
  type: RemoveTypeEnum.AFTER_GIVEN_DATE;
  dateEpoch: number | null;
}

export interface RecurrenceDaily {
  type: RecurrenceEnum.DAILY;
}

export interface RecurrenceWeekly {
  type: RecurrenceEnum.WEEKLY;
  weekDays: number[]; // 0 to 6, 0 = Sunday, 6 = Saturday
}

export interface RecurrenceMonthly {
  type: RecurrenceEnum.MONTHLY;
  /** Dates selected: 1 to 31 */
  dates: number[];
  /**
   * Strategy for handling 29, 30, or 31 when a month doesn’t include them
   */
  invalidDateStrategy: InvalidDateStrategy;
}

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type MonthAndDates = {
  [month in MonthIndex]?: number[];
};

export interface RecurrenceYearly {
  type: RecurrenceEnum.YEARLY;
  /**
   * Object where key is month (0 = Jan) and value is array of selected dates
   */
  monthAndDates: MonthAndDates;
  /**
   * Strategy for handling Feb 29 in non-leap years
   * Only relevant if Feb (1) contains 29
   */
  feb29Strategy: InvalidDateStrategy;
}

export interface TaskBase {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface TaskRecord extends TaskBase {
  id: string;
  taskId: string;
  createdAt: number;
  recurrenceType: RecurrenceEnum;
  score: null | number; // null when isScorable is false, null or number when its true
  isScorable: boolean;
}

export interface TaskReqBody extends TaskBase {
  recurrence:
    | RecurrenceDaily
    | RecurrenceWeekly
    | RecurrenceMonthly
    | RecurrenceYearly;
  removeIt: RemoveNever | RemoveAfterGivenDate;
}

export interface TaskFormState {
  name: {
    value: string;
    error: string;
    touched: boolean;
  };
  description: {
    value: string;
    error: string;
    touched: boolean;
  };
  startTime: {
    value: string;
    error: string;
    touched: boolean;
  };
  endTime: {
    value: string;
    error: string;
    touched: boolean;
  };
  recurrence: {
    value:
      | RecurrenceDaily
      | RecurrenceWeekly
      | RecurrenceMonthly
      | RecurrenceYearly;
    error: string;
    touched: boolean;
  };
  removeIt: {
    value: RemoveNever | RemoveAfterGivenDate;
    error: string;
    touched: boolean;
  };
}

export interface Task extends TaskReqBody {
  id: string;
  createdAt: number;
}

export interface InitialRecurrenceIF {
  DAILY: RecurrenceDaily;
  WEEKLY: RecurrenceWeekly;
  MONTHLY: RecurrenceMonthly;
  YEARLY: RecurrenceYearly;
  NEVER: RemoveNever;
  AFTER_GIVEN_DATE: RemoveAfterGivenDate;
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

export type PriodCarouselValue = WeekValue | MonthValue | YearValue;

export interface InitialUnitValues {
  WEEK: WeekValue;
  MONTH: MonthValue;
  YEAR: YearValue;
}
