export enum RecurrenceEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum RemoveTypeEnum {
  NEVER = 'NEVER',
  AFTER_N_UNIT = 'AFTER_N_UNIT',
  ON_DATE = 'ON_DATE',
}

export enum DurationEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface RemoveNever {
  type: RemoveTypeEnum.NEVER;
}

export interface RemoveAfterNUnit {
  type: RemoveTypeEnum.AFTER_N_UNIT;
  unit: DurationEnum;
  nValue: number;
}

export interface RemoveOnDate {
  type: RemoveTypeEnum.ON_DATE;
  dateEpoch: number;
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
  /** Day of the month (1-31) */
  dates: number[];
  // TODO: Handle 29, 30 and 31 dates
}

export interface RecurrenceYearly {
  type: RecurrenceEnum.YEARLY;
  monthAndDates: {
    /** Month index (0 = Jan, 11 = Dec) */
    month: number;
    /** Day of the month (1-31) */
    date: number;
  }[];
  // TODO: Handle 29, 30 and 31 dates
}

export interface TaskReqBodyIF {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  howOften:
    | RecurrenceDaily
    | RecurrenceWeekly
    | RecurrenceMonthly
    | RecurrenceYearly;
  removeIt: RemoveNever | RemoveAfterNUnit | RemoveOnDate;
}

export interface TaskIF extends TaskReqBodyIF {
  id: string;
  score: null | number;
  isScorable: boolean;
}
