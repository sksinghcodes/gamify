import { useContext } from 'react';
import styles from './settings.module.css';
import { Context } from '../../context-provider';

const Settings = () => {
  const { signOut, isSigningOut } = useContext(Context);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Settings</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>App Preferences</h3>

        <div className={styles.item}>
          <span>Theme</span>
          <select className={styles.select}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className={styles.item}>
          <span>Notifications</span>
          <label className={styles.switch}>
            <input type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.item}>
          <span>Default Task Duration</span>
          <select className={styles.select}>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Account</h3>
        <button className={styles.logout} onClick={signOut}>
          {isSigningOut ? 'Logging out...' : 'Log out'}
        </button>
      </section>
    </div>
  );
};

export default Settings;
