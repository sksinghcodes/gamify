import type {
  InvalidDateStrategy,
  MonthAndDates,
  MonthIndex,
  RecurrenceYearly,
} from '~/types/task-types';
import styles from './yearly-date-selector.module.css';
import { useEffect, useMemo, useState } from 'react';
import {
  DATES,
  INVALID_DATE_STRATEGY,
  MONTHS,
  MONTHS_3_LETTER,
} from '~/constants';
import InvalidDateStrategySelector from '../invalid-date-strategy-selector/invalid-date-strategy-selector';
import Modal from '../modal/modal';
import StrategyInfo from '../stratefy-info/stratefy-info';
import MonthSelector from '../month-selector/month-selector';

interface YearlyDateSelectorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: RecurrenceYearly;
  onChange: (recurrence: RecurrenceYearly) => void;
}

interface YearlyDateSelectorModalProps {
  value: RecurrenceYearly;
  onDone: (recurrence: RecurrenceYearly) => void;
}

const YearlyDateSelectorModal: React.FC<YearlyDateSelectorModalProps> = ({
  value,
  onDone,
}) => {
  const [innerMonthAndDates, setInnerMonthAndDates] = useState<MonthAndDates>(
    {}
  );
  const [selectedMonth, setSelectedMonth] = useState<MonthIndex>(0);
  const [showMonthSelector, setShowMonthSelector] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [innerFeb29Strategy, setInnerFeb29Strategy] =
    useState<InvalidDateStrategy>(INVALID_DATE_STRATEGY.NONE);

  useEffect(() => {
    setInnerMonthAndDates(value.monthAndDates);
    setInnerFeb29Strategy(value.feb29Strategy);
  }, [value.monthAndDates, value.feb29Strategy]);

  const handleDateSelection: (month: MonthIndex, date: number) => void = (
    month,
    date
  ) => {
    const dates = innerMonthAndDates[month] || [];
    if (dates.includes(date)) {
      const newDates = dates.filter((d) => d !== date);
      const newInnerMonthAndDates = { ...innerMonthAndDates };
      if (newDates.length) {
        newInnerMonthAndDates[month] = newDates;
      } else {
        delete newInnerMonthAndDates[month];
      }

      if (!Boolean(newInnerMonthAndDates[1]?.includes(29))) {
        setInnerFeb29Strategy(INVALID_DATE_STRATEGY.NONE);
      }

      setInnerMonthAndDates(newInnerMonthAndDates);
    } else {
      setInnerMonthAndDates({
        ...innerMonthAndDates,
        [month]: [...dates, date].sort((a, b) => a - b),
      });
    }
  };

  const dates = useMemo(() => {
    if (selectedMonth === 1) {
      return DATES.slice(0, 29);
    } else if ([3, 5, 8, 10].includes(selectedMonth)) {
      return DATES.slice(0, 30);
    } else {
      return DATES;
    }
  }, [selectedMonth]);

  const showQuestion = Boolean(innerMonthAndDates[1]?.includes(29));

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectionWrap}>
        <div
          className={styles.monthSelect}
          onClick={() => setShowMonthSelector(true)}
        >
          <div className={styles.monthText}>{MONTHS[selectedMonth]}</div>
          <div className="material-symbols-outlined">expand_all</div>
        </div>
        <div className={styles.datesWrap}>
          {dates.map((date) => (
            <button
              key={date}
              className={`${styles.date} ${
                innerMonthAndDates[selectedMonth]?.includes(date)
                  ? styles.active
                  : ''
              }`}
              onClick={() => {
                handleDateSelection(selectedMonth, date);
              }}
            >
              {date}
            </button>
          ))}
        </div>
        <div
          className={`${styles.datesPreviewWrap} ${
            Object.keys(innerMonthAndDates).length ? '' : styles.hide
          }`}
        >
          {Object.keys(innerMonthAndDates).map((month, i) => (
            <div key={i} className={styles.datesPreview}>
              <div className={styles.datePreview}>
                {MONTHS_3_LETTER[Number(month)]}
              </div>
              {(innerMonthAndDates[Number(month) as MonthIndex] ?? []).map(
                (date) => (
                  <div key={date} className={styles.datePreview}>
                    {date}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
        <InvalidDateStrategySelector
          value={innerFeb29Strategy}
          onChange={setInnerFeb29Strategy}
          show={showQuestion}
          onInfoIconClick={() => setShowModal(true)}
        />
      </div>

      <Modal
        title="Missing date strategy"
        open={showModal}
        onClose={() => setShowModal(false)}
        body={<StrategyInfo for29thFebOnly={true} />}
      />
      <button
        className={`${styles.fab} material-symbols-outlined`}
        onClick={() =>
          onDone({
            ...value,
            monthAndDates: innerMonthAndDates,
            feb29Strategy: innerFeb29Strategy,
          })
        }
        disabled={
          Object.keys(innerMonthAndDates).length === 0 ||
          (showQuestion && innerFeb29Strategy === INVALID_DATE_STRATEGY.NONE)
        }
      >
        done
      </button>
      <MonthSelector
        open={showMonthSelector}
        setOpen={setShowMonthSelector}
        value={[selectedMonth]}
        onChange={(e) => setSelectedMonth(e[0])}
      />
    </div>
  );
};

const YearlyDateSelector: React.FC<YearlyDateSelectorProps> = ({
  open,
  setOpen,
  value,
  onChange,
}) => {
  return open ? (
    <YearlyDateSelectorModal
      value={value}
      onDone={(recurrence) => {
        onChange(recurrence);
        setOpen(false);
      }}
    />
  ) : null;
};

export default YearlyDateSelector;
