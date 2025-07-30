import { DATES, INVALID_DATE_STRATEGY } from '~/constants';
import styles from './monthly-dates-selector.module.css';
import { useEffect, useState } from 'react';
import {
  type InvalidDateStrategy,
  type RecurrenceMonthly,
} from '~/types/task-types';
import Modal from '~/components/modal/modal';
import InvalidDateStrategySelector from '../invalid-date-strategy-selector/invalid-date-strategy-selector';
import StrategyInfo from '../stratefy-info/stratefy-info';

interface MonthlyDatesSelectorProps {
  value: RecurrenceMonthly;
  onChange: (recurrence: RecurrenceMonthly) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface MonthlyDatesSelectorModalProps {
  value: RecurrenceMonthly;
  onDone: (recurrence: RecurrenceMonthly) => void;
}

const MonthlyDatesSelectorModal: React.FC<MonthlyDatesSelectorModalProps> = ({
  value,
  onDone,
}) => {
  const [innerDates, setInnerDates] = useState<number[]>([]);
  const [innerInvalidDateStrategy, setInnerInvalidDateStrategy] =
    useState<InvalidDateStrategy>(INVALID_DATE_STRATEGY.NONE);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setInnerDates(value.dates);
    setInnerInvalidDateStrategy(value.invalidDateStrategy);
  }, [value.dates, value.invalidDateStrategy]);

  const handleDateToggle = (date: number) => {
    let newDates = [];
    if (innerDates.includes(date)) {
      newDates = innerDates.filter((d) => d !== date);
    } else {
      newDates = [...innerDates, date].sort((a, b) => a - b);
    }

    if (
      !(newDates.includes(29) || newDates.includes(30) || newDates.includes(31))
    ) {
      setInnerInvalidDateStrategy(INVALID_DATE_STRATEGY.NONE);
    }

    setInnerDates(newDates);
  };

  const showQuestion =
    innerDates.includes(29) ||
    innerDates.includes(30) ||
    innerDates.includes(31);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.dateAndTitle}>
          <div className={styles.title}>Select Dates</div>
          <div className={styles.datesWrap}>
            {DATES.map((date) => (
              <button
                key={date}
                onClick={() => handleDateToggle(date)}
                className={`${styles.date} ${
                  innerDates.includes(date) ? styles.active : ''
                }`}
              >
                {date}
              </button>
            ))}
          </div>
          <InvalidDateStrategySelector
            show={showQuestion}
            value={innerInvalidDateStrategy}
            onChange={setInnerInvalidDateStrategy}
            onInfoIconClick={() => setShowModal(true)}
          />
        </div>
        <button
          className={`${styles.fab} material-symbols-outlined`}
          onClick={() =>
            onDone({
              ...value,
              dates: innerDates,
              invalidDateStrategy: innerInvalidDateStrategy,
            })
          }
          disabled={
            innerDates.length === 0 ||
            (showQuestion &&
              innerInvalidDateStrategy === INVALID_DATE_STRATEGY.NONE)
          }
        >
          done
        </button>
        <Modal
          title="Missing date strategy"
          open={showModal}
          onClose={() => setShowModal(false)}
          body={<StrategyInfo for29thFebOnly={false} />}
        />
      </div>
    </>
  );
};

const MonthlyDatesSelector: React.FC<MonthlyDatesSelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
}) => {
  return open ? (
    <MonthlyDatesSelectorModal
      value={value}
      onDone={(value) => {
        onChange(value);
        setOpen(false);
      }}
    />
  ) : null;
};

export default MonthlyDatesSelector;
