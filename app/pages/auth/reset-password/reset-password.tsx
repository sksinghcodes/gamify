import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../../api';
import type {
  ResetPasswordDataIF,
  ResetPasswordValidationIF,
  ResetPasswordValidationRulesIF,
} from '../../../types/auth-types';
import { validationFunctions } from '../../../utils/validation';
import ErrorText from '../../../components/error-text/error-text';
import SpinnerButton from '../../../components/spinner-button/spinner-button';
import SuccessText from '../../../components/success-text/success-text';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '../../../constants';

export function meta() {
  return [{ title: 'Reset Password' }];
}

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordResetId, setPasswordResetId] = useState('');

  const [resetPasswordData, setResetPasswordData] =
    useState<ResetPasswordDataIF>({
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    });

  const [resetPasswordValidation, setResetPasswordValidation] =
    useState<ResetPasswordValidationIF>({
      code: { errorMessage: '', touched: false, isValid: false },
      newPassword: { errorMessage: '', touched: false, isValid: false },
      confirmNewPassword: { errorMessage: '', touched: false, isValid: false },
    });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationRules: ResetPasswordValidationRulesIF = {
    code: [
      { function: 'isRequired' },
      { function: 'noSpaces' },
      { function: 'checkLength', args: [6, 6] },
    ],
    newPassword: [
      { function: 'isRequired' },
      { function: 'noSpaces' },
      { function: 'checkLength', args: [6, 30] },
      { function: 'isPassword' },
    ],
    confirmNewPassword: [
      { function: 'isRequired' },
      { function: 'isSameAsPassword', args: [resetPasswordData.newPassword] },
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResetPasswordValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof ResetPasswordValidationIF],
        touched: true,
      },
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordResetId) {
      if (email.trim()) {
        setLoading(true);
        setEmailError('');
        api
          .get(API_ENDPOINTS.RESET_PASSWORD, { params: { email } })
          .then(({ data }) => {
            setLoading(false);
            if (data.success) {
              setPasswordResetId(data.passwordResetId);
            } else {
              setEmailError(data.error);
            }
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
          });
      } else {
        setEmailError('Please enter email');
      }
    } else {
      const isFormValid =
        resetPasswordValidation.code.isValid &&
        resetPasswordValidation.newPassword.isValid &&
        resetPasswordValidation.confirmNewPassword.isValid;

      if (isFormValid) {
        setLoading(true);
        api
          .post(API_ENDPOINTS.RESET_PASSWORD, {
            ...resetPasswordData,
            passwordResetId,
          })
          .then(({ data }) => {
            setLoading(false);
            if (data.success) {
              setSuccess(true);
            } else {
              if (data.validation) {
                const updatedValidation = { ...resetPasswordValidation };
                for (const key of Object.keys(data.validation)) {
                  updatedValidation[key as keyof ResetPasswordValidationIF] = {
                    ...updatedValidation[
                      key as keyof ResetPasswordValidationIF
                    ],
                    errorMessage: data.validation[key].errorMessage,
                    isValid: data.validation[key].isValid,
                  };
                }
                setResetPasswordValidation(updatedValidation);
              }
              if (data.error) {
                setSuccess(false);
                setError(data.error);
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
            setSuccess(false);
          });
      } else {
        validate(validationRules, true);
      }
    }
  };

  const validate = (
    validationRules: ResetPasswordValidationRulesIF,
    fromSubmit: boolean = false
  ) => {
    const updatedValidation: ResetPasswordValidationIF = {
      ...resetPasswordValidation,
    };

    for (const [key, rules] of Object.entries(validationRules)) {
      if (
        resetPasswordValidation[key as keyof ResetPasswordValidationIF]
          .touched ||
        fromSubmit
      ) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const message = validationFunctions[rule.function](
            resetPasswordData[key as keyof ResetPasswordDataIF],
            ...(rule.args || [])
          );

          if (message) {
            updatedValidation[key as keyof ResetPasswordValidationIF] = {
              ...updatedValidation[key as keyof ResetPasswordValidationIF],
              errorMessage: message,
              isValid: false,
            };
            break;
          }

          if (i === rules.length - 1) {
            updatedValidation[key as keyof ResetPasswordValidationIF] = {
              ...updatedValidation[key as keyof ResetPasswordValidationIF],
              errorMessage: '',
              isValid: true,
            };
          }
        }
      }
    }

    setResetPasswordValidation(updatedValidation);
  };

  useEffect(() => {
    validate(validationRules);
  }, [
    resetPasswordData.code,
    resetPasswordData.newPassword,
    resetPasswordData.confirmNewPassword,
  ]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {!passwordResetId ? (
        <div className={styles.field}>
          <label className={styles.inputWrap}>
            <span className={styles.labelText}>
              Enter the email address that you used in your profile
            </span>
            <input
              className={styles.input}
              type="text"
              name="email"
              value={email}
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </label>
          {emailError && <ErrorText>{emailError}</ErrorText>}
        </div>
      ) : (
        <>
          <div className={styles.field}>
            <label className={styles.inputWrap}>
              <span className={styles.labelText}>
                A six-digit code has been sent to your email address. Please
                enter it here to reset your password.
              </span>
              <input
                className={styles.input}
                type="text"
                name="code"
                placeholder="XXXXXX"
                value={resetPasswordData.code}
                onChange={handleChange}
                autoComplete="username"
              />
            </label>
            {resetPasswordValidation.code.errorMessage && (
              <ErrorText>{resetPasswordValidation.code.errorMessage}</ErrorText>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.inputWrap}>
              <span className={styles.labelText}>New Password</span>
              <input
                className={styles.input}
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={resetPasswordData.newPassword}
                onChange={handleChange}
              />
            </label>
            {resetPasswordValidation.newPassword.errorMessage && (
              <ErrorText>
                {resetPasswordValidation.newPassword.errorMessage}
              </ErrorText>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.inputWrap}>
              <span className={styles.labelText}>Confirm New Password</span>
              <input
                className={styles.input}
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={resetPasswordData.confirmNewPassword}
                onChange={handleChange}
              />
            </label>
            {resetPasswordValidation.confirmNewPassword.errorMessage && (
              <ErrorText>
                {resetPasswordValidation.confirmNewPassword.errorMessage}
              </ErrorText>
            )}
          </div>
        </>
      )}

      <div className="text-center">
        <SpinnerButton disabled={loading} loading={loading}>
          {!passwordResetId ? 'Get Confirmation Code' : 'Reset Password'}
        </SpinnerButton>
      </div>

      {error && (
        <>
          <ErrorText>{error}</ErrorText>
        </>
      )}

      {success && (
        <>
          <SuccessText>
            Your password has been changed. Now you can{' '}
            <Link to={ROUTES.SIGN_IN.path}>Sign In</Link>.
          </SuccessText>
        </>
      )}
    </form>
  );
};

export default ResetPassword;
