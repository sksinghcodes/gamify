import type { ValidationRule } from '~/utils/validation';

export const taskStep1Rules: ValidationRule[] = [
  {
    field: 'name',
    validations: [
      {
        name: 'isRequired',
      },
      {
        name: 'checkLength',
        args: [1, 100],
      },
    ],
  },
  {
    field: 'description',
    validations: [
      {
        name: 'checkLength',
        args: [1, 500],
      },
    ],
  },
];
