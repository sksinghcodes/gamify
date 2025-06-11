import { useState } from 'react';
import {
  DATES,
  INITIAL_RECURRENCE_AND_REMOVE,
  INITIAL_TASK,
  RECURRENCE,
  REMOVE_TYPE,
  WEEKS_3_LETTER,
} from '../../constants';
import type {
  InitialRecurrenceIF,
  RecurrenceMonthly,
  RecurrenceWeekly,
  TaskReqBodyIF,
} from '../../types/task-types';
import styles from './task-form.module.css';
import TimeSelector, {
  type TimeSelectorOnChange,
} from '../time-selector/time-selector';
import { useSearchParams } from 'react-router';
import { capitalize } from '~/utils/string';
import WeekdaySelector from '../weekday-selector/weekday-selector';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const [task, setTask] = useState<TaskReqBodyIF>(INITIAL_TASK);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openWeekSelector, setOpenWeekSelector] = useState(false);

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

  const handleMonthDatesSelect: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { value, checked } = e.target;
    const num = +value;
    const prev = task.reccurrence as RecurrenceMonthly;
    const newDates = checked
      ? [...prev.dates, num].sort()
      : prev.dates.filter((date) => date !== num);

    setTask((pre) => ({
      ...pre,
      reccurrence: { ...prev, dates: newDates },
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
                  onClick={
                    freq === RECURRENCE.WEEKLY
                      ? () => setOpenWeekSelector(true)
                      : undefined
                  }
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

          <WeekdaySelector
            value={(task.reccurrence as RecurrenceWeekly).weekDays || []}
            onChange={(days) =>
              setTask((pre) => ({
                ...pre,
                reccurrence: { ...pre.reccurrence, weekDays: days },
              }))
            }
            open={openWeekSelector}
            setOpen={setOpenWeekSelector}
          />

          {(task.reccurrence as RecurrenceWeekly)?.weekDays?.length && (
            <div className={styles.selectedWeekdays}>
              Selected days:{' '}
              {(task.reccurrence as RecurrenceWeekly)?.weekDays
                ?.map((day) => WEEKS_3_LETTER[day])
                .join(', ')}
            </div>
          )}

          {task.reccurrence.type === RECURRENCE.MONTHLY && (
            <div className={styles.calendarGrid}>
              {DATES.map((date) => (
                <label key={date}>
                  <input
                    type="checkbox"
                    value={date}
                    checked={(
                      task.reccurrence as RecurrenceMonthly
                    ).dates.includes(date)}
                    onChange={handleMonthDatesSelect}
                  />
                  {date}
                </label>
              ))}
            </div>
          )}
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
