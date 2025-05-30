import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import api from '../../../api';
import ErrorText from '../../../components/error-text/error-text';
import SpinnerButton from '../../../components/spinner-button/spinner-button';
import SuccessText from '../../../components/success-text/success-text';
import styles from '../auth.module.css';
import { API_ENDPOINTS, ROUTES } from '../../../constants';

const {
  SIGN_IN: { path: SIGN_IN },
  TASK_LIST: { path: TASK_LIST },
} = ROUTES;

export function meta() {
  return [{ title: 'Verify Profile' }];
}

const VerifyProfile = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const location = useLocation();

  if (!location.state) {
    return <Navigate to={TASK_LIST} replace />;
  }

  function validate(code: string) {
    if (code.length === 6) {
      return true;
    } else {
      setError('Verification code must contain six digits');
      return false;
    }
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!validate(code)) {
      return false;
    }

    setLoading(true);
    api
      .post(API_ENDPOINTS.VERIFY_PROFILE, {
        verificationId: location.state,
        code: code,
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.success) {
          setSuccess(true);
          setError('');
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.inputWrap}>
          <span className={styles.labelText}>
            A six digit code has been sent to you on your email address. Please
            enter it here to confirm your profile
          </span>
          <input
            className={styles.input}
            type="text"
            name="usernameOrEmail"
            placeholder="XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            autoComplete="username"
          />
        </label>
      </div>
      <div className="text-center">
        <SpinnerButton disabled={loading} loading={loading}>
          Verify
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
            Your profile has has been verified. Now click on{' '}
            <Link to={SIGN_IN}>Sign In</Link>
          </SuccessText>
        </>
      )}
    </form>
  );
};

export default VerifyProfile;
