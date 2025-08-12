import { useContext, useEffect, useState } from 'react';
import api from '~/api';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import { Context } from '~/context-provider';
import type { TaskWithRecord } from '~/types/task-types';
import styles from './all-tasks.module.css';
import Fab from '~/fab/fab';
import { useNavigate } from 'react-router';
import TaskCard from '~/components/task-card/task-card';
import Spinner from '~/components/spinner/spinner';

export const meta = () => {
  return [{ title: ROUTES.TASKS_TO_DO.title }];
};

const AllTasks = () => {
  const navigate = useNavigate();
  const { setCacheById, allTasks, setAllTasks, setLoading, loading } =
    useContext(Context);
  const [hideAll, setHideAll] = useState(true);

  useEffect(() => {
    if (Array.isArray(allTasks) || loading) {
      setHideAll(false);
      return;
    }

    setLoading(true);

    const controller = new AbortController();

    api
      .get(API_ENDPOINTS.GET_ALL_TASKS, {
        signal: controller.signal,
      })
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data?.tasks)) {
          setLoading(false);
          const tasks: TaskWithRecord[] = response.data.tasks.map(
            (t: TaskWithRecord) => ({
              ...t,
              taskRecord: null,
            })
          );
          setAllTasks(tasks);
          setHideAll(false);
          setCacheById((pre) => {
            const obj = { ...(pre || {}) };
            tasks.forEach((task: TaskWithRecord) => {
              obj[task._id] = { ...task };
            });
            return obj;
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching data', error);
        if (error.message !== 'canceled') {
          setLoading(false);
          setHideAll(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      {hideAll || loading ? (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      ) : allTasks === null || !allTasks?.length ? (
        <div className={styles.emptyState}>No tasks available</div>
      ) : (
        <>
          <div className={styles.taskList}>
            {allTasks.map((task, i) => (
              <TaskCard
                task={task}
                onClick={() => {
                  navigate(`${ROUTES.TASK_PREVIEW.path}?taskId=${task._id}`);
                }}
                key={task._id}
                hideScore={true}
              />
            ))}
          </div>
          <Fab
            disabled={loading}
            className={styles.fab}
            onClick={() => navigate(ROUTES.CREATE_TASK.path)}
          >
            add
          </Fab>
        </>
      )}
    </div>
  );
};

export default AllTasks;
