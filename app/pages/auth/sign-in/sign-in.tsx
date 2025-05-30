import { useState, useContext, useEffect } from 'react';
import { Context } from '../../../context-provider';
import api from '../../../api';
import type {
  SignInDataIF,
  SignInValidationIF,
  SignInValidationRulesIF,
} from '../../../types/auth-types';
import ErrorText from '../../../components/error-text/error-text';
import { validationFunctions } from '../../../utils/validation';
import { Link, useNavigate } from 'react-router';
import SpinnerButton from '../../../components/spinner-button/spinner-button';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '../../../constants';

const {
  VERIFY_PROFILE: { path: VERIFY_PROFILE },
  RESET_PASSWORD: { path: RESET_PASSWORD },
} = ROUTES;

export function meta() {
  return [{ title: 'Sign In' }];
}

const SignIn = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState<SignInDataIF>({
    usernameOrEmail: '',
    password: '',
  });

  const [signInValidation, setSignInValidation] = useState<SignInValidationIF>({
    usernameOrEmail: { errorMessage: '', touched: false, isValid: false },
    password: { errorMessage: '', touched: false, isValid: false },
  });

  const validationRules: SignInValidationRulesIF = {
    usernameOrEmail: [{ function: 'isRequired' }],
    password: [{ function: 'isRequired' }],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setSignInValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof SignInValidationIF],
        touched: true,
      },
    }));

    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (
      signInValidation.usernameOrEmail.isValid &&
      signInValidation.password.isValid
    ) {
      setLoading(true);
      api
        .post(API_ENDPOINTS.SIGN_IN, signInData)
        .then(({ data }) => {
          setLoading(false);

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
              setSignInValidation((prev) => ({
                usernameOrEmail: {
                  ...prev.usernameOrEmail,
                  errorMessage: data.validation.usernameOrEmail.errorMessage,
                  isValid: data.validation.usernameOrEmail.isValid,
                },
                password: {
                  ...prev.password,
                  errorMessage: data.validation.password.errorMessage,
                  isValid: data.validation.password.isValid,
                },
              }));
            }

            if (data.error) {
              setError(data.error);
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    } else {
      validate(validationRules, true);
    }
  };

  const validate = (rules: SignInValidationRulesIF, fromSubmit = false) => {
    const updatedValidation: SignInValidationIF = { ...signInValidation };

    for (const [key, validators] of Object.entries(rules)) {
      if (
        signInValidation[key as keyof SignInValidationIF].touched ||
        fromSubmit
      ) {
        for (let i = 0; i < validators.length; i++) {
          const rule = validators[i];
          const message = validationFunctions[rule.function](
            signInData[key as keyof SignInDataIF],
            ...(rule.args || [])
          );

          if (message) {
            updatedValidation[key as keyof SignInValidationIF] = {
              ...updatedValidation[key as keyof SignInValidationIF],
              errorMessage: message,
              isValid: false,
            };
            break;
          }

          if (i === validators.length - 1) {
            updatedValidation[key as keyof SignInValidationIF] = {
              ...updatedValidation[key as keyof SignInValidationIF],
              errorMessage: '',
              isValid: true,
            };
          }
        }
      }
    }

    setSignInValidation(updatedValidation);
  };

  useEffect(() => {
    validate(validationRules);
  }, [signInData.usernameOrEmail, signInData.password]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span className={styles.labelText}>Username or email address</span>
          <input
            className={styles.input}
            type="text"
            name="usernameOrEmail"
            placeholder="Username or email address"
            value={signInData.usernameOrEmail}
            onChange={handleChange}
            autoComplete="username"
          />
        </label>
        {signInValidation.usernameOrEmail.errorMessage && (
          <ErrorText>{signInValidation.usernameOrEmail.errorMessage}</ErrorText>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span className={styles.labelText}>Password</span>
          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={signInData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              className={styles.passwordButton}
              type="button"
              style={{ width: 40 }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.passwordIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.passwordIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.747-4.163m3.4-2.08A9.978 9.978 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-1.397 2.568M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
        </label>
        {signInValidation.password.errorMessage && (
          <ErrorText>{signInValidation.password.errorMessage}</ErrorText>
        )}
      </div>

      <div className="text-center">
        <SpinnerButton disabled={loading} loading={loading}>
          Sign In
        </SpinnerButton>
      </div>

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
