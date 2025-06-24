import { Fragment } from 'react';
import styles from './task-list.module.css';
import { ROUTES } from '~/constants';
import { useNavigate } from 'react-router';
import {
  DurationEnum,
  InvalidDateStrategy,
  RecurrenceEnum,
  RemoveTypeEnum,
} from '~/types/task-types';

export const meta = () => {
  return [{ title: ROUTES.TASK_LIST.title }];
};

const TaskList = () => {
  const navigate = useNavigate();
  const now = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime();

  const tasks = [
    // DAILY + NEVER
    {
      id: 'task-1',
      name: 'Daily Standup',
      description: 'Daily quick sync with team',
      startTime: '09:00',
      endTime: '09:15',
      recurrence: {
        type: RecurrenceEnum.DAILY,
      },
      removeIt: {
        type: RemoveTypeEnum.NEVER,
      },
      score: null,
      isScorable: false,
    },

    // DAILY + AFTER_GIVEN_DURATION
    {
      id: 'task-2',
      name: 'Daily Meditation',
      description: '10 minutes mindfulness',
      startTime: '07:00',
      endTime: '07:10',
      recurrence: {
        type: RecurrenceEnum.DAILY,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DURATION,
        unit: DurationEnum.DAY,
        nValue: 10,
      },
      score: null,
      isScorable: true,
    },

    // DAILY + AFTER_GIVEN_DATE
    {
      id: 'task-3',
      name: 'Daily Coding',
      description: 'Practice coding problems practice coding problems',
      startTime: '08:00',
      endTime: '09:00',
      recurrence: {
        type: RecurrenceEnum.DAILY,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DATE,
        dateEpoch: now + 7 * 24 * 60 * 60 * 1000,
      },
      score: 30,
      isScorable: true,
    },

    // WEEKLY + NEVER
    {
      id: 'task-4',
      name: 'Weekly Review',
      description: 'Plan and review goals',
      startTime: '20:00',
      endTime: '21:00',
      recurrence: {
        type: RecurrenceEnum.WEEKLY,
        weekDays: [0, 6], // Sunday, Saturday
      },
      removeIt: {
        type: RemoveTypeEnum.NEVER,
      },
      score: 40,
      isScorable: true,
    },

    // WEEKLY + AFTER_GIVEN_DURATION
    {
      id: 'task-5',
      name: 'Weekly Yoga',
      description: 'Yoga on weekdays',
      startTime: '18:00',
      endTime: '19:00',
      recurrence: {
        type: RecurrenceEnum.WEEKLY,
        weekDays: [1, 3, 5],
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DURATION,
        unit: DurationEnum.WEEK,
        nValue: 5,
      },
      score: 50,
      isScorable: true,
    },

    // WEEKLY + AFTER_GIVEN_DATE
    {
      id: 'task-6',
      name: 'Weekly Study Group',
      description: 'Meet up for study sessions',
      startTime: '19:00',
      endTime: '21:00',
      recurrence: {
        type: RecurrenceEnum.WEEKLY,
        weekDays: [2],
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DATE,
        dateEpoch: now + 14 * 24 * 60 * 60 * 1000,
      },
      score: 60,
      isScorable: true,
    },

    // MONTHLY + NEVER
    {
      id: 'task-7',
      name: 'Monthly Report',
      description: 'Generate project reports',
      startTime: '10:00',
      endTime: '11:00',
      recurrence: {
        type: RecurrenceEnum.MONTHLY,
        dates: [1],
        invalidDateStrategy: InvalidDateStrategy.LAST_VALID,
      },
      removeIt: {
        type: RemoveTypeEnum.NEVER,
      },
      score: 70,
      isScorable: true,
    },

    // MONTHLY + AFTER_GIVEN_DURATION
    {
      id: 'task-8',
      name: 'Monthly Cleanup',
      description: 'Declutter workspace',
      startTime: '16:00',
      endTime: '17:00',
      recurrence: {
        type: RecurrenceEnum.MONTHLY,
        dates: [15, 30],
        invalidDateStrategy: InvalidDateStrategy.SKIP,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DURATION,
        unit: DurationEnum.MONTH,
        nValue: 2,
      },
      score: 80,
      isScorable: true,
    },

    // MONTHLY + AFTER_GIVEN_DATE
    {
      id: 'task-9',
      name: 'Monthly Budget Review',
      description: 'Review finances',
      startTime: '20:00',
      endTime: '21:00',
      recurrence: {
        type: RecurrenceEnum.MONTHLY,
        dates: [29],
        invalidDateStrategy: InvalidDateStrategy.NONE,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DATE,
        dateEpoch: now + 30 * 24 * 60 * 60 * 1000,
      },
      score: 90,
      isScorable: true,
    },

    // YEARLY + NEVER
    {
      id: 'task-10',
      name: 'Yearly Backup',
      description: 'System-wide backup',
      startTime: '02:00',
      endTime: '04:00',
      recurrence: {
        type: RecurrenceEnum.YEARLY,
        monthAndDates: { 11: [31] }, // December 31
        feb29Strategy: InvalidDateStrategy.SKIP,
      },
      removeIt: {
        type: RemoveTypeEnum.NEVER,
      },
      score: 7,
      isScorable: true,
    },

    // YEARLY + AFTER_GIVEN_DURATION
    {
      id: 'task-11',
      name: 'Yearly Health Checkup',
      description: 'Full body checkup',
      startTime: '09:00',
      endTime: '11:00',
      recurrence: {
        type: RecurrenceEnum.YEARLY,
        monthAndDates: { 0: [15], 6: [15] }, // Jan 15, July 15
        feb29Strategy: InvalidDateStrategy.LAST_VALID,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DURATION,
        unit: DurationEnum.YEAR,
        nValue: 3,
      },
      score: null,
      isScorable: false,
    },

    // YEARLY + AFTER_GIVEN_DATE
    {
      id: 'task-12',
      name: 'Leap Day Party',
      description: 'Party on Feb 29!',
      startTime: '17:00',
      endTime: '23:59',
      recurrence: {
        type: RecurrenceEnum.YEARLY,
        monthAndDates: { 1: [29] },
        feb29Strategy: InvalidDateStrategy.NONE,
      },
      removeIt: {
        type: RemoveTypeEnum.AFTER_GIVEN_DATE,
        dateEpoch: now + 365 * 24 * 60 * 60 * 1000,
      },
      score: null,
      isScorable: true,
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
              onClick={() => navigate(ROUTES.CREATE_TASK.path)}
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
    </div>
  );
};

export default TaskList;
