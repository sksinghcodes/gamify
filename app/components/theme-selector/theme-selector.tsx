import { useContext } from 'react';
import styles from './theme-selector.module.css';
import { Context } from '~/context-provider';

const ThemeSelector = () => {
  const { isDarkMode, setIsDarkMode } = useContext(Context);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('GAMIFY_THEME_IS_DARK', String(newTheme));
    document.documentElement.setAttribute(
      'data-theme',
      newTheme ? 'dark' : 'light'
    );
  };

  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
      <span className={`material-symbols-outlined ${styles.icon}`}>
        {isDarkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </label>
  );
};

export default ThemeSelector;
