import React from 'react';
import styles from './form-elements.module.css';
import { classes } from '~/utils/string';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Label: React.FC<LabelProps> = (props) => {
  const { required, children, disabled, ...labelProps } = props;
  return (
    <label
      {...labelProps}
      className={classes(
        labelProps.className,
        styles.labelText,
        disabled && styles.disabled
      )}
    >
      {children}
      {required ? <span className={styles.required}> *</span> : null}
    </label>
  );
};

export default Label;
