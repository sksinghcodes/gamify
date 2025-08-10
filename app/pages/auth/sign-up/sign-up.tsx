import { useRef, useState } from 'react';
import api from '~/api';
import { useNavigate } from 'react-router';
import { extractValues, validate } from '~/utils/validation';
import ErrorText from '~/components/error-text/error-text';
import SpinnerButton from '~/components/spinner-button/spinner-button';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import InputText from '~/components/form-elements/input-text';
import type {
  ApiValidationResponse,
  SignUpFormState,
} from '~/types/auth-types';

export const meta = () => {
  return [{ title: ROUTES.SIGN_UP.title }];
};

const SignUp = () => {
  const validationRules = [
    {
      field: 'username',
      validations: [
        {
          name: 'isRequired',
        },
        {
          name: 'noSpaces',
        },
        {
          name: 'checkLength',
          args: [2, 30],
        },
        {
          name: 'isUsername',
        },
        {
          name: 'isUsernameUnique',
          isCustom: true,
          isAsync: true,
        },
      ],
    },
    {
      field: 'email',
      validations: [
        {
          name: 'isRequired',
        },
        {
          name: 'noSpaces',
        },
        {
          name: 'isEmail',
        },
        {
          name: 'isEmailUnique',
          isCustom: true,
          isAsync: true,
        },
      ],
    },
    {
      field: 'password',
      validations: [
        {
          name: 'isRequired',
        },
        {
          name: 'noSpaces',
        },
        {
          name: 'checkLength',
          args: [6, 30],
        },
        {
          name: 'isPassword',
        },
      ],
    },
    {
      field: 'confirmPassword',
      validations: [
        {
          name: 'isRequired',
        },
        {
          name: 'isSameAsPassword',
          getArgsFunction: 'getPassword',
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<SignUpFormState>({
    username: {
      value: '',
      error: '',
      touched: false,
      validatingAsync: false,
    },
    email: {
      value: '',
      error: '',
      touched: false,
      validatingAsync: false,
    },
    password: {
      value: '',
      error: '',
      touched: false,
    },
    confirmPassword: {
      value: '',
      error: '',
      touched: false,
    },
  });

  const usernameDebounce = useRef<number | null>(null);
  const emailDebounce = useRef<number | null>(null);

  const debounceCheckUnique = (
    ref: { current: number | null },
    key: 'email' | 'username',
    value: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = window.setTimeout(() => {
        api
          .get(API_ENDPOINTS.CHECK_UNIQUE, { params: { [key]: value } })
          .then(({ data }) => {
            if (data.success) {
              resolve(data.isUnique ? '' : `${key} is already taken`);
            } else {
              resolve('Try again later');
            }
          })
          .catch((error) => {
            setError(error.message);
            resolve('Try again later');
          });
      }, 1000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof SignUpFormState;

    validate({
      rules: validationRules,
      state: signUpData,
      setState: setSignUpData,
      newInput: [key, value],
      onlyValidateTouched: true,
      customValidators: {
        isUsernameUnique: (username) =>
          debounceCheckUnique(usernameDebounce, 'username', username),
        isEmailUnique: (email) =>
          debounceCheckUnique(emailDebounce, 'email', email),
      },
      argumentGetters: {
        getPassword: (state) => [state.password.value],
      },
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { isValid, someFieldsAsyncValidating } = validate({
      rules: validationRules,
      state: signUpData,
      setState: setSignUpData,
      onlyValidateTouched: false,
      customValidators: {
        isUsernameUnique: (username) =>
          debounceCheckUnique(usernameDebounce, 'username', username),
        isEmailUnique: (email) =>
          debounceCheckUnique(emailDebounce, 'email', email),
      },
      argumentGetters: {
        getPassword: (state) => [state.password.value],
      },
    });

    const canSubmit = isValid && !someFieldsAsyncValidating;

    if (!canSubmit) {
      return;
    }

    setLoading(true);

    try {
      const { data }: ApiValidationResponse<SignUpFormState> = await api.post(
        API_ENDPOINTS.SIGN_UP,
        extractValues(signUpData)
      );

      if (data.success) {
        navigate(ROUTES.VERIFY_PROFILE.path, {
          state: data.confirmationCodeId,
        });
      }

      if (!data.success && data.validation) {
        const updatedValidation = { ...signUpData };

        updatedValidation.email.error = data.validation.username?.isUnique
          ? ''
          : 'Email is taken';
        updatedValidation.username.error = data.validation.username?.isUnique
          ? ''
          : 'Username is taken';

        Object.entries(data.validation).forEach(([key, value]: any) => {
          const keyTyped = key as keyof SignUpFormState;
          updatedValidation[keyTyped] = {
            ...updatedValidation[keyTyped],
            error: value.errorMessage,
          };
        });

        setSignUpData(updatedValidation);
      }

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <InputText
        type="text"
        autoComplete=""
        label="Choose a username"
        name="username"
        id="username"
        placeholder="Username"
        value={signUpData.username.value}
        onChange={handleChange}
        error={signUpData.username.error}
        showSpinner={signUpData.username.validatingAsync}
      />

      <InputText
        type="text"
        autoComplete="email"
        label="Email Address"
        name="email"
        id="email"
        placeholder="Email Address"
        value={signUpData.email.value}
        onChange={handleChange}
        error={signUpData.email.error}
        showSpinner={signUpData.email.validatingAsync}
      />

      <InputText
        type="password"
        label="Password"
        name="password"
        id="password"
        placeholder="Password"
        value={signUpData.password.value}
        onChange={handleChange}
        error={signUpData.password.error}
      />

      <InputText
        type="password"
        label="Confirm Password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
        value={signUpData.confirmPassword.value}
        onChange={handleChange}
        error={signUpData.confirmPassword.error}
      />

      <SpinnerButton disabled={loading} loading={loading}>
        Sign Up
      </SpinnerButton>

      {error && <ErrorText>{error}</ErrorText>}
    </form>
  );
};

export default SignUp;
