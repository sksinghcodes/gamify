import { useCallback, useEffect, useRef, useState } from 'react';
import api from '~/api';
import { useNavigate } from 'react-router';
import type {
  AvailabilityIF,
  SignUpDataIF,
  SignUpValidationIF,
  ValidationRuleIF,
  SignUpValidationRulesIF,
} from '~/types/auth-types';
import { validationFunctions } from '~/utils/validation';
import ErrorText from '~/components/error-text/error-text';
import SpinnerButton from '~/components/spinner-button/spinner-button';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';

export const meta = () => {
  return [{ title: ROUTES.SIGN_UP.title }];
};

const SignUp = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [signUpData, setSignUpData] = useState<SignUpDataIF>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [signUpValidation, setSignUpValidation] = useState<SignUpValidationIF>({
    username: {
      errorMessage: '',
      touched: false,
      isValid: false,
    },
    email: {
      errorMessage: '',
      touched: false,
      isValid: false,
    },
    password: {
      errorMessage: '',
      touched: false,
      isValid: false,
    },
    confirmPassword: {
      errorMessage: '',
      touched: false,
      isValid: false,
    },
  });

  const [usernameAvailability, setUsernameAvailability] =
    useState<AvailabilityIF>({
      checkingUnique: false,
      isUnique: null,
    });

  const [emailAvailability, setEmailAvailability] = useState<AvailabilityIF>({
    checkingUnique: false,
    isUnique: null,
  });

  const validationRules: SignUpValidationRulesIF = {
    username: [
      { function: 'isRequired' },
      { function: 'noSpaces' },
      { function: 'checkLength', args: [2, 30] },
      { function: 'isUsername' },
    ],
    email: [
      { function: 'isRequired' },
      { function: 'noSpaces' },
      { function: 'isEmail' },
    ],
    password: [
      { function: 'isRequired' },
      { function: 'noSpaces' },
      { function: 'checkLength', args: [6, 30] },
      { function: 'isPassword' },
    ],
    confirmPassword: [
      { function: 'isRequired' },
      { function: 'isSameAsPassword', args: [signUpData.password] },
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setSignUpValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof SignUpValidationIF],
        touched: true,
      },
    }));

    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (
      signUpValidation.username.isValid &&
      signUpValidation.email.isValid &&
      signUpValidation.password.isValid &&
      signUpValidation.confirmPassword.isValid &&
      emailAvailability.isUnique &&
      !emailAvailability.checkingUnique &&
      usernameAvailability.isUnique &&
      !usernameAvailability.checkingUnique
    ) {
      setLoading(true);
      api
        .post(API_ENDPOINTS.SIGN_UP, signUpData)
        .then(({ data }) => {
          setLoading(false);

          if (data.success) {
            navigate(ROUTES.VERIFY_PROFILE.path, {
              state: data.confirmationCodeId,
            });
          }

          if (!data.success && data.validation) {
            const updatedValidation = { ...signUpValidation };

            Object.entries(data.validation).forEach(([key, value]: any) => {
              updatedValidation[key as keyof SignUpValidationIF] = {
                ...updatedValidation[key as keyof SignUpValidationIF],
                isValid: value.isValid,
                errorMessage: value.errorMessage,
              };
            });

            setSignUpValidation(updatedValidation);

            setUsernameAvailability({
              ...usernameAvailability,
              isUnique: data.validation.username.isUnique,
            });

            setEmailAvailability({
              ...emailAvailability,
              isUnique: data.validation.email.isUnique,
            });
          }

          if (!data.success && data.error) {
            setError(data.error);
          }
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      validate(validationRules, true);
    }
  };

  const usernameDebounce = useRef<number | null>(null);
  const emailDebounce = useRef<number | null>(null);

  const checkUnique = useCallback(
    (
      key: 'email' | 'username',
      setAvailability: React.Dispatch<React.SetStateAction<AvailabilityIF>>
    ) => {
      const value = signUpData[key].trim();

      if (!value) return;

      setAvailability((prev) => ({
        ...prev,
        checkingUnique: true,
      }));

      const debounceTimeout =
        key === 'email' ? emailDebounce : usernameDebounce;

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = window.setTimeout(() => {
        api
          .get(API_ENDPOINTS.CHECK_UNIQUE, { params: { [key]: value } })
          .then(({ data }) => {
            if (data.success) {
              setAvailability({
                isUnique: data.isUnique,
                checkingUnique: false,
              });
            }
          })
          .catch((error) => {
            setError(error.message);
            setAvailability((prev) => ({
              ...prev,
              checkingUnique: false,
            }));
          });
      }, 1000);
    },
    [signUpData]
  );

  const validate = (
    validationRules: SignUpValidationRulesIF,
    fromSubmit: boolean = false
  ) => {
    const keys = Object.keys(validationRules);
    let signUpValidationCopy: SignUpValidationIF = {} as SignUpValidationIF;

    keys.forEach(
      (key) =>
        (signUpValidationCopy[key as keyof SignUpValidationIF] = {
          ...signUpValidation[key as keyof SignUpValidationIF],
        })
    );

    for (const [key, validations] of Object.entries(validationRules)) {
      if (
        signUpValidation[key as keyof SignUpValidationIF].touched ||
        fromSubmit
      ) {
        for (const [index, validation] of Object.entries(validations)) {
          const message = validationFunctions[
            (validation as ValidationRuleIF).function
          ](
            signUpData[key as keyof SignUpDataIF],
            ...((validation as ValidationRuleIF).args || [])
          );

          if (message) {
            signUpValidationCopy[key as keyof SignUpValidationIF].errorMessage =
              message;
            signUpValidationCopy[key as keyof SignUpValidationIF].isValid =
              false;
            break;
          } else {
            if (+index === validations.length - 1) {
              signUpValidationCopy[key as keyof SignUpValidationIF].isValid =
                true;
            }
            signUpValidationCopy[key as keyof SignUpValidationIF].errorMessage =
              message;
          }
        }
      }
    }

    setSignUpValidation(signUpValidationCopy);
  };

  useEffect(() => {
    validate(validationRules);
  }, [
    signUpData.username,
    signUpData.email,
    signUpData.password,
    signUpData.confirmPassword,
  ]);

  useEffect(() => {
    if (signUpValidation.email.isValid) {
      checkUnique('email', setEmailAvailability);
    }
  }, [signUpData.email, signUpValidation.email.isValid]);

  useEffect(() => {
    if (signUpValidation.username.isValid) {
      checkUnique('username', setUsernameAvailability);
    }
  }, [signUpData.username, signUpValidation.username.isValid]);

  const checkingUsernameUnique =
    usernameAvailability.checkingUnique && signUpValidation.username.isValid;

  const checkingEmailUnique =
    emailAvailability.checkingUnique && signUpValidation.email.isValid;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Username Field */}
      <div className={styles.field}>
        <label
          className={`${styles.inputWrap} ${
            checkingUsernameUnique && styles.withRightItem
          }`}
        >
          <span className={styles.labelText}>Choose a username</span>
          <input
            className={styles.input}
            autoComplete="username"
            type="text"
            name="username"
            placeholder="Username"
            value={signUpData.username}
            onChange={handleChange}
          />
          {checkingUsernameUnique && (
            <div className={styles.spinner} role="status" />
          )}
        </label>

        {signUpValidation.username.errorMessage && (
          <ErrorText>{signUpValidation.username.errorMessage}</ErrorText>
        )}
        {usernameAvailability.isUnique === false &&
          signUpValidation.username.isValid && (
            <ErrorText>Username is already taken</ErrorText>
          )}
      </div>

      {/* Email Field */}
      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span
            className={`${styles.inputWrap} ${
              checkingEmailUnique && styles.withRightItem
            }`}
          >
            <span className={styles.labelText}>Email Address</span>
          </span>
          <input
            className={styles.input}
            autoComplete="email"
            type="email"
            name="email"
            placeholder="Email Address"
            value={signUpData.email}
            onChange={handleChange}
          />
          {checkingEmailUnique && (
            <div className={styles.spinner} role="status" />
          )}
        </label>

        {signUpValidation.email.errorMessage && (
          <ErrorText>{signUpValidation.email.errorMessage}</ErrorText>
        )}
        {emailAvailability.isUnique === false &&
          signUpValidation.email.isValid && (
            <ErrorText>Email already exists in an account</ErrorText>
          )}
      </div>

      {/* Password Field */}
      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span className={styles.labelText}>Password</span>
          <input
            className={styles.input}
            autoComplete="new-password"
            type="password"
            name="password"
            placeholder="Password"
            value={signUpData.password}
            onChange={handleChange}
          />
        </label>
        {signUpValidation.password.errorMessage && (
          <ErrorText>{signUpValidation.password.errorMessage}</ErrorText>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span className={styles.labelText}>Confirm Password</span>
          <input
            className={styles.input}
            autoComplete="new-password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signUpData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        {signUpValidation.confirmPassword.errorMessage && (
          <ErrorText>{signUpValidation.confirmPassword.errorMessage}</ErrorText>
        )}
      </div>

      {/* Submit Button */}
      <div className={styles.buttonWrapper}>
        <SpinnerButton disabled={loading} loading={loading}>
          Sign Up
        </SpinnerButton>
      </div>

      {/* Error Message */}
      {error && <ErrorText>{error}</ErrorText>}
    </form>
  );
};

export default SignUp;
