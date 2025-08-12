import { useContext, useEffect, useState } from 'react';
import styles from './tasks-to-do.module.css';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import { useNavigate } from 'react-router';
import arrow from '~/assets/arrow.svg';
import { to_YYYY_MM_DD_Format } from '~/utils/date-utils';
import Fab from '~/fab/fab';
import type { TaskWithRecord } from '~/types/task-types';
import { Context } from '~/context-provider';
import api from '~/api';
import TaskCard from '~/components/task-card/task-card';
import Spinner from '~/components/spinner/spinner';

export const meta = () => {
  return [{ title: ROUTES.TASKS_TO_DO.title }];
};

const TasksToDo = () => {
  const navigate = useNavigate();
  const {
    loading,
    setLoading = () => {},
    taskListDate,
    cacheByDate,
    setCacheByDate,
    setCacheById,
  } = useContext(Context);
  const [tasks, setTasks] = useState<TaskWithRecord[]>([]);
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
  }, [taskListDate]);

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskList}>
        {loading ? (
          <div className={styles.spinnerWrap}>
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>No tasks available</div>
        ) : (
          tasks.map((task, i) => (
            <TaskCard
              task={task}
              onClick={() => {
                navigate(
                  `${ROUTES.LOG_SCORE.path}?taskId=${task._id}&taskDate=${dateStr}`
                );
              }}
              key={task._id}
            />
          ))
        )}
      </div>

      <Fab
        disabled={loading}
        className={styles.fab}
        onClick={() => navigate(ROUTES.CREATE_TASK.path)}
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

export default TasksToDo;
