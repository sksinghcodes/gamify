import type { FormFieldState } from './auth-types';

export enum CategoryEnum {
  REGULAR = 'REGULAR',
  CALISTHENICS = 'CALISTHENICS',
  CARDIO = 'CARDIO',
  WEIGHT_TRAINING = 'WEIGHT_TRAINING',
}

export enum InvalidDateStrategyEnum {
  SHIFT = 'SHIFT',
  SKIP = 'SKIP',
}

export enum RecurrenceEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum ScheduleEnum {
  NOT_TIMED = 'NOT_TIMED',
  TIMED = 'TIMED',
}

export enum AutoRemoveEnum {
  NEVER = 'NEVER',
  AFTER_GIVEN_DATE = 'AFTER_GIVEN_DATE',
}

export interface CategoryWithoutTarget {
  type: CategoryEnum.REGULAR | CategoryEnum.CALISTHENICS | CategoryEnum.CARDIO;
}

export interface CategoryWeightTraining {
  type: CategoryEnum.WEIGHT_TRAINING;
  targetReps: number | null;
  targetSets: number | null;
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
  invalidDateStrategy: InvalidDateStrategyEnum;
}

export interface ScheduleNotTimed {
  type: ScheduleEnum.NOT_TIMED;
}

export interface ScheduleTimed {
  type: ScheduleEnum.TIMED;
  startTime: string;
  endTime: string;
}

export interface RemoveNever {
  type: AutoRemoveEnum.NEVER;
}

export interface RemoveAfterGivenDate {
  type: AutoRemoveEnum.AFTER_GIVEN_DATE;
  dateEpoch: number | null;
}

export type CategoryUnion = CategoryWithoutTarget | CategoryWeightTraining;

export type RecurrenceUnion =
  | RecurrenceDaily
  | RecurrenceWeekly
  | RecurrenceMonthly
  | RecurrenceYearly;

export type ScheduleUnion = ScheduleNotTimed | ScheduleTimed;

export type AutoRemoveUnion = RemoveNever | RemoveAfterGivenDate;

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type MonthAndDates = {
  [month in MonthIndex]?: number[];
};

export type InvalidDateStrategyUnion = InvalidDateStrategyEnum | null;

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
  feb29Strategy: InvalidDateStrategyEnum;
}

export interface TaskState {
  name: string;
  description: string;
  category: CategoryUnion;
  recurrence: RecurrenceUnion;
  schedule: ScheduleUnion;
  autoRemove: AutoRemoveUnion;
}

export type FormField<T> = {
  value: T;
  error: string;
  touched: boolean;
};

export type TaskFormStep1 = {
  name: FormFieldState;
  description: FormFieldState;
  category: FormFieldState<CategoryEnum>;
};

export type TaskFormStep2 = {
  recurrence: FormFieldState<RecurrenceEnum>;
  recurrenceValues: FormFieldState<null | number[]>;
  recurrenceInvalidDateStrategy: FormFieldState<InvalidDateStrategyEnum | null>;
};

export type TaskFormStep3 = {
  schedule: FormField<ScheduleEnum>;
  scheduleStartTime: FormField<null | number>;
  scheduleEndTime: FormField<null | number>;
  autoRemove: FormField<AutoRemoveEnum>;
  autoRemoveDate: FormField<null | number>;
};

export interface TaskReqBody {
  name: string;
  description: string;
  category: CategoryEnum;
  recurrence: RecurrenceEnum;
  recurrenceValues: null | number[];
  recurrenceInvalidDateStrategy: InvalidDateStrategyEnum | null;
  schedule: ScheduleEnum;
  scheduleStartTime: null | number;
  scheduleEndTime: null | number;
  autoRemove: AutoRemoveEnum;
  autoRemoveDate: null | number;
}

export interface Task extends TaskReqBody {
  _id: string;
  createdAt: string;
}

export interface WeightTrainingSet {
  weightInGrams: number;
  reps: number;
}
export type WeightTrainingSetForm = {
  id: FormField<string>;
  weight: FormField<number | null>;
  reps: FormField<number | null>;
};
export interface TaskRecordBase {
  calisthenicsReps: number | null;
  cardioSeconds: number | null;
  weightTrainingSets: null | WeightTrainingSet[];
}

export interface TaskRecordReqBody extends TaskRecordBase {
  score: number;
}
export interface TaskRecord extends TaskRecordBase {
  score: number;
  _id: string;
}
export type TaskRecordFormState = {
  score: FormField<number | null>;
  calisthenicsReps: FormField<number | null>;
  cardioSeconds: FormField<number | null>;
  cardioMinutes: FormField<number | null>;
};
export interface TaskWithRecord extends TaskReqBody {
  _id: string;
  createdAt: string;
  taskRecord: null | TaskRecord;
}

export type TaskFormState = TaskFormStep1 & TaskFormStep2 & TaskFormStep3;
