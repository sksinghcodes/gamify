import ThemeSelector from '~/components/theme-selector/theme-selector';
import styles from './header.module.css';
import { useNavigate } from 'react-router';
import { ROUTES_BY_PATH } from '~/constants';
import {
  getDateString,
  getRelativeDayLabel,
  getTodayEpoch,
} from '~/utils/date';
import { useState } from 'react';

import { HeaderType } from '~/types/common-types';

const Header = () => {
  const navigate = useNavigate();
  const pageData = ROUTES_BY_PATH[location.pathname];
  const [dateEpoch, setDateEpoch] = useState<number>(getTodayEpoch());

  const adjacentDay = getRelativeDayLabel(dateEpoch);
  const dateString = getDateString(dateEpoch, true);

  const setNextDate = () => {
    const date = new Date(dateEpoch);
    date.setDate(date.getDate() + 1);
    setDateEpoch(date.getTime());
  };

  const setPrevDate = () => {
    const date = new Date(dateEpoch);
    date.setDate(date.getDate() - 1);
    setDateEpoch(date.getTime());
  };

  return pageData.headerType === HeaderType.DEFAULT ? (
    <header className={`${styles.header} ${styles.default}`}>
      <button
        className={`${styles.backButton} material-symbols-outlined`}
        onClick={() => navigate(-1)}
      >
        arrow_back
      </button>

      <h1 className={styles.title}>{pageData.title}</h1>
      <ThemeSelector />
    </header>
  ) : pageData.headerType === HeaderType.TASK_LIST ? (
    <header className={`${styles.header} ${styles.taskList}`}>
      <button
        className={`${styles.navBtn} material-symbols-outlined`}
        onClick={setPrevDate}
      >
        chevron_left
      </button>
      <div className={styles.date}>
        <div className={styles.dateRel}>
          {adjacentDay ? adjacentDay : dateString}
        </div>
        {adjacentDay ? (
          <div className={styles.dateText}>{dateString}</div>
        ) : null}
      </div>
      <button
        className={`${styles.navBtn} material-symbols-outlined`}
        onClick={setNextDate}
      >
        chevron_right
      </button>
    </header>
  ) : null;
};

export default Header;
