import styles from './error-text.module.css';

const ErrorText: React.FC<{ children: string }> = ({ children }) => {
  return <div className={styles.errorText}>{children}</div>;
};

export default ErrorText;
