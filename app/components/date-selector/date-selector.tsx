import React, { useEffect, useMemo, useState } from 'react';
import styles from './date-selector.module.css';
import { MONTHS, WEEKS_1_LETTER } from '~/constants';
import MonthSelectorModal from '../month-selector-modal/month-selector-modal';
import type { MonthIndex } from '~/types/task-types';
import YearSelector from '../year-selector/year-selector';
import Fab from '~/fab/fab';

interface DateSelectorModalProps {
  value: number | null;
  onDone: (value: number | null) => void;
}
interface DateSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const extractDateComponents = (epoch: number | null) => {
  if (epoch === null) {
    return {
      date: null,
      month: null,
      year: null,
    };
  } else {
    const date = new Date(epoch);
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }
};

const DateSelectorModal: React.FC<DateSelectorModalProps> = ({
  value,
  onDone,
}) => {
  const [innerValue, setInnerValue] = useState<number | null>(0);
  const { date, month, year } = extractDateComponents(innerValue);
  const [selectedMonth, setSelectedMonth] = useState<MonthIndex>(0);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    setInnerValue(value);
    if (value !== null) {
      setSelectedMonth(new Date(value).getMonth() as MonthIndex);
      setSelectedYear(new Date(value).getFullYear());
    } else {
      const date = new Date();
      setSelectedMonth(date.getMonth() as MonthIndex);
      setSelectedYear(date.getFullYear());
    }
  }, [value]);

  const monthDates = useMemo(() => {
    const firstDate = 1;
    const date = new Date(selectedYear, selectedMonth, firstDate);
    const firstDay = date.getDay();
    date.setMonth(date.getMonth() + 1, 0);
    const lastDate = date.getDate();

    const dates: string[][] = [];

    let i = firstDate - firstDay;
    while (i <= lastDate) {
      const week: string[] = [];
      while (week.length < 7 && i <= lastDate) {
        week.push(i < 1 ? '' : String(i));
        i++;
      }
      dates.push(week);
    }

    return dates;
  }, [selectedMonth, selectedYear]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.navWrap}>
          <button
            className={`${styles.nav} material-symbols-outlined`}
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth((selectedMonth - 1) as MonthIndex);
              }
            }}
          >
            chevron_left
          </button>
          <div className={styles.calendarHeader}>
            <div
              className={styles.year}
              onClick={() => setShowYearSelector(true)}
            >
              {selectedYear}
            </div>
            <div
              className={styles.month}
              onClick={() => setShowMonthSelector(true)}
            >
              {MONTHS[selectedMonth]}
            </div>
          </div>
          <button
            className={`${styles.nav} material-symbols-outlined`}
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth((selectedMonth + 1) as MonthIndex);
              }
            }}
          >
            chevron_right
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.calendarTable}>
            <thead>
              <tr>
                {WEEKS_1_LETTER.map((weekDay, i) => (
                  <th key={i} className={styles.weekday}>
                    {weekDay}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthDates.map((weekDates) => (
                <tr key={weekDates.toString()}>
                  {weekDates.map((d, i) => (
                    <td
                      key={i}
                      className={`${styles.date} ${
                        Number(d) === date &&
                        selectedMonth === month &&
                        selectedYear === year
                          ? styles.active
                          : ''
                      }`}
                      onClick={() =>
                        setInnerValue(
                          new Date(
                            selectedYear,
                            selectedMonth,
                            Number(d)
                          ).getTime()
                        )
                      }
                    >
                      {d}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Fab onClick={() => onDone(innerValue)} disabled={innerValue === null}>
        done
      </Fab>
      <MonthSelectorModal
        name="selectedMonth"
        open={showMonthSelector}
        setOpen={setShowMonthSelector}
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />
      <YearSelector
        open={showYearSelector}
        setOpen={setShowYearSelector}
        value={selectedYear}
        onChange={(e) => setSelectedYear(e)}
      />
    </div>
  );
};

const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
}) => {
  return open ? (
    <DateSelectorModal
      value={value}
      onDone={(value) => {
        onChange(value);
        setOpen(false);
      }}
    />
  ) : null;
};

export default DateSelector;
