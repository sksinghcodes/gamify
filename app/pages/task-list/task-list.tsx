import { Fragment, useContext, useEffect, useState } from 'react';
import styles from './task-list.module.css';
import { API_ENDPOINTS, ROUTES, SCHEDULE } from '~/constants';
import { useNavigate } from 'react-router';
import arrow from '~/assets/arrow.svg';
import {
  getTimeDuration,
  to12HourFormat,
  to_YYYY_MM_DD_Format,
} from '~/utils/date-utils';
import Score from '~/components/score/score';
import Fab from '~/fab/fab';
import type { TaskWithRecord } from '~/types/task-types';
import { Context } from '~/context-provider';
import api from '~/api';
import Modal from '~/components/modal/modal';
import ScoreLogger from '~/components/score-logger/score-logger';

export const meta = () => {
  return [{ title: ROUTES.TASK_LIST.title }];
};

const TaskList = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const {
    loading,
    setLoading = () => {},
    taskListDate,
    cacheByDate,
    setCacheByDate,
    setCacheById,
  } = useContext(Context);
  const [tasks, setTasks] = useState<TaskWithRecord[]>([]);
  const [activeTask, setActiveTask] = useState<TaskWithRecord | null>(null);
  const [reloadtId, setReloadId] = useState(0);
  const dateStr = to_YYYY_MM_DD_Format(taskListDate);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (cacheByDate && cacheByDate[dateStr]) {
      return setTasks(cacheByDate[dateStr]);
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      api
        .get(API_ENDPOINTS.GET_TASKS_BY_DATE, {
          signal: controller.signal,
          params: {
            date: dateStr,
          },
        })
        .then((response) => {
          if (response.data?.success) {
            setTasks(response.data.tasks);
            setCacheById((pre) => {
              const obj = { ...(pre || {}) };
              response.data.tasks.forEach((task: TaskWithRecord) => {
                obj[task._id] = { ...task, taskRecord: null };
              });
              return obj;
            });
            setCacheByDate((pre) => {
              const obj = { ...(pre || {}) };
              obj[dateStr] = response.data.tasks;
              return obj;
            });
          } else {
            setTasks([]);
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
  }, [taskListDate, reloadtId]);

  const reload = () => {
    setReloadId((pre) => pre + 1);
  };

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskList}>
        {tasks.length === 0 && !loading ? (
          <div className={styles.emptyState}>No tasks available</div>
        ) : (
          tasks.map((task, i) => (
            <Fragment key={task._id}>
              <div key={task._id} className={styles.taskCard}>
                <div
                  className={styles.details}
                  onClick={() => {
                    setActiveTask(task);
                    setOpenModal(true);
                  }}
                >
                  <div className={styles.taskName}>{task.name}</div>
                  {task.schedule === SCHEDULE.TIMED ? (
                    <div className={styles.meta}>
                      <div>
                        {to12HourFormat(task.scheduleStartTime)} –{' '}
                        {to12HourFormat(task.scheduleEndTime)}
                      </div>
                      <div>
                        {getTimeDuration(
                          task.scheduleStartTime,
                          task.scheduleEndTime
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className={styles.scoreWrap}>
                  <Score
                    score={
                      task.taskRecord === null ? null : task.taskRecord.score
                    }
                  />
                </div>
              </div>
            </Fragment>
          ))
        )}
      </div>

      <Modal
        title="Score"
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ScoreLogger
          task={activeTask}
          date={dateStr}
          handleClose={() => {
            setOpenModal(false);
          }}
          reload={reload}
        />
      </Modal>

      <Fab
        disabled={loading}
        className={styles.fab}
        onClick={() => navigate(`${ROUTES.CREATE_TASK.path}`)}
      >
        add
      </Fab>
      {tasks.length === 0 && !loading && (
        <>
          <div className={styles.hintBox}>Click here to create a task</div>
          <img src={arrow} className={styles.arrowImage} />
        </>
      )}
    </div>
  );
};

export default TaskList;
