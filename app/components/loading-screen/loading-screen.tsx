import { useContext } from 'react';
import { Context } from '~/context-provider';
import styles from './loading-screen.module.css';

const LoadingScreen = () => {
  const context = useContext(Context);

  return (
    <div
      className={styles.wrapper}
      style={{
        minHeight: context.deviceHeight,
      }}
    >
      <div className={styles.content}>
        <div className={styles.glowOrb}></div>
        <h1 className={styles.title}>GAMIFY</h1>
        <p className={styles.subtitle}>
          Achieve your goals with a game-like experience
        </p>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
