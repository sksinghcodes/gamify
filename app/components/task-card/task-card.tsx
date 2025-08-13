import type { TaskWithRecord } from '~/types/task-types';
import styles from './task-card.module.css';
import { CATEGORY, SCHEDULE } from '~/constants';
import { getTimeDuration, to12HourFormat } from '~/utils/date-utils';
import Score from '../score/score';
import { capitalize, classes } from '~/utils/string';

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

        <div className={styles.meta}>
          {task.category !== CATEGORY.REGULAR && (
            <div>{capitalize(task.category.replace('_', ' '))}</div>
          )}
          {task.schedule === SCHEDULE.TIMED ? (
            <>
              {task.category !== CATEGORY.REGULAR && <>&bull;</>}
              <div>
                {getTimeDuration(task.scheduleStartTime, task.scheduleEndTime)}
              </div>
              &bull;
              <div>
                {to12HourFormat(task.scheduleStartTime)} –{' '}
                {to12HourFormat(task.scheduleEndTime)}
              </div>
            </>
          ) : null}
        </div>
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
