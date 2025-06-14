import styles from './modal.module.css';

interface ModalProps {
  title: string;
  open: boolean;
  body: React.ReactNode;
  onClose: () => void;
}

interface ModalBodyProps {
  title: string;
  body: React.ReactNode;
  onClose: () => void;
}

const ModalBody: React.FC<ModalBodyProps> = ({ title, onClose, body }) => {
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
      <div className={styles.body}>{body}</div>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ title, open, onClose, body }) => {
  return open ? (
    <ModalBody title={title} onClose={onClose} body={body} />
  ) : null;
};

export default Modal;
