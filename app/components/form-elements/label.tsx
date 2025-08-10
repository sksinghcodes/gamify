import React from 'react';
import styles from './form-elements.module.css';
import { classes } from '~/utils/string';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children?: React.ReactNode;
}

const Label: React.FC<LabelProps> = (props) => {
  const { required, children, ...labelProps } = props;
  return (
    <label
      {...labelProps}
      className={classes(labelProps.className, styles.labelText)}
    >
      {children}
      {required ? <span className={styles.required}> *</span> : null}
    </label>
  );
};

export default Label;
