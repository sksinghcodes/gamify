import styles from './modal.module.css';

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalBodyProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ title, onClose, children }) => {
  return (
    <div className={styles.modalWrap}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button
          className={`${styles.close} material-symbols-outlined`}
          onClick={onClose}
        >
          close
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  return open ? (
    <ModalBody title={title} onClose={onClose}>
      {children}
    </ModalBody>
  ) : null;
};

export default Modal;
