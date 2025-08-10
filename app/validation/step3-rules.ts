import { AUTO_REMOVE, SCHEDULE } from '~/constants';
import type {
  AutoRemoveEnum,
  ScheduleEnum,
  TaskFormStep3,
} from '~/types/task-types';
import type { ValidationRule } from '~/utils/validation';

export const taskStep3Rules: ValidationRule[] = [
  {
    field: 'scheduleStartTime',
    validations: [
      {
        name: 'validateTime',
        isCustom: true,
        getArgsFunction: 'getScheduleType',
      },
    ],
  },
  {
    field: 'scheduleEndTime',
    validations: [
      {
        name: 'validateTime',
        isCustom: true,
        getArgsFunction: 'getScheduleType',
      },
    ],
  },
  {
    field: 'autoRemoveDate',
    validations: [
      {
        name: 'validateRemoveDate',
        isCustom: true,
        getArgsFunction: 'getAutoRemove',
      },
    ],
  },
];

export const getScheduleType = (state: TaskFormStep3) => [state.schedule.value];

export const validateTime = (value: number, scheduleType: ScheduleEnum) => {
  return scheduleType === SCHEDULE.TIMED && value === null
    ? 'This field is required'
    : '';
};

export const getAutoRemove = (state: TaskFormStep3) => [state.autoRemove.value];

export const validateRemoveDate = (
  value: number,
  autoRemoveType: AutoRemoveEnum
) => {
  return autoRemoveType === AUTO_REMOVE.AFTER_GIVEN_DATE && value === null
    ? 'Remove date is required'
    : '';
};
