import type {
  DurationEnum,
  RemoveAfterGivenDuration,
} from '~/types/task-types';
import styles from './duration-selector.module.css';
import { useEffect, useState } from 'react';
import { DURATION_UNIT } from '~/constants';
import { capitalize } from '~/utils/string';
import { getDurationString } from '~/utils/date';

interface DurationSelectorProps {
  value: RemoveAfterGivenDuration;
  onChange: (value: RemoveAfterGivenDuration) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface DurationSelectorModalProps {
  value: RemoveAfterGivenDuration;
  onDone: (value: RemoveAfterGivenDuration) => void;
}

const DurationSelectorModal: React.FC<DurationSelectorModalProps> = ({
  value,
  onDone,
}) => {
  const [innerNValue, setInnerNValue] = useState(0);
  const [innerUnit, setInnerUnit] = useState<DurationEnum>(DURATION_UNIT.DAY);

  useEffect(() => {
    setInnerNValue(value.nValue);
    setInnerUnit(value.unit);
  }, [value.nValue, value.unit]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.preview}>
          {getDurationString({
            ...value,
            nValue: innerNValue,
            unit: innerUnit,
          })}
        </div>
        <div className={styles.numWrap}>
          <button
            className={`${styles.changeBtn} material-symbols-outlined`}
            onClick={() => setInnerNValue(innerNValue - 1)}
          >
            remove
          </button>
          <input
            className={styles.numInput}
            value={innerNValue}
            onChange={(e) => setInnerNValue(Number(e.target.value))}
          />
          <button
            className={`${styles.changeBtn} material-symbols-outlined`}
            onClick={() => setInnerNValue(innerNValue + 1)}
          >
            add
          </button>
        </div>
        <div className={styles.unitsWrap}>
          {Object.keys(DURATION_UNIT).map((unit) => (
            <label
              className={`${styles.option} ${
                unit === innerUnit ? styles.active : ''
              }`}
              key={unit}
            >
              <input
                type="radio"
                value={unit}
                className={styles.inputCheck}
                checked={innerUnit === unit}
                onChange={() => setInnerUnit(unit as DurationEnum)}
              />
              <span>{`${capitalize(unit)}${
                innerNValue === 1 ? '' : 's'
              }`}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        className={`${styles.fab} material-symbols-outlined`}
        onClick={() =>
          onDone({
            ...value,
            nValue: innerNValue,
            unit: innerUnit,
          })
        }
      >
        done
      </button>
    </div>
  );
};

const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,
  onChange,
  open,
  setOpen,
}) => {
  return open ? (
    <DurationSelectorModal
      value={value}
      onDone={(value) => {
        onChange(value);
        setOpen(false);
      }}
    />
  ) : null;
};

export default DurationSelector;
