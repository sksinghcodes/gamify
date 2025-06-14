import { DATES, INVALID_DATE_STRATEGY } from '~/constants';
import styles from './monthly-dates-selector.module.css';
import { useEffect, useState } from 'react';
import {
  type InvalidDateStrategy,
  type RecurrenceMonthly,
} from '~/types/task-types';
import Modal from '../modal/modal';

interface MonthlyDatesSelectorProps {
  value: RecurrenceMonthly;
  onChange: (reccurrence: RecurrenceMonthly) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface MonthlyDatesSelectorModalProps {
  value: RecurrenceMonthly;
  onDone: (reccurrence: RecurrenceMonthly) => void;
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
    setInnerDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date].sort((a, b) => a - b)
    );
  };

  const showQuestion =
    innerDates.includes(29) ||
    innerDates.includes(30) ||
    innerDates.includes(31);

  useEffect(() => {
    if (!showQuestion) {
      setInnerInvalidDateStrategy(INVALID_DATE_STRATEGY.NONE);
    }
  }, [showQuestion]);

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
          <div className={showQuestion ? '' : styles.hide}>
            <div>
              <span>Select missing date strategy</span>
              <span
                onClick={() => setShowModal(true)}
                className={`${styles.infoIcon} material-symbols-outlined`}
              >
                info
              </span>
            </div>
            <div className={styles.optionWrap}>
              <div
                className={`${styles.option} ${
                  innerInvalidDateStrategy === INVALID_DATE_STRATEGY.SKIP
                    ? styles.active
                    : ''
                }`}
                onClick={() =>
                  setInnerInvalidDateStrategy(INVALID_DATE_STRATEGY.SKIP)
                }
              >
                Skip month
              </div>
            </div>
            <div className={styles.optionWrap}>
              <div
                className={`${styles.option} ${
                  innerInvalidDateStrategy === INVALID_DATE_STRATEGY.LAST_VALID
                    ? styles.active
                    : ''
                }`}
                onClick={() =>
                  setInnerInvalidDateStrategy(INVALID_DATE_STRATEGY.LAST_VALID)
                }
              >
                Move to last date
              </div>
            </div>
          </div>
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
        >
          done
        </button>
        <Modal
          title="Missing date strategy"
          open={showModal}
          onClose={() => setShowModal(false)}
          body={
            <div className={styles.container}>
              <section className={styles.section}>
                <h3 className={styles.subheading}>Why this matters</h3>
                <p className={styles.paragraph}>
                  Not all months have every date:
                </p>
                <ul className={styles.list}>
                  <li>
                    February has only 28 days in non-leap years and 29 days in
                    leap years.
                  </li>
                  <li>
                    April, June, September, and November have only 30 days.
                  </li>
                </ul>
              </section>

              <section className={styles.section}>
                <h3 className={styles.subheading}>What are your options?</h3>
                <div className={styles.optionDes}>
                  <strong>Skip the month</strong>
                  <p className={styles.optionDescription}>
                    The event will not occur in months that don't include the
                    selected date.
                  </p>
                </div>
                <div className={styles.optionDes}>
                  <strong>Move to last valid date</strong>
                  <p className={styles.optionDescription}>
                    The event automatically shifts to the closest valid date
                    that month (e.g. 30 → 28 in February).
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.subheading}>Example</h3>
                <p className={styles.paragraph}>
                  If you select <strong>30</strong> and the current month is{' '}
                  <strong>February</strong>:
                </p>
                <ul className={styles.list}>
                  <li>
                    <strong>Skip the month:</strong> The event will not occur in
                    February.
                  </li>
                  <li>
                    <strong>Move to last valid date:</strong> The event will
                    happen on February 28 (or 29 in a leap year).
                  </li>
                </ul>
              </section>
            </div>
          }
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
