import React from 'react';
import styles from './spinner-button.module.css';

const SpinnerButton: React.FC<{
  disabled: boolean;
  loading: boolean;
  children: React.ReactNode;
}> = ({ disabled, loading, children }) => {
  return (
    <button disabled={disabled} className={styles.button}>
      {children}
      {loading && (
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner} role="status" />
        </div>
      )}
    </button>
  );
};

export default SpinnerButton;
