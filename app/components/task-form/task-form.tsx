import { useState } from 'react';
import {
  INITIAL_RECURRENCE_AND_REMOVE,
  INITIAL_TASK_STATE,
  INVALID_DATE_STRATEGY,
  INVALID_DATE_STRATEGY_LABELS,
  MONTHS_3_LETTER,
  RECURRENCE,
  REMOVE_TYPE,
  REMOVE_TYPE_LABELS,
  WEEKS,
} from '~/constants';
import type {
  InitialRecurrenceIF,
  MonthIndex,
  RecurrenceYearly,
  TaskFormState,
} from '~/types/task-types';
import styles from './task-form.module.css';
import TimeSelector, {
  type TimeSelectorOnChange,
} from '~/components/time-selector/time-selector';
import { useNavigate, useSearchParams } from 'react-router';
import { capitalize } from '~/utils/string';
import WeekdaySelector from '~/components/weekday-selector/weekday-selector';
import MonthlyDatesSelector from '~/components/monthly-dates-selector/monthly-dates-selector';
import YearlyDateSelector from '../yearly-date-selector/yearly-date-selector';
import DateSelector from '../date-selector/date-selector';
import { getDateString } from '~/utils/date';
import ErrorText from '../error-text/error-text';
import { normalizeTaskFormState } from '~/utils/generic';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const [task, setTask] = useState<TaskFormState>(INITIAL_TASK_STATE);
  const [openSelector, setOpenSelector] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [step, setStep] = useState(1);

  console.log(task);

  const navigate = useNavigate();

  const validate = (task: TaskFormState, fromSubmit: boolean) => {
    let isValid = true;
    const taskCopy = {
      ...task,
      name: { ...task.name },
      startTime: { ...task.startTime },
      endTime: { ...task.endTime },
    };

    if (!task.name.value.trim()) {
      taskCopy.name.error = 'Name is required';
      isValid = false;
    } else {
      taskCopy.name.error = '';
    }

    if (!task.startTime.value.trim()) {
      taskCopy.startTime.error = 'Start time is required';
      isValid = false;
    } else {
      taskCopy.startTime.error = '';
    }

    if (!task.endTime.value.trim()) {
      taskCopy.endTime.error = 'End time is required';
      isValid = false;
    } else {
      taskCopy.endTime.error = '';
    }

    if (fromSubmit) {
      taskCopy.name.touched = true;
      taskCopy.startTime.touched = true;
      taskCopy.endTime.touched = true;
    }

    setTask(taskCopy);
    return isValid;
  };

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    setTask((pre) => {
      const newTask = {
        ...pre,
        [name]: {
          ...pre[name as keyof TaskFormState],
          value:
            name === 'recurrence' || name === 'removeIt'
              ? INITIAL_RECURRENCE_AND_REMOVE[
                  value as keyof InitialRecurrenceIF
                ]
              : value,
          touched: true,
        },
      };

      validate(newTask, false);
      return newTask;
    });
  };

  const handleTimeChange: TimeSelectorOnChange = (e) => {
    const { name, value } = e;

    setTask((pre) => {
      const newTask = {
        ...pre,
        [name]: {
          ...pre[name as keyof TaskFormState],
          value,
          touched: true,
        },
      };

      validate(newTask, false);
      return newTask;
    });
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
              value={task.name.value}
              onChange={handleChange}
              className={styles.inputText}
            />
            {task.name.touched && task.name.error ? (
              <ErrorText>{task.name.error}</ErrorText>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task... (Optional)"
              value={task.description.value}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.timeRow}>
            <div className={styles.formGroup}>
              <span className={styles.label}>From time</span>
              <TimeSelector
                value={task.startTime.value}
                onChange={handleTimeChange}
                name="startTime"
              />
              {task.startTime.touched && task.startTime.error ? (
                <ErrorText>{task.startTime.error}</ErrorText>
              ) : null}
            </div>

            <div className={styles.formGroup}>
              <span className={styles.label}>To time</span>
              <TimeSelector
                value={task.endTime.value}
                onChange={handleTimeChange}
                name="endTime"
              />
              {task.endTime.touched && task.endTime.error ? (
                <ErrorText>{task.endTime.error}</ErrorText>
              ) : null}
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
                    name="recurrence"
                    value={freq}
                    checked={task.recurrence.value.type === freq}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>{capitalize(freq)}</span>
                </label>
              ))}
            </div>
          </div>

          {task.recurrence.value.type === RECURRENCE.WEEKLY ? (
            <>
              <WeekdaySelector
                value={task.recurrence.value.weekDays || []}
                onChange={(weekDays) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence: {
                      ...pre.recurrence,
                      value: {
                        ...pre.recurrence.value,
                        weekDays,
                      },
                    },
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.recurrence.value.weekDays.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected days:</div>
                  <div>
                    {task.recurrence.value.weekDays
                      ?.map((day) => WEEKS[day])
                      .join(', ')}
                  </div>
                </div>
              )}
            </>
          ) : task.recurrence.value.type === RECURRENCE.MONTHLY ? (
            <>
              <MonthlyDatesSelector
                value={task.recurrence.value}
                onChange={(recurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence: {
                      ...pre.recurrence,
                      value: recurrence,
                    },
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.recurrence.value.dates.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {task.recurrence.value.dates.join(', ')}
                  </div>
                  {task.recurrence.value.invalidDateStrategy !==
                  INVALID_DATE_STRATEGY.NONE ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.recurrence.value.invalidDateStrategy
                          ]
                        }
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </>
          ) : task.recurrence.value.type === RECURRENCE.YEARLY ? (
            <>
              <YearlyDateSelector
                open={openSelector}
                setOpen={setOpenSelector}
                value={task.recurrence.value}
                onChange={(recurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence: {
                      ...pre.recurrence,
                      value: recurrence,
                    },
                  }))
                }
              />
              {!!Object.keys(task.recurrence.value.monthAndDates).length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {Object.keys(task.recurrence.value.monthAndDates)
                      .map((month) =>
                        (
                          task.recurrence.value as RecurrenceYearly
                        ).monthAndDates[Number(month) as MonthIndex]
                          ?.map(
                            (date) =>
                              `${MONTHS_3_LETTER[Number(month)]} ${date}`
                          )
                          .join(', ')
                      )
                      .join(', ')}
                  </div>
                  {task.recurrence.value.feb29Strategy !==
                  INVALID_DATE_STRATEGY.NONE ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.recurrence.value.feb29Strategy
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
                <label
                  key={type}
                  className={`${styles.option} ${
                    task.removeIt.value.type === type ? styles.active : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="removeIt"
                    value={type}
                    checked={task.removeIt.value.type === type}
                    onChange={(e) => {
                      setShowDateSelector(true);
                      handleChange(e);
                    }}
                    className={styles.optionInput}
                  />
                  {REMOVE_TYPE_LABELS[type]}
                </label>
              ))}
            </div>
          </div>
          {task.removeIt.value.type === REMOVE_TYPE.AFTER_GIVEN_DATE && (
            <>
              <label
                className={styles.dateInputWrap}
                onClick={() => setShowDateSelector(true)}
              >
                <input
                  type="text"
                  placeholder="Select Date"
                  name="select-date"
                  readOnly
                  className={`${styles.dateInput} ${styles.inputText}`}
                  value={getDateString(task.removeIt.value.dateEpoch)}
                />
                <span
                  className={`material-symbols-outlined ${styles.dateIcon}`}
                >
                  calendar_today
                </span>
              </label>
              <DateSelector
                value={task.removeIt.value.dateEpoch}
                onChange={(date) => {
                  setTask((pre) => {
                    return {
                      ...pre,
                      removeIt: {
                        ...pre.removeIt,
                        value: {
                          ...pre.removeIt.value,
                          dateEpoch: date,
                        },
                      },
                    };
                  });
                }}
                open={showDateSelector}
                setOpen={setShowDateSelector}
              />
            </>
          )}
        </>
      )}

      {step !== 1 && (
        <button
          className={`${styles.fab} ${styles.prev} material-symbols-outlined`}
          onClick={() => setStep(step - 1)}
        >
          west
        </button>
      )}

      <button
        className={`${styles.fab}  ${styles.next} material-symbols-outlined`}
        onClick={() => {
          if (step === 3) {
            console.log(normalizeTaskFormState(task));
          } else {
            if (step === 1 && !validate(task, true)) {
              return;
            }
            setStep(step + 1);
          }
        }}
      >
        {step === 3 ? 'done' : 'east'}
      </button>
    </div>
  );
};

export default TaskForm;
