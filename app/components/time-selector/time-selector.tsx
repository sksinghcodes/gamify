import { HOURS, MINUTES } from '~/constants';
import styles from './time-selector.module.css';
import {
  composeTime,
  destructureTime,
  getMinuteBlock,
  getNextFive,
  to12HourFormat,
} from '~/utils/date-utils';
import { useEffect, useState } from 'react';
import type { CustomChangeEvent } from '../form-elements/option-group';
import InputText from '../form-elements/input-text';
import OptionGroup from '../form-elements/option-group';
import {
  HOURS_OPTIONS,
  MINUTES_OPTIONS,
  PERIOD_OPTIONS,
} from '~/constants/options';
import { make24HourTimeStrFromNumber } from '~/utils/time-utils';
import Fab from '~/fab/fab';

export type TimeSelectorOnChange = (e: { name: string; value: string }) => void;

interface TimeSelectorProps {
  value: number | null;
  onChange: (e: CustomChangeEvent) => void;
  name: string;
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
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

  const hour12Format = to12HourFormat(
    hour24Format ? Number(hour24Format.replace(':', '')) : null
  );
  const minuteBlock = getMinuteBlock(minute);
  const specificMinutes = getNextFive(minuteBlock);

  const handleChange: (e: CustomChangeEvent) => void = (e) => {
    const { name, value } = e.target;

    setInternalTime((prev) => {
      let { hour = '', minute = '', period = '' } = prev;

      if (name === 'hour') hour = value;
      if (name === 'minute') minute = value;
      if (name === 'period') period = value;

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

        <OptionGroup
          label="Select Hour"
          name="hour"
          value={hour}
          options={HOURS_OPTIONS}
          onChange={handleChange}
          inputLabelProps={{ className: styles.hourMinute }}
        />
        <OptionGroup
          label="Select Minute"
          name="minute"
          value={minuteBlock}
          options={MINUTES_OPTIONS}
          onChange={handleChange}
          inputLabelProps={{ className: styles.hourMinute }}
        />
        <div className={styles.specificMinuteWrap}>
          {specificMinutes.length ? (
            <OptionGroup
              name="minute"
              value={minute}
              options={specificMinutes.map((m) => ({
                id: m,
                label: String(m),
              }))}
              onChange={handleChange}
              inputLabelProps={{ className: styles.minute }}
            />
          ) : null}
        </div>
        <OptionGroup
          name="period"
          value={period}
          options={PERIOD_OPTIONS}
          onChange={handleChange}
          inputLabelProps={{ className: styles.ampm }}
        />

        <Fab
          onClick={() => onDone(hour24Format)}
          disabled={hour === '' && minute === '' && period == ''}
        >
          done
        </Fab>
      </div>
    </div>
  );
};

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  name,
  label,
  error,
  required,
}) => {
  const [showModal, setShowModal] = useState(false);
  const hour12Format = to12HourFormat(value);
  const stringTime = make24HourTimeStrFromNumber(value);

  const handleDone = (hour24Format: string) => {
    setShowModal(false);
    onChange({
      target: { name, value: Number(hour24Format.replace(':', '')) },
    });
  };

  return (
    <div>
      <InputText
        type="text"
        placeholder="00:00 AM"
        readOnly={true}
        value={hour12Format}
        onClick={() => {
          setShowModal(!showModal);
        }}
        label={label}
        error={error}
        required={required}
      />
      {showModal && (
        <TimeSelectorModal value={stringTime} onDone={handleDone} />
      )}
    </div>
  );
};

export default TimeSelector;
