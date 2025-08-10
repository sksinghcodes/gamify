import { CATEGORY } from '~/constants';
import type { CategoryEnum } from '~/types/task-types';
import type { ValidationRule } from '~/utils/validation';

export const scoreLoggerRules: ValidationRule[] = [
  {
    field: 'score',
    validations: [{ name: 'isNotNull', isCustom: true }],
  },
  {
    field: 'calisthenicsReps',
    validations: [
      {
        name: 'validateCalisthenics',
        isCustom: true,
        getArgsFunction: 'getCategory',
      },
    ],
  },
  {
    field: 'cardioMinutes',
    validations: [
      {
        name: 'validateCardioMinutes',
        isCustom: true,
        getArgsFunction: 'getCategoryAndSeconds',
      },
    ],
  },
  {
    field: 'cardioSeconds',
    validations: [
      {
        name: 'validateCardioSeconds',
        isCustom: true,
        getArgsFunction: 'getCategoryAndMinutes',
      },
    ],
  },
];

export const weightTrainingValidations: ValidationRule[] = [
  {
    field: 'reps',
    validations: [
      {
        name: 'validateReps',
        isCustom: true,
        getArgsFunction: 'getCategory',
      },
    ],
  },
  {
    field: 'weight',
    validations: [
      {
        name: 'validateWeight',
        isCustom: true,
        getArgsFunction: 'getCategory',
      },
    ],
  },
];

export const isNotNull = (value: null | number) => {
  return value === null ? 'Score is required' : '';
};

export const validateCalisthenics = (
  value: number | null,
  category: CategoryEnum
) => {
  if (category !== CATEGORY.CALISTHENICS) {
    return '';
  }
  if (value === null) {
    return 'Please enter reps';
  }
  if (value < 1) {
    return 'Minimum reps can be 1';
  }
  if (value > 9999) {
    return 'Maximum reps can be 9999';
  }
  return '';
};

export const validatCardio = (
  minutes: number | null,
  category: CategoryEnum,
  seconds: number | null
) => {
  if (category !== CATEGORY.CARDIO) {
    return '';
  }
  if (minutes === null && seconds === null) {
    return "Both fields can't be empty";
  }
  if (minutes !== null && minutes > 999) {
    return "Minutes can't be more than 999";
  }
  if (minutes !== null && minutes < 1) {
    return "Minutes can't be less than 1";
  }
  if (seconds !== null && seconds > 59) {
    return "Seconds can't be more than 59";
  }
  if (seconds !== null && seconds < 5) {
    return 'Total time must be at least 5 seconds';
  }
  return '';
};

export const validateReps = (reps: number | null, category: CategoryEnum) => {
  if (category !== CATEGORY.WEIGHT_TRAINING) {
    return '';
  }
  if (reps === null) {
    return 'Please enter rep';
  }
  if (reps < 1) {
    return "Reps can't be less than 1";
  }

  if (reps > 9999) {
    return "Reps can't be more than 9999";
  }
  return '';
};

export const validateWeight = (
  weight: number | null,
  category: CategoryEnum
) => {
  if (category !== CATEGORY.WEIGHT_TRAINING) {
    return '';
  }
  if (weight === null) {
    return 'Please enter weight';
  }
  if (weight < 0.25) {
    return "Weight can't be less than 0.25kg";
  }

  if (weight > 999) {
    return "Weight can't be more than 999";
  }
  return '';
};
