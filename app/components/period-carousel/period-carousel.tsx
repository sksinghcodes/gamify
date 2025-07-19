import type {
  MonthIndex,
  MonthValue,
  PriodCarouselValue,
  WeekValue,
  YearValue,
} from '~/types/task-types';
import styles from './period-carousel.module.css';
import { getDateUnitStr, getMaxWeeks } from '~/utils/date';
import { VIEW_BY_UNITS_MAP } from '~/constants';

interface PriodCarouselProps {
  value: PriodCarouselValue;
  onChange: (value: PriodCarouselValue) => void;
}

const PriodCarousel: React.FC<PriodCarouselProps> = ({ value, onChange }) => {
  const changeWeek = (week: number, year: number) => {
    onChange({ ...value, week, year } as WeekValue);
  };

  const changeMonth = (month: MonthIndex, year: number) => {
    onChange({ ...value, month, year } as MonthValue);
  };

  const changeYear = (year: number) => {
    onChange({ ...value, year } as YearValue);
  };

  const changeUnitValue = (increase: boolean) => {
    if (value.type === VIEW_BY_UNITS_MAP.WEEK) {
      let week = value.week;
      let year = value.year;

      if (increase) {
        if (week === getMaxWeeks(value.year)) {
          week = 1;
          year = year + 1;
        } else {
          week = week + 1;
        }
      } else {
        if (week === 1) {
          week = getMaxWeeks(value.year - 1);
          year = year - 1;
        } else {
          week = week - 1;
        }
      }

      changeWeek(week, year);
    } else if (value.type === VIEW_BY_UNITS_MAP.MONTH) {
      let month = value.month;
      let year = value.year;
      if (increase) {
        if (value.month === 11) {
          month = 0;
          year = year + 1;
        } else {
          month = month + 1;
        }
      } else {
        if (value.month === 0) {
          month = 11;
          year = year - 1;
        } else {
          month = month - 1;
        }
      }
      changeMonth(month as MonthIndex, year);
    } else if (value.type === VIEW_BY_UNITS_MAP.YEAR) {
      changeYear(increase ? value.year + 1 : value.year - 1);
    }
  };

  const onLeftClick = () => {
    changeUnitValue(false);
  };

  const onRightClick = () => {
    changeUnitValue(true);
  };

  return (
    <div className={styles.priodCarousel}>
      <button
        className={`${styles.nav} material-symbols-outlined`}
        onClick={onLeftClick}
      >
        chevron_left
      </button>
      <div className={styles.preview}>{getDateUnitStr(value)}</div>
      <button
        className={`${styles.nav} material-symbols-outlined`}
        onClick={onRightClick}
      >
        chevron_right
      </button>
    </div>
  );
};

export default PriodCarousel;
