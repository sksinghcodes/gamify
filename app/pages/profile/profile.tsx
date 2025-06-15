import { useContext } from 'react';
import styles from './profile.module.css';
import { Context } from '~/context-provider';
import { ROUTES } from '~/constants';

export const meta = () => {
  return [{ title: ROUTES.PROFILE.title }];
};

const Profile = () => {
  const { signOut, isSigningOut } = useContext(Context);
  return (
    <div className={styles.wrapper}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          <span className="material-symbols-outlined">person</span>
        </div>
        <div>
          <div className={styles.name}>John Doe</div>
          <div className={styles.email}>john@example.com</div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>15🔥</div>
          <div className={styles.statLabel}>Day Streak</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>2430✨</div>
          <div className={styles.statLabel}>Total XP</div>
        </div>
      </div>

      <div className={styles.links}>
        <button className={styles.link}>
          <span className="material-symbols-outlined">settings</span>
          Settings
        </button>
        <button className={styles.link}>
          <span className="material-symbols-outlined">help</span>
          Support
        </button>
        <button className={styles.link + ' ' + styles.logout} onClick={signOut}>
          <span className="material-symbols-outlined">logout</span>
          {isSigningOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>
    </div>
  );
};

export default Profile;

// Add bottom nav here
