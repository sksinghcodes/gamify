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
  initialRecurrenceIF,
  RecurrenceMonthly,
  RecurrenceWeekly,
  TaskReqBodyIF,
} from '../../types/task-types';
import styles from './task-form.module.css';
import TimeSelector, {
  type TimeSelectorOnChange,
} from '../time-selector/time-selector';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const [task, setTask] = useState<TaskReqBodyIF>(INITIAL_TASK);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setTask((pre) => ({
      ...pre,
      [name]:
        name === 'howOften' || name === 'removeIt'
          ? INITIAL_RECURRENCE_AND_REMOVE[value as keyof initialRecurrenceIF]
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

  const handleWeekSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, checked } = e.target;
    const num = +value;
    const prev = task.howOften as RecurrenceWeekly;
    const newWeekDays = checked
      ? [...prev.weekDays, num].sort()
      : prev.weekDays.filter((day) => day !== num);

    setTask((pre) => ({
      ...pre,
      howOften: { ...prev, weekDays: newWeekDays },
    }));
  };

  const handleMonthDatesSelect: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { value, checked } = e.target;
    const num = +value;
    const prev = task.howOften as RecurrenceMonthly;
    const newDates = checked
      ? [...prev.dates, num].sort()
      : prev.dates.filter((date) => date !== num);

    setTask((pre) => ({
      ...pre,
      howOften: { ...prev, dates: newDates },
    }));
  };

  return (
    <div className={styles.taskFormWrapper}>
      <div className={styles.formGroup}>
        <label htmlFor="taskName">Name</label>
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
        <label htmlFor="description">Description</label>
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
          <label>From</label>
          <TimeSelector
            value={task.startTime}
            onChange={handleTimeChange}
            name="startTime"
          />
        </div>

        <div className={styles.formGroup}>
          <label>To</label>
          <TimeSelector
            value={task.endTime}
            onChange={handleTimeChange}
            name="endTime"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.subHeading}>Frequency</label>
        <div className={styles.radioRow}>
          {Object.values(RECURRENCE).map((freq) => (
            <label key={freq}>
              <input
                type="radio"
                name="howOften"
                value={freq}
                checked={task.howOften.type === freq}
                onChange={handleChange}
              />
              {freq}
            </label>
          ))}
        </div>
      </div>

      {task.howOften.type === RECURRENCE.WEEKLY && (
        <div className={styles.weekChips}>
          {WEEKS_3_LETTER.map((week, i) => (
            <label key={week} className={styles.chip}>
              <input
                type="checkbox"
                value={i}
                checked={(task.howOften as RecurrenceWeekly).weekDays.includes(
                  i
                )}
                onChange={handleWeekSelect}
              />
              {week}
            </label>
          ))}
        </div>
      )}

      {task.howOften.type === RECURRENCE.MONTHLY && (
        <div className={styles.calendarGrid}>
          {DATES.map((date) => (
            <label key={date}>
              <input
                type="checkbox"
                value={date}
                checked={(task.howOften as RecurrenceMonthly).dates.includes(
                  date
                )}
                onChange={handleMonthDatesSelect}
              />
              {date}
            </label>
          ))}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.subHeading}>
          When to automatically remove this task?
        </label>
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
    </div>
  );
};

export default TaskForm;
