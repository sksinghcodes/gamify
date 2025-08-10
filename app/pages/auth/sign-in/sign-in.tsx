import { useState, useContext } from 'react';
import { Context } from '~/context-provider';
import api from '~/api';
import type {
  ApiValidationResponse,
  SignInFormState,
} from '~/types/auth-types';
import ErrorText from '~/components/error-text/error-text';
import {
  extractValues,
  validate,
  type ValidationRule,
} from '~/utils/validation';
import { Link, useNavigate } from 'react-router';
import SpinnerButton from '~/components/spinner-button/spinner-button';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import InputText from '~/components/form-elements/input-text';

const {
  VERIFY_PROFILE: { path: VERIFY_PROFILE },
  RESET_PASSWORD: { path: RESET_PASSWORD },
} = ROUTES;

export const meta = () => {
  return [{ title: ROUTES.SIGN_IN.title }];
};

const SignIn = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState<SignInFormState>({
    usernameOrEmail: { value: '', error: '', touched: false },
    password: { value: '', error: '', touched: false },
  });

  const validationRules: ValidationRule[] = [
    {
      field: 'usernameOrEmail',
      validations: [
        {
          name: 'isRequired',
        },
      ],
    },
    {
      field: 'password',
      validations: [
        {
          name: 'isRequired',
        },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof SignInFormState;

    validate({
      rules: validationRules,
      state: signInData,
      setState: setSignInData,
      newInput: [key, value],
      onlyValidateTouched: true,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { isValid, someFieldsAsyncValidating } = validate({
      rules: validationRules,
      state: signInData,
      setState: setSignInData,
      onlyValidateTouched: false,
    });

    const canSubmit = isValid && !someFieldsAsyncValidating;

    if (!canSubmit) {
      return;
    }

    setLoading(true);

    try {
      const { data }: ApiValidationResponse<SignInFormState> = await api.post(
        API_ENDPOINTS.SIGN_IN,
        extractValues(signInData)
      );

      if (data.success) {
        if (data.confirmationCodeId) {
          navigate(VERIFY_PROFILE, {
            state: data.confirmationCodeId,
          });
        } else {
          context?.checkSignedInStatus();
        }
      } else {
        if (data.validation) {
          setSignInData((prev) => ({
            usernameOrEmail: {
              ...prev.usernameOrEmail,
              error: data.validation?.usernameOrEmail?.errorMessage || '',
            },
            password: {
              ...prev.password,
              error: data.validation?.password?.errorMessage || '',
            },
          }));
        }

        if (data.error) {
          setError(data.error);
        }
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
        label="Username or email address"
        placeholder="Username or email address"
        name="usernameOrEmail"
        id="usernameOrEmail"
        value={signInData.usernameOrEmail.value}
        onChange={handleChange}
        autoComplete="username"
        error={signInData.usernameOrEmail.error}
      />

      <InputText
        type="password"
        label="Password"
        placeholder="Password"
        name="password"
        id="password"
        value={signInData.password.value}
        onChange={handleChange}
        autoComplete="password"
        error={signInData.password.error}
        showPasswordToggleButton={true}
      />

      <SpinnerButton disabled={loading} loading={loading}>
        Sign In
      </SpinnerButton>

      {error && (
        <>
          <ErrorText>{error}</ErrorText>
        </>
      )}

      <div className={styles.bottomText}>
        <Link to={RESET_PASSWORD}>Click here</Link> if you have forgotten your
        password
      </div>
    </form>
  );
};

export default SignIn;
