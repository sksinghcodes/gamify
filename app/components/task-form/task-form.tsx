import { DURATION_UNIT, RECURRENCE, REMOVE_TYPE } from '../../constants';
import type { TaskIF } from '../../types/task-types';
import styles from './task-form.module.css';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const task1: TaskIF = {
    id: '1',
    name: 'my task name',
    description: 'my task description',
    startTime: '10:00',
    endTime: '11:00',
    howOften: {
      type: RECURRENCE.DAILY,
    },
    removeIt: {
      type: REMOVE_TYPE.NEVER,
    },
    isScorable: false,
    score: null,
  };

  const task2: TaskIF = {
    id: '2',
    name: 'my task name',
    description: 'my task description',
    startTime: '10:00',
    endTime: '11:00',
    howOften: {
      type: RECURRENCE.WEEKLY,
      weekDays: [1, 2, 4, 5],
    },
    removeIt: {
      type: REMOVE_TYPE.AFTER_N_UNIT,
      unit: DURATION_UNIT.DAY,
      nValue: 5,
    },
    isScorable: true,
    score: null,
  };

  const task3: TaskIF = {
    id: '3',
    name: 'my task name',
    description: 'my task description',
    startTime: '10:00',
    endTime: '11:00',
    howOften: {
      type: RECURRENCE.MONTHLY,
      dates: [1, 29, 30, 31],
    },
    removeIt: {
      type: REMOVE_TYPE.ON_DATE,
      dateEpoch: 1748553736467,
    },
    isScorable: true,
    score: 30,
  };

  const task4: TaskIF = {
    id: '3',
    name: 'my task name',
    description: 'my task description',
    startTime: '10:00',
    endTime: '11:00',
    howOften: {
      type: RECURRENCE.YEARLY,
      monthAndDates: [
        {
          month: 0,
          date: 31,
        },
        {
          month: 1,
          date: 14,
        },
        {
          month: 1,
          date: 28,
        },
      ],
    },
    removeIt: {
      type: REMOVE_TYPE.ON_DATE,
      dateEpoch: 1748553736467,
    },
    isScorable: true,
    score: 30,
  };

  console.log(isEditMode);
  console.log(task1);
  console.log(task2);
  console.log(task3);
  console.log(task4);

  return (
    <div className={styles.taskForm}>
      <div>
        <label htmlFor="taskName" className={styles.label}>
          Name
        </label>
        <input type="text" placeholder="Task Name" id="taskName" />
      </div>

      <div>
        <label htmlFor="desciption" className={styles.label}>
          Description
        </label>
        <textarea placeholder="Task Description" id="desciption" />
      </div>

      <div>
        <label htmlFor="startTime" className={styles.label}>
          From
        </label>
        <input type="time" id="startTime" />
      </div>

      <div>
        <label htmlFor="endTime" className={styles.label}>
          To
        </label>
        <input type="time" id="endTime" />
      </div>

      <div>
        <span className={styles.label}>How Often</span>
        <label>
          <input type="radio" name="howOften" value={RECURRENCE.DAILY} />
          <span>Daily</span>
        </label>
        <label>
          <input type="radio" name="howOften" value={RECURRENCE.WEEKLY} />
          <span>Weekly</span>
        </label>
        <label>
          <input type="radio" name="howOften" value={RECURRENCE.MONTHLY} />
          <span>Monthly</span>
        </label>
        <label>
          <input type="radio" name="howOften" value={RECURRENCE.YEARLY} />
          <span>Yearly</span>
        </label>
      </div>

      <div>
        <span className={styles.label}>
          When to automatically remove this task?
        </span>
        <div>
          <label>
            <input type="radio" name="removeIt" value={REMOVE_TYPE.NEVER} />
            <span>Don't remove it automatically</span>
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="removeIt"
              value={REMOVE_TYPE.AFTER_N_UNIT}
            />
            <span>Remove it after __ duration</span>
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="removeIt" value={REMOVE_TYPE.ON_DATE} />
            <span>Remove in after date</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
