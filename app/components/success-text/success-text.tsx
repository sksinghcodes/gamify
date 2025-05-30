import styles from './success-text.module.css';

const SuccessText: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={styles.successText}>{children}</div>;
};

export default SuccessText;
