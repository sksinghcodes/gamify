import { useState } from 'react';
import {
  INITIAL_RECURRENCE_AND_REMOVE,
  INITIAL_TASK,
  INVALID_DATE_STRATEGY_LABELS,
  MONTHS_3_LETTER,
  RECURRENCE,
  REMOVE_TYPE,
  WEEKS,
} from '~/constants';
import type {
  InitialRecurrenceIF,
  MonthIndex,
  RecurrenceYearly,
  TaskReqBodyIF,
} from '~/types/task-types';
import styles from './task-form.module.css';
import TimeSelector, {
  type TimeSelectorOnChange,
} from '~/components/time-selector/time-selector';
import { useSearchParams } from 'react-router';
import { capitalize } from '~/utils/string';
import WeekdaySelector from '~/components/weekday-selector/weekday-selector';
import MonthlyDatesSelector from '~/components/monthly-dates-selector/monthly-dates-selector';
import YearlyDateSelector from '../yearly-date-selector/yearly-date-selector';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const [task, setTask] = useState<TaskReqBodyIF>(INITIAL_TASK);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSelector, setOpenSelector] = useState(false);

  const step = +(searchParams.get('step') || 1);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    setTask((pre) => ({
      ...pre,
      [name]:
        name === 'reccurrence' || name === 'removeIt'
          ? INITIAL_RECURRENCE_AND_REMOVE[value as keyof InitialRecurrenceIF]
          : value,
    }));
  };

  const handleTimeChange: TimeSelectorOnChange = (e) => {
    const { name, value } = e;
    setTask((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  return (
    <div className={styles.taskFormWrapper}>
      {step === 1 && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="taskName" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="taskName"
              name="name"
              placeholder="eg: Go to gym"
              value={task.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task... (Optional)"
              value={task.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.timeRow}>
            <div className={styles.formGroup}>
              <span className={styles.label}>From time</span>
              <TimeSelector
                value={task.startTime}
                onChange={handleTimeChange}
                name="startTime"
              />
            </div>

            <div className={styles.formGroup}>
              <span className={styles.label}>To time</span>
              <TimeSelector
                value={task.endTime}
                onChange={handleTimeChange}
                name="endTime"
              />
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.formGroup}>
            <span className={styles.label}>Frequency</span>
            <div className={styles.radioRow}>
              {Object.values(RECURRENCE).map((freq) => (
                <label
                  key={freq}
                  className={styles.radio}
                  onClick={() => setOpenSelector(true)}
                >
                  <input
                    type="radio"
                    name="reccurrence"
                    value={freq}
                    checked={task.reccurrence.type === freq}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>{capitalize(freq)}</span>
                </label>
              ))}
            </div>
          </div>

          {task.reccurrence.type === RECURRENCE.WEEKLY ? (
            <>
              <WeekdaySelector
                value={task.reccurrence.weekDays || []}
                onChange={(weekDays) =>
                  setTask((pre) => ({
                    ...pre,
                    reccurrence: { ...pre.reccurrence, weekDays },
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.reccurrence.weekDays.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected days:</div>
                  <div>
                    {task.reccurrence.weekDays
                      ?.map((day) => WEEKS[day])
                      .join(', ')}
                  </div>
                </div>
              )}
            </>
          ) : task.reccurrence.type === RECURRENCE.MONTHLY ? (
            <>
              <MonthlyDatesSelector
                value={task.reccurrence}
                onChange={(reccurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    reccurrence,
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.reccurrence.dates.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {task.reccurrence.dates.join(', ')}
                  </div>
                  {task.reccurrence.invalidDateStrategy ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.reccurrence.invalidDateStrategy
                          ]
                        }
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </>
          ) : task.reccurrence.type === RECURRENCE.YEARLY ? (
            <>
              <YearlyDateSelector
                open={openSelector}
                setOpen={setOpenSelector}
                value={task.reccurrence}
                onChange={(reccurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    reccurrence,
                  }))
                }
              />
              {!!Object.keys(task.reccurrence.monthAndDates).length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {Object.keys(task.reccurrence.monthAndDates)
                      .map((month) =>
                        (task.reccurrence as RecurrenceYearly).monthAndDates[
                          Number(month) as MonthIndex
                        ]
                          ?.map(
                            (date) =>
                              `${MONTHS_3_LETTER[Number(month)]} ${date}`
                          )
                          .join(', ')
                      )
                      .join(', ')}
                  </div>
                  {task.reccurrence.feb29Strategy ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.reccurrence.feb29Strategy
                          ]
                        }
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </>
          ) : null}
        </>
      )}

      {step === 3 && (
        <>
          <div className={styles.formGroup}>
            <span className={styles.label}>
              When to automatically remove this task?
            </span>
            <div className={styles.radioColumn}>
              {Object.values(REMOVE_TYPE).map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="removeIt"
                    value={type}
                    checked={task.removeIt.type === type}
                    onChange={handleChange}
                  />
                  {type === REMOVE_TYPE.NEVER
                    ? "Don't remove it automatically"
                    : type === REMOVE_TYPE.AFTER_N_UNIT
                    ? 'Remove it after a duration'
                    : 'Remove it after a date'}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {step !== 1 && (
        <button
          className={`${styles.fab} ${styles.prev} material-symbols-outlined`}
          onClick={() => setSearchParams({ step: String(step - 1) })}
        >
          west
        </button>
      )}

      <button
        className={`${styles.fab}  ${styles.next} material-symbols-outlined`}
        onClick={() => {
          step === 3
            ? (() => {
                console.log('Done');
              })()
            : setSearchParams({ step: String(step + 1) });
        }}
      >
        {step === 3 ? 'done' : 'east'}
      </button>
    </div>
  );
};

export default TaskForm;
