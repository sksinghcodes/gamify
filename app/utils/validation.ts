import type { FormFieldState } from '~/types/auth-types';

type ValidatorFn = (...args: any[]) => string;

const ensureString: (val: unknown) => string = (val) => {
  return typeof val === 'string' ? val : String(val ?? '');
};

export const validationFunctions: Record<string, ValidatorFn> = {
  isRequired: function (
    value: string,
    errorMessage?: string,
    fieldName?: string
  ) {
    return !!ensureString(value).trim()
      ? ''
      : errorMessage || `${fieldName || 'This field'} is required`;
  },
  checkLength: function (
    value: string,
    min: number,
    max: number,
    errorMessage?: string
  ) {
    return ensureString(value).trim().length === 0 ||
      (ensureString(value).trim().length >= min &&
        ensureString(value).trim().length <= max)
      ? ''
      : errorMessage ||
          `Input must be minimum ${min} and maximum ${max} characters in length`;
  },
  noSpaces: function (value: string, errorMessage?: string) {
    return !value.includes(' ')
      ? ''
      : errorMessage || `Input must not contain spaces`;
  },
  isUsername: function (value: string, errorMessage?: string) {
    return /^[a-zA-Z0-9_.]+$/.test(value)
      ? ''
      : errorMessage ||
          `Only alphanumeric characters {A-Z, a-z, 0-9}, underscore {_}, and period {.} are allowed`;
  },
  isEmail: function (value: string, errorMessage?: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      ? ''
      : errorMessage || 'Enter a valid email address';
  },
  isPassword: function (value: string, errorMessage?: string) {
    let hasNumeric = false;
    let hasUppercase = false;
    let hasLowercase = false;
    let hasSpecial = false;
    let hasInvalidChar = false;
    const invalidChars: string[] = [];
    const numericCharacters = [48, 57]; // 0-9
    const uppercaseCharacters = [65, 90]; // A-Z
    const lowercaseCharacters = [97, 122]; // a-z
    const specialCharacters = [
      [33, 33], // !
      [35, 36], // #$
      [38, 38], // &
      [40, 43], // ()*+
      [45, 46], // _.
      [61, 61], // =
      [63, 64], // ?@
      [91, 91], // [
      [93, 96], // ]^_`
      [126, 126], // ~
    ];

    value.split('').forEach((char) => {
      let isNumeric = false;
      let isUppercase = false;
      let isLowercase = false;
      let isSpecial = false;
      const charCode = char.charCodeAt(0);

      if (
        charCode >= numericCharacters[0] &&
        charCode <= numericCharacters[1]
      ) {
        hasNumeric = true;
        isNumeric = true;
      }

      if (
        charCode >= uppercaseCharacters[0] &&
        charCode <= uppercaseCharacters[1]
      ) {
        hasUppercase = true;
        isUppercase = true;
      }

      if (
        charCode >= lowercaseCharacters[0] &&
        charCode <= lowercaseCharacters[1]
      ) {
        hasLowercase = true;
        isLowercase = true;
      }

      specialCharacters.forEach((chars) => {
        if (charCode >= chars[0] && charCode <= chars[1]) {
          hasSpecial = true;
          isSpecial = true;
        }
      });

      if (!isNumeric && !isUppercase && !isLowercase && !isSpecial) {
        hasInvalidChar = true;
        invalidChars.push(char);
      }
    });

    if (hasInvalidChar) {
      return `Password has invalid character${
        invalidChars.length ? 's' : ''
      }: ${invalidChars.join(' ')}`;
    }

    if (!hasNumeric || !hasUppercase || !hasLowercase || !hasSpecial) {
      return 'Password must contain at least one uppercase letter {A-Z}, at least one lowercase letter {a-z}, at least one digit {0-9}, and at least one special character from !#$&()*+_.=?@[]^_`~';
    }

    return '';
  },
  isSameAsPassword: function (
    value: string,
    password: string,
    errorMessage?: string
  ) {
    return value === password ? '' : errorMessage || 'Passwords do not match';
  },
};

type ArgsFunc<T> = (state: T) => any[];
interface ArgsFunctions<T> {
  [key: string]: ArgsFunc<T>;
}

type CustomFunc = (...args: any[]) => string | Promise<string>;
interface CustomFunctions {
  [key: string]: CustomFunc;
}

type BaseValidation = {
  name: string;
  args?: any[];
  getArgsFunction?: string;
};

type SyncValidation = BaseValidation & {
  isCustom?: boolean;
};

type AsyncCustomValidation = BaseValidation & {
  isCustom: true;
  isAsync: true;
};

type Validation = SyncValidation | AsyncCustomValidation;

export interface ValidationRule {
  field: string;
  validations: Validation[];
}

export const validate = <
  T extends Record<string, FormFieldState<any>>,
  K extends keyof T = keyof T
>({
  rules,
  state,
  setState,
  newInput,
  onlyValidateTouched = true,
  customValidators,
  argumentGetters,
}: {
  rules: ValidationRule[];
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  newInput?: [K & string, T[K]['value']];
  onlyValidateTouched?: boolean;
  customValidators?: CustomFunctions;
  argumentGetters?: ArgsFunctions<T>;
}): {
  isValid: boolean;
  someFieldsAsyncValidating: boolean;
} => {
  let isValid = true;
  const stateCopy = structuredClone(state);
  let changedKey: keyof T & string = '';

  if (newInput) {
    const [key, value] = newInput;
    stateCopy[key].value = value;
    stateCopy[key].touched = true;
    changedKey = key;
  }

  for (const { field, validations } of rules) {
    const key = field as keyof T;
    const item = stateCopy[key];

    if (onlyValidateTouched && (!item.touched || changedKey !== field))
      continue;

    for (const validation of validations) {
      const staticArgs = validation.args || [];
      const dynamicArgs = validation.getArgsFunction
        ? argumentGetters?.[validation.getArgsFunction]?.(state) ?? []
        : [];

      const args = [item.value, ...staticArgs, ...dynamicArgs];

      if (
        (validation as AsyncCustomValidation).isAsync &&
        validation.isCustom &&
        customValidators?.[validation.name] &&
        changedKey === field
      ) {
        item.error = '';
        item.validatingAsync = true;

        (customValidators[validation.name](...args) as Promise<string>)
          .then((error: string) => {
            setState((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                error,
                validatingAsync: false,
              },
            }));
          })
          .catch(() => {
            setState((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                error: 'Something went wrong. Cannot validate right now.',
                validatingAsync: false,
              },
            }));
          });

        break; // Exit sync loop on async
      }

      if (
        !(validation as AsyncCustomValidation).isAsync &&
        validation.isCustom &&
        customValidators?.[validation.name]
      ) {
        const error = customValidators[validation.name](...args) as string;
        item.error = error;
        if (error) break;
      }

      if (!validation.isCustom && validationFunctions[validation.name]) {
        const error = validationFunctions[validation.name](...args);
        item.error = error;
        if (error) break;
      }
    }
  }

  for (const key in stateCopy) {
    if (stateCopy[key].error) {
      isValid = false;
      break;
    }
  }

  const someFieldsAsyncValidating = Object.values(stateCopy).some(
    (f) => f.validatingAsync
  );

  setState(stateCopy);

  return {
    isValid,
    someFieldsAsyncValidating,
  };
};

export const extractValues = <T extends Record<string, { value: any }>>(
  state: T
): { [K in keyof T]: T[K]['value'] } => {
  const result = {} as { [K in keyof T]: T[K]['value'] };

  for (const key in state) {
    result[key] = state[key].value;
  }

  return result;
};
