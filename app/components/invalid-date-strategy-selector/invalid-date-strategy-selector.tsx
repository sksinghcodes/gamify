import type { InvalidDateStrategy } from '~/types/task-types';
import styles from './invalid-date-strategy-selector.module.css';
import {
  INVALID_DATE_STRATEGY,
  INVALID_DATE_STRATEGY_LABELS,
} from '~/constants';

interface InvalidDateStrategySelectorProps {
  show: boolean;
  value: InvalidDateStrategy;
  onChange: (invalidDateStrategy: InvalidDateStrategy) => void;
  onInfoIconClick: () => void;
}

const InvalidDateStrategySelector: React.FC<
  InvalidDateStrategySelectorProps
> = ({ show, onInfoIconClick, value, onChange }) => {
  return (
    <div className={show ? '' : styles.hide}>
      <div>
        <span>Select missing date strategy</span>
        <span
          onClick={onInfoIconClick}
          className={`${styles.infoIcon} material-symbols-outlined`}
        >
          info
        </span>
      </div>
      <div className={styles.optionWrap}>
        <div
          className={`${styles.option} ${
            value === INVALID_DATE_STRATEGY.SKIP ? styles.active : ''
          }`}
          onClick={() => onChange(INVALID_DATE_STRATEGY.SKIP)}
        >
          {INVALID_DATE_STRATEGY_LABELS[INVALID_DATE_STRATEGY.SKIP]}
        </div>
      </div>
      <div className={styles.optionWrap}>
        <div
          className={`${styles.option} ${
            value === INVALID_DATE_STRATEGY.LAST_VALID ? styles.active : ''
          }`}
          onClick={() => onChange(INVALID_DATE_STRATEGY.LAST_VALID)}
        >
          {INVALID_DATE_STRATEGY_LABELS[INVALID_DATE_STRATEGY.LAST_VALID]}
        </div>
      </div>
    </div>
  );
};

export default InvalidDateStrategySelector;
