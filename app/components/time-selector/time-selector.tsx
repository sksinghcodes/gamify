import { HOURS, MINUTES } from '~/constants';
import styles from './time-selector.module.css';
import {
  composeTime,
  destructureTime,
  getMinuteBlock,
  getNextFive,
  to12HourFormat,
} from '~/utils/date';
import { useEffect, useState } from 'react';

export type TimeSelectorOnChange = (e: { name: string; value: string }) => void;

interface TimeSelectorProps {
  timeDisplayProps?: React.HTMLAttributes<HTMLDivElement>;
  value: string;
  onChange: TimeSelectorOnChange;
  name: string;
}

interface TimeSelectorModalProps {
  value: string;
  onDone: (hour24Format: string) => void;
}

const TimeSelectorModal: React.FC<TimeSelectorModalProps> = ({
  value,
  onDone,
}) => {
  const [internalTime, setInternalTime] = useState({
    hour: '',
    minute: '',
    period: '',
  });

  useEffect(() => {
    setInternalTime(destructureTime(value));
  }, [value]);

  const { hour, minute, period } = internalTime;
  const hour24Format = composeTime(internalTime);
  const hour12Format = to12HourFormat(hour24Format);
  const minuteBlock = getMinuteBlock(minute);
  const specificMinutes = getNextFive(minuteBlock);

  const handleChange: (key: string, value: string) => void = (key, value) => {
    setInternalTime((prev) => {
      let { hour = '', minute = '', period = '' } = prev;

      if (key === 'hour') hour = value;
      if (key === 'minute') minute = value;
      if (key === 'period') period = value;

      if (!hour) hour = '12';
      if (!minute) minute = '00';
      if (!period) period = 'AM';

      return { hour, minute, period };
    });
  };

  return (
    <div className={styles.timeSelectWrap}>
      <div className={styles.timeSelect}>
        <div className={styles.timePreview}>{hour12Format}</div>
        <div>
          <span className={styles.label}>Select Hour</span>
          <div className={styles.hourSelect}>
            {HOURS.map((h) => (
              <button
                className={hour === h ? styles.active : ''}
                key={h}
                onClick={() => handleChange('hour', h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className={styles.label}>Select Minute</span>
          <div className={styles.minuteSelect}>
            {MINUTES.map((m) => (
              <button
                className={minuteBlock === m ? styles.active : ''}
                key={m}
                onClick={() => handleChange('minute', m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.specificMinuteWrap}>
          {specificMinutes.length ? (
            <div
              className={`${styles.minuteSelect} ${styles.specificMinuteSelect}`}
            >
              {specificMinutes.map((m) => (
                <button
                  key={m}
                  onClick={() => handleChange('minute', m)}
                  className={minute === m ? styles.active : ''}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.ampmSelect}>
          <button
            className={period === 'AM' ? styles.active : ''}
            onClick={() => handleChange('period', 'AM')}
          >
            AM
          </button>
          <button
            className={period === 'PM' ? styles.active : ''}
            onClick={() => handleChange('period', 'PM')}
          >
            PM
          </button>
        </div>

        <button
          className={`${styles.fab} material-symbols-outlined`}
          onClick={() => onDone(hour24Format)}
          disabled={hour === '' && minute === '' && period == ''}
        >
          done
        </button>
      </div>
    </div>
  );
};

const TimeSelector: React.FC<TimeSelectorProps> = ({
  timeDisplayProps,
  value,
  onChange,
  name,
}) => {
  const [showModal, setShowModal] = useState(false);
  const hour12Format = to12HourFormat(value);

  const handleDone = (hour24Format: string) => {
    setShowModal(false);
    onChange({ name, value: hour24Format });
  };

  return (
    <>
      <div
        {...timeDisplayProps}
        className={`${styles.timeDisplay} ${
          hour12Format === '00:00 AM' ? styles.placeholder : ''
        } ${timeDisplayProps?.className || ''}`}
        onClick={(e) => {
          setShowModal(!showModal);
          if (timeDisplayProps?.onClick) {
            timeDisplayProps.onClick(e);
          }
        }}
      >
        {hour12Format}
      </div>
      {showModal && <TimeSelectorModal value={value} onDone={handleDone} />}
    </>
  );
};

export default TimeSelector;
