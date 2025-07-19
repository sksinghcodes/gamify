import { useState } from 'react';
import {
  INITIAL_RECURRENCE_AND_REMOVE,
  INITIAL_TASK,
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
  TaskReqBody,
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

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const [task, setTask] = useState<TaskReqBody>(INITIAL_TASK);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSelector, setOpenSelector] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const navigate = useNavigate();

  const step = +(searchParams.get('step') || 1);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    setTask((pre) => ({
      ...pre,
      [name]:
        name === 'recurrence' || name === 'removeIt'
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
              className={styles.inputText}
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
              className={styles.textarea}
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
                    name="recurrence"
                    value={freq}
                    checked={task.recurrence.type === freq}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>{capitalize(freq)}</span>
                </label>
              ))}
            </div>
          </div>

          {task.recurrence.type === RECURRENCE.WEEKLY ? (
            <>
              <WeekdaySelector
                value={task.recurrence.weekDays || []}
                onChange={(weekDays) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence: { ...pre.recurrence, weekDays },
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.recurrence.weekDays.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected days:</div>
                  <div>
                    {task.recurrence.weekDays
                      ?.map((day) => WEEKS[day])
                      .join(', ')}
                  </div>
                </div>
              )}
            </>
          ) : task.recurrence.type === RECURRENCE.MONTHLY ? (
            <>
              <MonthlyDatesSelector
                value={task.recurrence}
                onChange={(recurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence,
                  }))
                }
                open={openSelector}
                setOpen={setOpenSelector}
              />
              {!!task.recurrence.dates.length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {task.recurrence.dates.join(', ')}
                  </div>
                  {task.recurrence.invalidDateStrategy !==
                  INVALID_DATE_STRATEGY.NONE ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.recurrence.invalidDateStrategy
                          ]
                        }
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </>
          ) : task.recurrence.type === RECURRENCE.YEARLY ? (
            <>
              <YearlyDateSelector
                open={openSelector}
                setOpen={setOpenSelector}
                value={task.recurrence}
                onChange={(recurrence) =>
                  setTask((pre) => ({
                    ...pre,
                    recurrence,
                  }))
                }
              />
              {!!Object.keys(task.recurrence.monthAndDates).length && (
                <div className={styles.selectedWeekdays}>
                  <div className={styles.label}>Selected Dates:</div>
                  <div className={styles.value}>
                    {Object.keys(task.recurrence.monthAndDates)
                      .map((month) =>
                        (task.recurrence as RecurrenceYearly).monthAndDates[
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
                  {task.recurrence.feb29Strategy !==
                  INVALID_DATE_STRATEGY.NONE ? (
                    <>
                      <div className={styles.label}>Missing date strategy:</div>
                      <div>
                        {
                          INVALID_DATE_STRATEGY_LABELS[
                            task.recurrence.feb29Strategy
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
                    task.removeIt.type === type ? styles.active : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="removeIt"
                    value={type}
                    checked={task.removeIt.type === type}
                    onChange={handleChange}
                    className={styles.optionInput}
                  />
                  {REMOVE_TYPE_LABELS[type]}
                </label>
              ))}
            </div>
          </div>
          {task.removeIt.type === REMOVE_TYPE.AFTER_GIVEN_DATE && (
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
                  value={getDateString(task.removeIt.dateEpoch)}
                />
                <span
                  className={`material-symbols-outlined ${styles.dateIcon}`}
                >
                  calendar_today
                </span>
              </label>
              <DateSelector
                value={task.removeIt.dateEpoch}
                onChange={(date) => {
                  setTask((pre) => {
                    return {
                      ...pre,
                      removeIt: {
                        ...pre.removeIt,
                        dateEpoch: date,
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
          onClick={() => navigate(-1)}
        >
          west
        </button>
      )}

      <button
        className={`${styles.fab}  ${styles.next} material-symbols-outlined`}
        onClick={() => {
          step === 3
            ? (() => {
                console.log(task);
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
