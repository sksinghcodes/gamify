import { useNavigate, useSearchParams } from 'react-router';
import styles from './task-preview.module.css';
import {
  INVALID_DATE_STRATEGY,
  MONTHS_3_LETTER,
  RECURRENCE,
  AUTO_REMOVE,
  ROUTES,
  WEEKS_1_LETTER,
  SCHEDULE,
  API_ENDPOINTS,
} from '~/constants';
import { CategoryEnum, type TaskWithRecord } from '~/types/task-types';
import { HeaderType } from '~/types/common-types';
import {
  getDateString,
  getTimeDuration,
  getYearlyDatesStructure,
  to12HourFormat,
} from '~/utils/date-utils';
import { capitalize, classes } from '~/utils/string';
import InfoText from '~/components/info-text/info-text';
import { CATEGORY_DESCRIPTION } from '~/constants/options';
import Fab from '~/fab/fab';
import { useContext, useEffect, useState } from 'react';
import { Context } from '~/context-provider';
import api from '~/api';

export const meta = () => [{ title: ROUTES.TASK_PREVIEW.title }];
export const handle = { headerType: HeaderType.DEFAULT };

const TaskPreview: React.FC = () => {
  const navigate = useNavigate();
  const { cacheById, setCacheById, loading, setLoading } = useContext(Context);
  const [params] = useSearchParams();
  const taskId = params.get('taskId');
  const [task, setTask] = useState<TaskWithRecord | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (taskId === null) {
      return;
    }

    if (cacheById && cacheById[taskId]) {
      return setTask(cacheById[taskId]);
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      api
        .get(API_ENDPOINTS.GET_ONE_TASK, {
          signal: controller.signal,
          params: {
            taskId,
          },
        })
        .then((response) => {
          if (response.data?.success) {
            setTask(response.data.task);
            setCacheById((pre) => {
              const obj = { ...(pre || {}) };
              obj[response.data.task._id] = response.data.task;
              return obj;
            });
          }
        })
        .catch((error) => {
          console.error('Error saving data', error);
        })
        .finally(() => setLoading(false));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [taskId]);

  const {
    name,
    description,
    recurrence,
    recurrenceInvalidDateStrategy,
    recurrenceValues,
    schedule,
    scheduleStartTime,
    scheduleEndTime,
    autoRemove,
    autoRemoveDate,
    category,
  } = task || {};

  const missingDateStrategy =
    recurrenceInvalidDateStrategy === INVALID_DATE_STRATEGY.SHIFT ? (
      <InfoText
        className={styles.info}
        info="Missing date strategy: Shift the task to the last valid date of the month"
      />
    ) : recurrenceInvalidDateStrategy === INVALID_DATE_STRATEGY.SKIP ? (
      <InfoText
        className={styles.info}
        info="Missing date strategy: Skip the task if the date does not exist in the month"
      />
    ) : null;

  return (
    <div className={styles.wrapper}>
      {loading ? (
        'Loading...'
      ) : task === null ? (
        'Task not found'
      ) : (
        <>
          <div className={styles.headingWrap}>
            <h1 className={styles.name}>{name}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <div className={styles.sectionWrap}>
            <div className={styles.section}>
              <span
                className={classes(styles.icon, 'material-symbols-outlined')}
              >
                label
              </span>
              <div className={styles.detailsWrap}>
                <p>{capitalize((category || '').replace('_', ' '))}</p>
                <InfoText
                  className={styles.info}
                  info={CATEGORY_DESCRIPTION[category as CategoryEnum]}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span
                className={classes(styles.icon, 'material-symbols-outlined')}
              >
                hourglass
              </span>
              <div className={styles.detailsWrap}>
                {schedule === SCHEDULE.TIMED &&
                scheduleEndTime !== undefined &&
                scheduleStartTime !== undefined ? (
                  <>
                    <p>
                      {to12HourFormat(scheduleStartTime)} –{' '}
                      {to12HourFormat(scheduleEndTime)}
                    </p>
                    <p>{getTimeDuration(scheduleStartTime, scheduleEndTime)}</p>
                  </>
                ) : (
                  <p>Anytime</p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <span
                className={classes(styles.icon, 'material-symbols-outlined')}
              >
                event_repeat
              </span>
              <div className={styles.detailsWrap}>
                {recurrence === RECURRENCE.DAILY ? (
                  <p>{capitalize(recurrence)}</p>
                ) : (
                  recurrenceValues !== null &&
                  (recurrence === RECURRENCE.WEEKLY ? (
                    <>
                      <p>{capitalize(recurrence)}</p>
                      <div className={styles.boxesWrap}>
                        {WEEKS_1_LETTER.map((weekday, i) => (
                          <div
                            className={`${styles.squareBox} ${
                              (recurrenceValues || []).includes(i)
                                ? styles.active
                                : ''
                            }`}
                            key={i}
                          >
                            {weekday}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : recurrence === RECURRENCE.MONTHLY ? (
                    <>
                      <p>{capitalize(recurrence)} on below dates</p>
                      <div className={styles.boxesWrap}>
                        {(recurrenceValues || []).map((date, i) => (
                          <div className={styles.squareBox} key={i}>
                            {date}
                          </div>
                        ))}
                      </div>
                      {missingDateStrategy}
                    </>
                  ) : recurrence === RECURRENCE.YEARLY ? (
                    <>
                      <p>{capitalize(recurrence)} on below dates</p>
                      <div className={styles.yearlyDatesWrap}>
                        {getYearlyDatesStructure(recurrenceValues || []).map(
                          ({ month, dates }) => (
                            <div className={styles.yearlyDates} key={month}>
                              <div className={styles.rectBox}>
                                {MONTHS_3_LETTER[month]}
                              </div>
                              <div className={styles.boxesWrap}>
                                {dates.map((date) => (
                                  <div className={styles.squareBox} key={date}>
                                    {date}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {missingDateStrategy}
                    </>
                  ) : null)
                )}
              </div>
            </div>

            {autoRemove !== AUTO_REMOVE.NEVER && (
              <>
                <div className={styles.section}>
                  <span
                    className={classes(
                      styles.icon,
                      'material-symbols-outlined'
                    )}
                  >
                    event_busy
                  </span>
                  <div className={styles.detailsWrap}>
                    <p>
                      Will be automatically deleted after{' '}
                      {autoRemove === AUTO_REMOVE.AFTER_GIVEN_DATE &&
                      autoRemoveDate
                        ? getDateString(autoRemoveDate)
                        : ''}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Fab
            onClick={() =>
              navigate(`${ROUTES.TASK_PROGRESS.path}?taskId=${taskId}`)
            }
          >
            stairs_2
          </Fab>
        </>
      )}
    </div>
  );
};

export default TaskPreview;
