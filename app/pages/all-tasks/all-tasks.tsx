import { useContext, useEffect } from 'react';
import api from '~/api';
import { API_ENDPOINTS, ROUTES } from '~/constants';
import { Context } from '~/context-provider';
import type { TaskWithRecord } from '~/types/task-types';
import styles from './all-tasks.module.css';
import Fab from '~/fab/fab';
import { useNavigate } from 'react-router';
import TaskCard from '~/components/task-card/task-card';

export const meta = () => {
  return [{ title: ROUTES.TASKS_TO_DO.title }];
};

const AllTasks = () => {
  const navigate = useNavigate();
  const { setCacheById, allTasks, setAllTasks, setLoading, loading } =
    useContext(Context);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    api
      .get(API_ENDPOINTS.GET_ALL_TASKS, {
        signal: controller.signal,
      })
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data?.tasks)) {
          const tasks: TaskWithRecord[] = response.data.tasks.map(
            (t: TaskWithRecord) => ({
              ...t,
              taskRecord: null,
            })
          );
          setAllTasks(tasks);
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
        console.error('Error saving data', error);
      })
      .finally(() => setLoading(false));
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <div className={styles.taskList}>
            {allTasks.length === 0 && !loading ? (
              <div className={styles.emptyState}>No tasks available</div>
            ) : (
              allTasks.map((task, i) => (
                <TaskCard
                  task={task}
                  onClick={() => {
                    navigate(`${ROUTES.TASK_PREVIEW.path}?taskId=${task._id}`);
                  }}
                  key={task._id}
                  hideScore={true}
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
        </>
      )}
    </div>
  );
};

export default AllTasks;
