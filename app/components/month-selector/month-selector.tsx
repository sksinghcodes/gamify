import React, { useEffect, useState } from 'react';
import { MONTHS } from '~/constants';
import styles from './month-selector.module.css';
import type { MonthIndex } from '~/types/task-types';

interface MonthSelectorProps {
  multiSelect?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: MonthIndex[];
  onChange: (value: MonthIndex[]) => void;
}

interface MonthSelectorModalProps {
  multiSelect: boolean;
  onDone: (value: MonthIndex[]) => void;
  value: MonthIndex[];
}

const MonthSelectorModal: React.FC<MonthSelectorModalProps> = ({
  multiSelect,
  onDone,
  value,
}) => {
  const [innerValue, setInnerValue] = useState<MonthIndex[]>([0]);

  useEffect(() => {
    setInnerValue(value);
  }, [value.toString()]);

  const handleMonthClick = (monthIndex: MonthIndex) => {
    if (multiSelect) {
      setInnerValue((prev) => {
        if (prev.includes(monthIndex)) {
          return prev.filter((m) => m !== monthIndex);
        } else {
          return [...prev, monthIndex].sort();
        }
      });
    } else {
      onDone([monthIndex]);
    }
  };

  return (
    <div className={`${styles.wrapper} ${multiSelect ? styles.multi : ''}`}>
      <div className={styles.monthList}>
        {MONTHS.map((month, i) => (
          <div
            key={month}
            className={`${styles.month} ${
              innerValue.includes(i as MonthIndex) ? styles.active : ''
            }`}
            onClick={() => handleMonthClick(i as MonthIndex)}
          >
            {month}
          </div>
        ))}
      </div>
      {multiSelect ? (
        <button
          className={`${styles.fab} material-symbols-outlined`}
          onClick={() => onDone(innerValue)}
          disabled={value.length === 0}
        >
          done
        </button>
      ) : null}
    </div>
  );
};

const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
  multiSelect,
}) => {
  return open ? (
    <MonthSelectorModal
      value={value}
      onDone={(month) => {
        onChange(month);
        setOpen(false);
      }}
      multiSelect={Boolean(multiSelect)}
    />
  ) : null;
};
export default MonthSelector;
