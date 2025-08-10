import React from 'react';
import styles from './score.module.css';
import { classes, getScoreClass } from '~/utils/string';

interface ScoreProps {
  score: number | null;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  const RADIUS = 24;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const safeScore =
    score === null || isNaN(Number(score)) ? null : Number(score);

  return (
    <span className={styles.wrap}>
      <svg width="50" height="50" viewBox="0 0 50 50" className={styles.svg}>
        <circle
          r={RADIUS}
          cx="25"
          cy="25"
          fill="transparent"
          className={styles.circle}
          strokeWidth="2px"
        ></circle>
        {!!safeScore && (
          <circle
            r={RADIUS}
            cx="25"
            cy="25"
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * ((100 - safeScore) / 100)}
            className={classes(styles.circleMain, styles[getScoreClass(score)])}
            strokeWidth="2px"
          ></circle>
        )}
      </svg>
      <span className={styles.text}>
        {safeScore === null ? '–' : `${safeScore}`}
      </span>
    </span>
  );
};

export default Score;
