import { RECURRENCE } from '~/constants';
import type { RecurrenceEnum, TaskFormStep2 } from '~/types/task-types';
import type { ValidationRule } from '~/utils/validation';

export const taskStep2Rules: ValidationRule[] = [
  {
    field: 'recurrenceValues',
    validations: [
      {
        name: 'testRecurrenceValues',
        isCustom: true,
        getArgsFunction: 'getRecurrenceType',
      },
    ],
  },
];

export const testRecurrenceValues = (
  value: number[],
  recurrence: RecurrenceEnum
) => {
  return recurrence !== RECURRENCE.DAILY && !value.length
    ? `Select at least one ${
        recurrence === RECURRENCE.WEEKLY ? 'day' : 'date'
      } to continue`
    : '';
};

export const getRecurrenceType = (state: TaskFormStep2) => [
  state.recurrence.value,
];
