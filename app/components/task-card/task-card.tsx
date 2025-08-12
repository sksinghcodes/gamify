import type { TaskWithRecord } from '~/types/task-types';
import styles from './task-card.module.css';
import { SCHEDULE } from '~/constants';
import { getTimeDuration, to12HourFormat } from '~/utils/date-utils';
import Score from '../score/score';
import { classes } from '~/utils/string';

interface TaskCardProps {
  task: TaskWithRecord;
  onClick: () => void;
  hideScore?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, hideScore }) => {
  return (
    <div key={task._id} className={styles.taskCard} onClick={onClick}>
      <div
        className={classes(styles.details, hideScore && styles.paddingRight)}
      >
        <div className={styles.taskName}>{task.name}</div>
        {task.schedule === SCHEDULE.TIMED ? (
          <div className={styles.meta}>
            <div>
              {to12HourFormat(task.scheduleStartTime)} –{' '}
              {to12HourFormat(task.scheduleEndTime)}
            </div>
            <div>
              {getTimeDuration(task.scheduleStartTime, task.scheduleEndTime)}
            </div>
          </div>
        ) : null}
      </div>
      {!hideScore && (
        <div className={styles.scoreWrap}>
          <Score
            score={task.taskRecord === null ? null : task.taskRecord.score}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
