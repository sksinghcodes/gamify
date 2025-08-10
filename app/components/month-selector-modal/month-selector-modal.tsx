import React, { useEffect, useState } from 'react';
import styles from './month-selector-modal.module.css';
import type { MonthIndex } from '~/types/task-types';
import type { CustomChangeEvent } from '../form-elements/option-group';
import OptionGroup from '../form-elements/option-group';
import { MONTH_OPTIONS } from '~/constants/options';
import Fab from '~/fab/fab';

interface CommonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
}

interface MonthSelectorSingleProps extends CommonProps {
  value: MonthIndex | null;
  onChange: (e: CustomChangeEvent<MonthIndex>) => void;
  allowMulti?: false;
}

interface MonthSelectorMultiProps extends CommonProps {
  value: MonthIndex[] | null;
  onChange: (e: CustomChangeEvent<MonthIndex[]>) => void;
  allowMulti: true;
}

const MonthSelectorModalInner: React.FC<
  MonthSelectorSingleProps | MonthSelectorMultiProps
> = ({ allowMulti, value, name, setOpen, onChange }) => {
  const [innerValue, setInnerValue] = useState<number | number[] | null>(null);

  useEffect(() => {
    setInnerValue(value);
  }, [Array.isArray(value) ? value.toString() : value]);

  const props = {
    name: name,
    options: MONTH_OPTIONS,
    inputLabelProps: {
      className: styles.inputLabel,
    },
  };

  const doneChange = (value: MonthIndex | MonthIndex[]) => {
    setOpen(false);
    const event = {
      target: {
        name: name,
        value: value,
      },
    };
    if (allowMulti) {
      onChange(event as CustomChangeEvent<MonthIndex[]>);
    } else {
      onChange(event as CustomChangeEvent<MonthIndex>);
    }
  };

  return (
    <div className={styles.wrapper}>
      {innerValue === null || Array.isArray(innerValue) ? (
        allowMulti && (
          <OptionGroup
            {...props}
            value={innerValue}
            allowMulti={allowMulti}
            onChange={(e) => doneChange(e.target.value as MonthIndex[])}
          />
        )
      ) : (
        <OptionGroup
          {...props}
          value={innerValue}
          onChange={(e) => doneChange(Number(e.target.value) as MonthIndex)}
        />
      )}
      {allowMulti ? (
        <Fab
          onClick={() => {
            doneChange(innerValue as MonthIndex[]);
          }}
          disabled={
            innerValue === null ||
            (Array.isArray(innerValue) && innerValue.length === 0)
          }
        >
          done
        </Fab>
      ) : null}
    </div>
  );
};

const MonthSelectorModal: React.FC<
  MonthSelectorSingleProps | MonthSelectorMultiProps
> = (props) => {
  return props.open ? <MonthSelectorModalInner {...props} /> : null;
};
export default MonthSelectorModal;
