import { useState } from 'react';
import { Link } from 'react-router';
import api from '~/api';
import type {
  ApiValidationResponse,
  EmailFormState,
  PasswordResetFormState,
} from '~/types/auth-types';
import {
  extractValues,
  validate,
  type ValidationRule,
} from '~/utils/validation';
import ErrorText from '~/components/error-text/error-text';
import SpinnerButton from '~/components/spinner-button/spinner-button';
import SuccessText from '~/components/success-text/success-text';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import InputText from '~/components/form-elements/input-text';

export const meta = () => {
  return [{ title: ROUTES.RESET_PASSWORD.title }];
};

const ResetPassword = () => {
  const [emailServerError, setEmailServerError] = useState('');

  const [passwordResetId, setPasswordResetId] = useState('');

  const [resetPasswordData, setResetPasswordData] =
    useState<PasswordResetFormState>({
      code: { value: '', error: '', touched: false },
      newPassword: { value: '', error: '', touched: false },
      confirmNewPassword: { value: '', error: '', touched: false },
    });

  const [email, setEmail] = useState<EmailFormState>({
    email: { value: '', error: '', touched: false },
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPasswordValidationRules: ValidationRule[] = [
    {
      field: 'code',
      validations: [
        { name: 'isRequired' },
        { name: 'noSpaces' },
        {
          name: 'checkLength',
          args: [6, 6, 'Verification code must contain 6 digits'],
        },
      ],
    },
    {
      field: 'newPassword',
      validations: [
        { name: 'isRequired' },
        { name: 'noSpaces' },
        { name: 'checkLength', args: [6, 30] },
        { name: 'isPassword' },
      ],
    },
    {
      field: 'confirmNewPassword',
      validations: [
        { name: 'isRequired' },
        { name: 'isSameAsPassword', getArgsFunction: 'getNewPassword' },
      ],
    },
  ];

  const emailValidationRules: ValidationRule[] = [
    {
      field: 'email',
      validations: [{ name: 'isRequired' }, { name: 'isEmail' }],
    },
  ];

  const handleResetPassowrdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof PasswordResetFormState;
    validate({
      rules: resetPasswordValidationRules,
      state: resetPasswordData,
      setState: setResetPasswordData,
      newInput: [key, value],
      onlyValidateTouched: true,
      argumentGetters: {
        getNewPassword: (state) => [state.newPassword.value],
      },
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof EmailFormState;
    validate({
      rules: emailValidationRules,
      state: email,
      setState: setEmail,
      newInput: [key, value],
      onlyValidateTouched: true,
    });
  };

  const handleEmailSubmit = async () => {
    setError('');

    const { isValid, someFieldsAsyncValidating } = validate({
      rules: emailValidationRules,
      state: email,
      setState: setEmail,
      onlyValidateTouched: false,
    });

    const canSubmit = isValid && !someFieldsAsyncValidating;

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setEmailServerError('');

    try {
      const { data }: ApiValidationResponse<EmailFormState> = await api.get(
        API_ENDPOINTS.RESET_PASSWORD,
        {
          params: extractValues(email),
        }
      );

      if (data.success) {
        setPasswordResetId(data.passwordResetId || '');
      } else {
        setEmailServerError(data.error || '');
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

  const handleResetPasswordSubmit = async () => {
    setError('');

    const { isValid, someFieldsAsyncValidating } = validate({
      rules: resetPasswordValidationRules,
      state: resetPasswordData,
      setState: setResetPasswordData,
      onlyValidateTouched: false,
      argumentGetters: {
        getNewPassword: (state) => [state.newPassword.value],
      },
    });

    const canSubmit = isValid && !someFieldsAsyncValidating;

    if (!canSubmit) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
        ...extractValues(resetPasswordData),
        passwordResetId,
      });

      if (data.success) {
        setSuccess(true);
      } else {
        if (data.validation) {
          const updatedValidation = { ...resetPasswordData };
          for (const key of Object.keys(data.validation)) {
            const keyTyped = key as keyof PasswordResetFormState;
            updatedValidation[keyTyped] = {
              ...updatedValidation[keyTyped],
              error: data.validation[keyTyped].errorMessage,
            };
          }
          setResetPasswordData(updatedValidation);
        }
        if (data.error) {
          setSuccess(false);
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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwordResetId) {
      handleResetPasswordSubmit();
    } else {
      handleEmailSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {!passwordResetId ? (
        <InputText
          type="text"
          label="Enter the email address that you used in your profile"
          name="email"
          id="email"
          placeholder="Email Address"
          value={email.email.value}
          onChange={handleEmailChange}
          error={email.email.error || emailServerError}
        />
      ) : (
        <>
          <InputText
            type="text"
            label="A six-digit code has been sent to your email address. Please enter it here to reset your password."
            name="code"
            id="code"
            placeholder="XXXXXX"
            value={resetPasswordData.code.value}
            onChange={handleResetPassowrdChange}
            error={resetPasswordData.code.error}
          />

          <InputText
            type="password"
            label="New Password"
            name="newPassword"
            id="newPassword"
            placeholder="New Password"
            value={resetPasswordData.newPassword.value}
            onChange={handleResetPassowrdChange}
            error={resetPasswordData.newPassword.error}
          />

          <InputText
            type="password"
            label="Confirm New Password"
            name="confirmNewPassword"
            id="confirmNewPassword"
            placeholder="Confirm new password"
            value={resetPasswordData.confirmNewPassword.value}
            onChange={handleResetPassowrdChange}
            error={resetPasswordData.confirmNewPassword.error}
          />
        </>
      )}

      <SpinnerButton disabled={loading} loading={loading}>
        {!passwordResetId ? 'Get Confirmation Code' : 'Reset Password'}
      </SpinnerButton>

      {error && <ErrorText>{error}</ErrorText>}

      {success && (
        <SuccessText>
          Your password has been changed. Now you can{' '}
          <Link to={ROUTES.SIGN_IN.path}>Sign In</Link>.
        </SuccessText>
      )}
    </form>
  );
};

export default ResetPassword;
