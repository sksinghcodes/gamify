import React from 'react';
import { capitalize, classes } from '~/utils/string';
import styles from './fab.module.css';
import Spinner from '~/components/spinner/spinner';

export enum FabType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export enum FabPosition {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export const FAB_TYPE = {
  PRIMARY: FabType.PRIMARY as FabType.PRIMARY,
  SECONDARY: FabType.SECONDARY as FabType.SECONDARY,
};

export const FAB_POSITION = {
  LEFT: FabPosition.LEFT as FabPosition.LEFT,
  RIGHT: FabPosition.RIGHT as FabPosition.RIGHT,
};

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fabType?: FabType;
  position?: FabPosition;
  loading?: boolean;
}

const Fab: React.FC<FabProps> = (props) => {
  const {
    fabType = FAB_TYPE.PRIMARY,
    position = FAB_POSITION.RIGHT,
    children,
    className,
    loading,
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      className={classes(
        'material-symbols-outlined',
        className,
        styles.fab,
        styles[fabType.toLowerCase()],
        styles[position.toLowerCase()]
      )}
    >
      {loading ? <Spinner className={styles.spinner} /> : children}
    </button>
  );
};

export default Fab;
