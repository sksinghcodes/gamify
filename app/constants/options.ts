import {
  CATEGORY,
  DATES,
  HOURS,
  INVALID_DATE_STRATEGY,
  MINUTES,
  MONTHS,
  RECURRENCE,
  SCHEDULE,
  WEEKS,
} from '~/constants';
import { capitalize } from '~/utils/string';

export const CATEGORY_OPTIONS = [
  { id: CATEGORY.REGULAR, label: '📝 Regular' },
  { id: CATEGORY.CARDIO, label: '🏃 Cardio' },
  { id: CATEGORY.CALISTHENICS, label: '💪 Calisthenics' },
  { id: CATEGORY.WEIGHT_TRAINING, label: '🏋️ Weight Training' },
];

export const CATEGORY_INFO = {
  [CATEGORY.REGULAR]:
    'Regular: Allows you to rate your performance out of 100.',
  [CATEGORY.CARDIO]: 'Cardio: Log minutes spent and score out of 100.',
  [CATEGORY.CALISTHENICS]: 'Calisthenics: Log total reps and score out of 100.',
  [CATEGORY.WEIGHT_TRAINING]:
    'Weight Lifting: Log sets with reps & weight, plus a score out of 100.',
};

export const CATEGORY_DESCRIPTION = {
  [CATEGORY.REGULAR]:
    'In a regular task, you can log a self-assigned score out of 100 to reflect how well you did.',
  [CATEGORY.CARDIO]:
    'In a cardio task, you can Record how long you did cardio and rate your performance out of 100.',
  [CATEGORY.CALISTHENICS]:
    'In a calisthenics task, you can Log your rep count for calisthenics and assign yourself a score out of 100.',
  [CATEGORY.WEIGHT_TRAINING]:
    'In a weight training task, you can Track sets, reps, weights lifted, and give your workout a score out of 100.',
};

export const SCHEDULE_OPTIONS = [
  {
    id: SCHEDULE.NOT_TIMED,
    label: 'Anytime during the day',
  },
  {
    id: SCHEDULE.TIMED,
    label: 'At a specific time',
  },
];

export const HOURS_OPTIONS = HOURS.map((h) => ({ id: h, label: String(h) }));

export const MINUTES_OPTIONS = MINUTES.map((m) => ({
  id: m,
  label: String(m),
}));

export const PERIOD_OPTIONS = [
  { id: 'AM', label: 'AM' },
  { id: 'PM', label: 'PM' },
];

export const WEEK_OPTIONS = WEEKS.map((week, i) => ({
  id: i,
  label: week,
}));

export const DATE_OPTIONS = DATES.map((date) => ({
  id: date,
  label: String(date),
}));

export const MONTH_OPTIONS = MONTHS.map((month, i) => ({
  id: i,
  label: month,
}));

export const RECURRENCE_OPTIONS = [
  {
    id: RECURRENCE.DAILY,
    label: capitalize(RECURRENCE.DAILY),
  },
  {
    id: RECURRENCE.WEEKLY,
    label: capitalize(RECURRENCE.WEEKLY),
  },
  {
    id: RECURRENCE.MONTHLY,
    label: capitalize(RECURRENCE.MONTHLY),
  },
  {
    id: RECURRENCE.YEARLY,
    label: capitalize(RECURRENCE.YEARLY),
  },
];

export const INVALID_DATE_STRATEFY_OPTIONS = [
  {
    id: INVALID_DATE_STRATEGY.SHIFT,
    label: 'Shift task date',
  },
  {
    id: INVALID_DATE_STRATEGY.SKIP,
    label: 'Skip the task',
  },
];

export const INVALID_DATE_STRATEGY_INFO = {
  [INVALID_DATE_STRATEGY.SHIFT]:
    'Move the task to the last valid date of the month (e.g., 31st → 30th in April, or 28th in February). Click to know more',
  [INVALID_DATE_STRATEGY.SKIP]:
    'Don’t schedule the task for months where the selected date doesn’t exist. Click to know more',
};
