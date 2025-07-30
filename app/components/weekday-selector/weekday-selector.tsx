import { useEffect, useState } from 'react';
import styles from './weekday-selector.module.css';
import { WEEKS } from '~/constants';

interface WeekdaySelectorProps {
  value: number[];
  onChange: (days: number[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface WeekdaySelectorModalProps {
  days: number[];
  onDone: (days: number[]) => void;
}

const WeekdaySelectorModal: React.FC<WeekdaySelectorModalProps> = ({
  days,
  onDone,
}) => {
  const [innerDays, setInnerDays] = useState<number[]>([]);

  useEffect(() => {
    setInnerDays(days);
  }, [days]);

  const handleDaySelect = (day: number) => {
    setInnerDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort((a, b) => a - b);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.weekdaysWrap}>
        {WEEKS.map((wd, i) => (
          <button
            key={wd}
            className={`${styles.weekday} ${
              innerDays.includes(i) ? styles.active : ''
            }`}
            onClick={() => handleDaySelect(i)}
          >
            {wd}
          </button>
        ))}
      </div>
      <button
        className={`${styles.fab} material-symbols-outlined`}
        onClick={() => onDone(innerDays)}
        disabled={innerDays.length === 0}
      >
        done
      </button>
    </div>
  );
};

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
}) => {
  return open ? (
    <WeekdaySelectorModal
      days={value}
      onDone={(days: number[]) => {
        onChange(days);
        setOpen(false);
      }}
    />
  ) : null;
};

export default WeekdaySelector;
