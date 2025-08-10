import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import api from '~/api';
import SpinnerButton from '~/components/spinner-button/spinner-button';
import SuccessText from '~/components/success-text/success-text';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import InputText from '~/components/form-elements/input-text';
import type { CodeFormState } from '~/types/auth-types';
import {
  extractValues,
  validate,
  type ValidationRule,
} from '~/utils/validation';

const {
  SIGN_IN: { path: SIGN_IN },
  TASK_LIST: { path: TASK_LIST },
} = ROUTES;

export const meta = () => {
  return [{ title: ROUTES.VERIFY_PROFILE.title }];
};

const VerifyProfile = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codeData, setCodeData] = useState<CodeFormState>({
    code: {
      value: '',
      error: '',
      touched: false,
    },
  });

  const location = useLocation();

  if (!location.state) {
    return <Navigate to={TASK_LIST} replace />;
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { isValid, someFieldsAsyncValidating } = validate({
      rules: validationRules,
      state: codeData,
      setState: setCodeData,
      onlyValidateTouched: false,
    });

    const canSubmit = isValid && !someFieldsAsyncValidating;

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post(API_ENDPOINTS.VERIFY_PROFILE, {
        verificationId: location.state,
        ...extractValues(codeData),
      });

      if (data.success) {
        setSuccess(true);
        setError('');
      } else {
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

  const validationRules: ValidationRule[] = [
    {
      field: 'code',
      validations: [
        { name: 'isRequired' },
        {
          name: 'checkLength',
          args: [6, 6, 'Verification code must contain 6 digits'],
        },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof CodeFormState;
    setError('');

    validate({
      rules: validationRules,
      state: codeData,
      setState: setCodeData,
      newInput: [key, value],
      onlyValidateTouched: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <InputText
        type="text"
        label="A six digit code has been sent to you on your email address. Please enter it here to confirm your profile"
        name="code"
        id="code"
        placeholder="XXXXXX"
        value={codeData.code.value}
        onChange={handleChange}
        error={codeData.code.error || error}
      />
      <SpinnerButton disabled={loading} loading={loading}>
        Verify
      </SpinnerButton>
      {success && (
        <>
          <SuccessText>
            Your profile has has been verified. Now click on{' '}
            <Link to={SIGN_IN}>Sign In</Link>
          </SuccessText>
        </>
      )}
    </form>
  );
};

export default VerifyProfile;
