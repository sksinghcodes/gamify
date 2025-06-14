import { Fragment } from 'react';
import styles from './task-list.module.css';
import { ROUTES } from '../../constants';
import { useNavigate } from 'react-router';

export const meta = () => {
  return [{ title: ROUTES.TASK_LIST.title }];
};

const TaskList = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: '1',
      name: 'Not yet scorable',
      isScorable: false,
      start: '06:30',
      end: '07:15',
      score: null,
    },
    {
      id: '2',
      name: 'Scorable',
      isScorable: true,
      start: '07:15',
      end: '07:30',
      score: null,
    },
    {
      id: '3',
      name: 'Green: High score',
      isScorable: true,
      start: '10:00',
      end: '11:30',
      score: 82,
    },
    {
      id: '4',
      name: 'Yellow: Moderate score',
      isScorable: true,
      start: '13:00',
      end: '14:00',
      score: 65,
    },
    {
      id: '5',
      name: 'Orange: Low score',
      isScorable: true,
      start: '15:00',
      end: '15:45',
      score: 43,
    },
    {
      id: '6',
      name: 'Red: Very low score',
      isScorable: true,
      start: '17:00',
      end: '17:30',
      score: 18,
    },
  ];

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
          <div className={styles.emptyState}>
            <p>No tasks for today.</p>
            <button
              onClick={() => navigate('/create')}
              className={styles.addTaskBtn}
            >
              + Create Task
            </button>
          </div>
        ) : (
          tasks.map((task, i) => (
            <Fragment key={task.id}>
              {i !== 0 && <hr className={styles.line} />}
              <div key={task.id} className={styles.taskCard}>
                <button
                  className={styles.details}
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  <div className={styles.taskName}>{task.name}</div>
                  <div className={styles.meta}>
                    {task.start} – {task.end} •{' '}
                    {formatDuration(task.start, task.end)}
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
    </div>
  );
};

export default TaskList;
