import ThemeSelector from '~/components/theme-selector/theme-selector';
import styles from './header.module.css';
import { useNavigate, useSearchParams } from 'react-router';
import { BOTTOM_NAV_TABS, ROUTES, ROUTES_BY_PATH } from '~/constants';
import { getDateString, getRelativeDayLabel } from '~/utils/date-utils';
import { useContext, useState } from 'react';

import { HeaderType } from '~/types/common-types';
import DateSelector from '../date-selector/date-selector';
import { Context } from '~/context-provider';
import { classes } from '~/utils/string';

const Header = () => {
  const { loading, taskListDate, setTaskListDate, deleteTask } =
    useContext(Context);
  const navigate = useNavigate();
  const pageData = ROUTES_BY_PATH[location.pathname];
  const [openDateSelector, setOpenDateSelector] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');

  const adjacentDay = getRelativeDayLabel(taskListDate);
  const dateString = getDateString(taskListDate, true);
  const hideBackButton = BOTTOM_NAV_TABS.some(
    (bn) => bn.path === pageData.path
  );

  const setNextDate = () => {
    const date = new Date(taskListDate);
    date.setDate(date.getDate() + 1);
    setTaskListDate(date.getTime());
  };

  const setPrevDate = () => {
    const date = new Date(taskListDate);
    date.setDate(date.getDate() - 1);
    setTaskListDate(date.getTime());
  };

  const backButton = () => (
    <button
      className={classes(
        styles.headerButton,
        'material-symbols-outlined',
        hideBackButton && styles.hide
      )}
      onClick={() => navigate(-1)}
      disabled={loading}
    >
      arrow_back
    </button>
  );

  const handleDelete = () => {
    if (taskId) {
      deleteTask({
        taskId,
        onDelete: () => {
          navigate(ROUTES.TASKS_TO_DO.path);
        },
      });
    }
  };

  return pageData.headerType === HeaderType.DEFAULT ? (
    <header className={`${styles.header} ${styles.default}`}>
      {backButton()}
      <h1 className={styles.title}>{pageData.title}</h1>
      <ThemeSelector />
    </header>
  ) : pageData.headerType === HeaderType.TASKS_TO_DO ? (
    <header className={`${styles.header} ${styles.taskList}`}>
      <button
        className={`${styles.headerButton} material-symbols-outlined`}
        onClick={setPrevDate}
        disabled={loading}
      >
        chevron_left
      </button>
      <div className={styles.date} onClick={() => setOpenDateSelector(true)}>
        <div className={styles.dateRel}>
          {adjacentDay ? adjacentDay : dateString}
        </div>
        {adjacentDay ? (
          <div className={styles.dateText}>{dateString}</div>
        ) : null}
      </div>
      <button
        className={`${styles.headerButton} material-symbols-outlined`}
        onClick={setNextDate}
        disabled={loading}
      >
        chevron_right
      </button>
      <DateSelector
        value={taskListDate}
        onChange={(date) =>
          setTaskListDate(date === null ? taskListDate : date)
        }
        open={openDateSelector}
        setOpen={setOpenDateSelector}
      />
    </header>
  ) : pageData.headerType === HeaderType.TASK_PREVIEW ? (
    <header className={`${styles.header} ${styles.default}`}>
      {backButton()}
      <div>
        <button
          disabled={loading}
          className={`${styles.headerButton} material-symbols-outlined`}
        >
          edit
        </button>
        <button
          disabled={loading}
          className={`${styles.headerButton} material-symbols-outlined`}
          onClick={handleDelete}
        >
          delete
        </button>
      </div>
    </header>
  ) : null;
};

export default Header;
