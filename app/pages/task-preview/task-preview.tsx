import { useNavigate } from 'react-router';
import styles from './task-preview.module.css';
import {
  DURATION_UNIT,
  INVALID_DATE_STRATEGY,
  MONTHS,
  MONTHS_3_LETTER,
  RECURRENCE,
  REMOVE_TYPE,
  ROUTES,
  WEEKS_1_LETTER,
} from '~/constants';
import {
  type MonthIndex,
  type RecurrenceWeekly,
  type TaskIF,
} from '~/types/task-types';
import { HeaderType } from '~/types/common-types';
import {
  getDateAfterDuration,
  getDateString,
  getTimeDuration,
  to12HourFormat,
} from '~/utils/date';
import { capitalize } from '~/utils/string';

export const meta = () => [{ title: ROUTES.TASK_PREVIEW.title }];
export const handle = { headerType: HeaderType.DEFAULT };

const now = new Date().getTime();

// Replace this with dynamic data later
const task: TaskIF = {
  id: 'task-3',
  name: 'Daily Coding',
  description: 'Practice coding problems practice coding problems',
  startTime: '08:00',
  endTime: '09:00',
  recurrence: {
    // type: RECURRENCE.WEEKLY,
    // weekDays: [0, 1, 2, 6],

    // type: RECURRENCE.MONTHLY,
    // dates: [1, 2, 3, 4, 5, 6, 7, 8, 28, 29, 30, 31],
    // invalidDateStrategy: INVALID_DATE_STRATEGY.LAST_VALID,

    type: RECURRENCE.YEARLY,
    monthAndDates: {
      0: [1, 4, 7, 31],
      1: [1, 5, 8, 29],
      3: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    feb29Strategy: INVALID_DATE_STRATEGY.SKIP,
  },
  removeIt: {
    // type: REMOVE_TYPE.AFTER_GIVEN_DATE,
    // dateEpoch: new Date(2026, 2, 28).getTime(),

    type: REMOVE_TYPE.AFTER_GIVEN_DURATION,
    unit: DURATION_UNIT.DAY,
    nValue: 5,
  },
  score: 30,
  createdAt: new Date().getTime(),
  isScorable: true,
};

const { name, description, startTime, endTime, recurrence, removeIt } = task;

const TaskPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.headingWrap}>
        <h1 className={styles.name}>{name}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.sectionWrap}>
        <div className={styles.section}>
          <span className={`${styles.icon} material-symbols-outlined`}>
            hourglass
          </span>{' '}
          <div className={styles.detailsWrap}>
            <p>
              {to12HourFormat(startTime)} – {to12HourFormat(endTime)}
            </p>
            <p>{getTimeDuration(startTime, endTime)}</p>
          </div>
        </div>

        <div className={styles.section}>
          <span className={`${styles.icon} material-symbols-outlined`}>
            event_repeat
          </span>
          <div className={styles.detailsWrap}>
            {recurrence.type === RECURRENCE.WEEKLY && (
              <>
                <p>{capitalize(recurrence.type)}</p>
                <div className={styles.boxesWrap}>
                  {WEEKS_1_LETTER.map((weekday, i) => (
                    <div
                      className={`${styles.squareBox} ${
                        (recurrence as RecurrenceWeekly).weekDays.includes(i)
                          ? styles.active
                          : ''
                      }`}
                    >
                      {weekday}
                    </div>
                  ))}
                </div>
              </>
            )}

            {recurrence.type === RECURRENCE.MONTHLY && (
              <>
                <p>{capitalize(recurrence.type)} on below dates</p>
                <div className={styles.boxesWrap}>
                  {recurrence.dates.map((date, i) => (
                    <div className={styles.squareBox}>{date}</div>
                  ))}
                </div>
                {recurrence.invalidDateStrategy ===
                INVALID_DATE_STRATEGY.LAST_VALID ? (
                  <p className={styles.missingDateInfo}>
                    Missing date strategy: Move to last valid date
                  </p>
                ) : recurrence.invalidDateStrategy ===
                  INVALID_DATE_STRATEGY.SKIP ? (
                  <p className={styles.missingDateInfo}>
                    Missing date strategy: Skip that month
                  </p>
                ) : (
                  ''
                )}
              </>
            )}

            {recurrence.type === RECURRENCE.YEARLY && (
              <>
                <p>{capitalize(recurrence.type)} on below dates</p>

                {Object.keys(recurrence.monthAndDates).map((monthIndex) => (
                  <div className={styles.yearlyDates}>
                    <div className={styles.rectBox}>
                      {MONTHS_3_LETTER[Number(monthIndex)]}
                    </div>
                    <div className={styles.boxesWrap}>
                      {recurrence.monthAndDates[
                        Number(monthIndex) as MonthIndex
                      ]?.map((date) => (
                        <div className={styles.squareBox}>{date}</div>
                      ))}
                    </div>
                  </div>
                ))}

                {recurrence.feb29Strategy ===
                INVALID_DATE_STRATEGY.LAST_VALID ? (
                  <p className={styles.missingDateInfo}>
                    Missing date strategy: Move to last valid date
                  </p>
                ) : recurrence.feb29Strategy === INVALID_DATE_STRATEGY.SKIP ? (
                  <p className={styles.missingDateInfo}>
                    Missing date strategy: Skip that month
                  </p>
                ) : (
                  ''
                )}
              </>
            )}
          </div>
        </div>

        {removeIt.type !== REMOVE_TYPE.NEVER && (
          <>
            <div className={styles.section}>
              <span className={`${styles.icon} material-symbols-outlined`}>
                event_busy
              </span>
              <div className={styles.detailsWrap}>
                <p>
                  Will be automatically deleted after{' '}
                  {removeIt.type === REMOVE_TYPE.AFTER_GIVEN_DATE
                    ? getDateString(removeIt.dateEpoch)
                    : removeIt.type === REMOVE_TYPE.AFTER_GIVEN_DURATION
                    ? getDateString(
                        getDateAfterDuration(task.createdAt, removeIt)
                      )
                    : ''}
                  {}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        className={`${styles.fab} material-symbols-outlined`}
        onClick={() => navigate(ROUTES.PROGRESS_OVERVIEW.path)}
      >
        show_chart
      </button>
    </div>
  );
};

export default TaskPreview;
