import React, { useId, useState } from 'react';
import styles from './form-elements.module.css';
import ErrorText from '../error-text/error-text';
import { classes } from '~/utils/string';
import Spinner from '../spinner/spinner';
import Label from './label';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface CommonFieldProps {
  label?: React.ReactNode;
  error?: string;
  showSpinner?: boolean;
  required?: boolean;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export interface InputTypeTextProps extends InputProps, CommonFieldProps {
  type: 'text';
}

interface InputTypeNumber extends InputProps, CommonFieldProps {
  type: 'number';
  preventNonNumeric?: boolean;
  maxDecimals?: number;
}

interface InputTypePasswordProps extends InputProps, CommonFieldProps {
  type: 'password';
  showPasswordToggleButton?: boolean;
}

interface TextAreaProps extends TextareaProps, CommonFieldProps {
  type: 'textarea';
}

type InputTextProps =
  | InputTypeTextProps
  | TextAreaProps
  | InputTypePasswordProps
  | InputTypeNumber;

const InputText: React.FC<InputTextProps> = (props) => {
  const fallbackId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    label,
    error,
    showSpinner,
    className,
    required,
    rootProps,
    labelProps,
    type,
    ...inputProps
  } = props;

  let showPasswordToggleButton: boolean | undefined = false;
  let preventNonNumeric: boolean | undefined = false;
  let maxDecimals: number | undefined;
  let finalType = type;

  if (type === 'password') {
    showPasswordToggleButton = (inputProps as InputTypePasswordProps)
      .showPasswordToggleButton;
    delete (inputProps as InputTypePasswordProps).showPasswordToggleButton;
    finalType = showPasswordToggleButton && passwordVisible ? 'text' : type;
  } else if (type === 'number') {
    preventNonNumeric = (inputProps as InputTypeNumber).preventNonNumeric;
    maxDecimals = (inputProps as InputTypeNumber).maxDecimals;
    delete (inputProps as InputTypeNumber).preventNonNumeric;
    delete (inputProps as InputTypeNumber).maxDecimals;
  }

  const handleDigitOnlyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isDigit = /^[0-9]$/.test(e.key);
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (maxDecimals && maxDecimals > 0) {
      allowedKeys.push('.');
    }

    if (!isDigit && !allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (maxDecimals && e.currentTarget.value.includes('.')) {
      const [, fraction = ''] = e.currentTarget.value.split('.');
      if (
        fraction.length >= maxDecimals &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        isDigit
      ) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (maxDecimals) {
      const pasted = e.clipboardData.getData('Text');
      if (!/^\d*\.?\d*$/.test(pasted)) {
        e.preventDefault();
        return;
      }
      if (pasted.includes('.')) {
        const [, fraction = ''] = pasted.split('.');
        if (fraction.length > maxDecimals) {
          e.preventDefault();
          e.currentTarget.value =
            pasted.split('.')[0] + '.' + fraction.slice(0, maxDecimals); // Trim extra
        }
      }
    }
  };

  const { htmlFor: labelHtmlFor } = labelProps || {};

  const htmlFor =
    labelHtmlFor || inputProps.id || (label ? fallbackId : undefined);
  const id = inputProps.id || (label ? fallbackId : undefined);

  const finalProps = {
    ...inputProps,
    className: classes(className, error && styles.hasError, styles.inputText),
    id: id,
  };

  return (
    <div {...(rootProps || {})}>
      {label ? (
        <Label {...labelProps} htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      <div
        className={classes(
          showSpinner && styles.hasRightItem,
          showPasswordToggleButton && styles.passwordToggleWrap
        )}
      >
        {type === 'textarea' ? (
          <textarea {...(finalProps as TextareaProps)} />
        ) : (
          <>
            <input
              type={finalType}
              {...(finalProps as InputProps)}
              onKeyDown={
                preventNonNumeric
                  ? handleDigitOnlyKeyDown
                  : (finalProps.onKeyDown as React.KeyboardEventHandler<HTMLInputElement>)
              }
              onPaste={handlePaste}
            />
            {showPasswordToggleButton && (
              <button
                className={classes(
                  'material-symbols-outlined',
                  styles.passwordToggle
                )}
                onClick={() => setPasswordVisible(!passwordVisible)}
                type="button"
              >
                {passwordVisible ? 'visibility' : 'visibility_off'}
              </button>
            )}
          </>
        )}
        {showSpinner && <Spinner className={styles.spinner} />}
      </div>
      {props.error ? <ErrorText>{props.error}</ErrorText> : null}
    </div>
  );
};

export default InputText;
