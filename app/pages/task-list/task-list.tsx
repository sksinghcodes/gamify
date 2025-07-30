import { Fragment } from 'react';
import styles from './task-list.module.css';
import { ROUTES } from '~/constants';
import { useNavigate } from 'react-router';
import { type TaskRecord } from '~/types/task-types';
import arrow from '~/assets/arrow.svg';

export const meta = () => {
  return [{ title: ROUTES.TASK_LIST.title }];
};

const TaskList = () => {
  const navigate = useNavigate();

  const tasks: TaskRecord[] = [];

  const getScoreBtnClass = (task: any) => {
    if (!task.isScorable) return 'nonScorable';
    if (task.score === null) return 'scorable';
    if (task.score >= 75) return 'excellent';
    if (task.score >= 50) return 'good';
    if (task.score >= 25) return 'fair';
    return 'poor';
  };

  const formatDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const minutes = eh * 60 + em - (sh * 60 + sm);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h}h ` : ''}${m}m`;
  };

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>No tasks available</div>
        ) : (
          tasks.map((task, i) => (
            <Fragment key={task.id}>
              {i !== 0 && <hr className={styles.line} />}
              <div key={task.id} className={styles.taskCard}>
                <button
                  className={styles.details}
                  onClick={() => navigate(ROUTES.TASK_PREVIEW.path)}
                >
                  <div className={styles.taskName}>{task.name}</div>
                  <div className={styles.meta}>
                    {task.startTime} – {task.endTime} •{' '}
                    {formatDuration(task.startTime, task.endTime)}
                  </div>
                </button>
                <button
                  className={`${styles.scoreBtn} ${
                    styles[getScoreBtnClass(task)]
                  }`}
                  disabled={task.isScorable}
                >
                  {task.score === null ? '–' : `${task.score}%`}
                </button>
              </div>
            </Fragment>
          ))
        )}
      </div>

      <button
        className={`${styles.fab} material-symbols-outlined`}
        onClick={() => navigate(`${ROUTES.CREATE_TASK.path}?step=1`)}
      >
        add
      </button>
      <div className={styles.hintBox}>Click here to create a task</div>
      <img src={arrow} className={styles.arrowImage} />
    </div>
  );
};

export default TaskList;
