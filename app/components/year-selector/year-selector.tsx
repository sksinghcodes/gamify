import { useMemo, useState } from 'react';
import styles from './year-selector.module.css';
import { getBlockOf18 } from '~/utils/date';

interface YearSelectorProps {
  value: number;
  onChange: (value: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface YearSelectorModalProps {
  value: number;
  onChange: (value: number) => void;
}

const YearSelectorModal: React.FC<YearSelectorModalProps> = ({
  value,
  onChange,
}) => {
  const [blockStart, setBlockStart] = useState(
    getBlockOf18(new Date().getFullYear()).blockStart
  );

  const yearsBlock = useMemo(() => {
    return getBlockOf18(blockStart).block;
  }, [blockStart]);

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.nav} material-symbols-outlined`}
        onClick={() => setBlockStart(blockStart - 18)}
      >
        chevron_left
      </button>
      <div className={styles.yearsWrap}>
        {yearsBlock.map((y) => (
          <div
            key={y}
            className={`${styles.year} ${value === y ? styles.active : ''}`}
            onClick={() => onChange(y)}
          >
            {y}
          </div>
        ))}
      </div>
      <button
        className={`${styles.nav} material-symbols-outlined`}
        onClick={() => setBlockStart(blockStart + 18)}
      >
        chevron_right
      </button>
    </div>
  );
};

const YearSelector: React.FC<YearSelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
}) => {
  return open ? (
    <YearSelectorModal
      value={value}
      onChange={(value) => {
        onChange(value);
        setOpen(false);
      }}
    />
  ) : null;
};

export default YearSelector;
