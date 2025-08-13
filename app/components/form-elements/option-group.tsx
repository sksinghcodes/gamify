import React from 'react';
import styles from './form-elements.module.css';
import { classes } from '~/utils/string';
import ErrorText from '../error-text/error-text';
import Label from './label';

export interface Option {
  id: string | number;
  label: string;
}

export interface CustomChangeEvent<T = any> {
  target: {
    name: string;
    value: T;
  };
}

interface CommonProps {
  options: Option[];
  label?: React.ReactNode;
  name: string;
  onChange: (e: CustomChangeEvent) => void;
  inputLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SingleValueProps extends CommonProps {
  value: string | number | null;
  allowMulti?: false;
}

export interface MultiValueProps extends CommonProps {
  value: string[] | number[] | null;
  allowMulti: true;
}

type OptionGroupProps = SingleValueProps | MultiValueProps;

const OptionGroup: React.FC<OptionGroupProps> = ({
  value,
  onChange,
  allowMulti,
  label,
  options,
  name,
  inputLabelProps,
  error,
  required,
  disabled,
}) => {
  const e = {
    target: {
      name: '',
      value: '',
    },
  } as unknown as React.ChangeEvent<HTMLInputElement>;

  const onChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: number | string = e.target.value;

    if (typeof options?.[0].id === 'number') {
      newValue = Number(newValue);
    }

    let newValues = [];
    if (e.target.checked) {
      newValues = [...(value as (string | number)[]), newValue];
    } else {
      newValues = (value as (string | number)[]).filter(
        (val) => val !== newValue
      );
    }
    onChange({
      target: {
        name,
        value: newValues,
      },
    });
  };

  const getChecked = (id: string | number) => {
    return (value as (string | number)[]).includes(id);
  };

  return (
    <div className={classes(disabled && styles.disabled)}>
      {label ? <Label required={required}>{label}</Label> : null}
      <div className={styles.radioGroupOptions}>
        {options.map((option) => {
          const checked = allowMulti
            ? getChecked(option.id)
            : value === option.id;
          return (
            <label
              {...inputLabelProps}
              key={option.id}
              className={classes(
                styles.radioGroupLabel,
                inputLabelProps?.className,
                checked && styles.active
              )}
            >
              <input
                type={allowMulti ? 'checkbox' : 'radio'}
                name={name}
                value={option.id}
                className={styles.radioGroupInput}
                onChange={
                  disabled ? undefined : allowMulti ? onChangeCustom : onChange
                }
                checked={checked}
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};

export default OptionGroup;
