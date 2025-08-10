import React from 'react';
import styles from './spinner.module.css';
import { classes } from '~/utils/string';

const Spinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <span
      {...props}
      className={classes(styles.spinner, props.className)}
      role="status"
      aria-live="polite"
    ></span>
  );
};

export default Spinner;
