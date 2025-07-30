import { INITIAL_TASK_STATE } from '~/constants';
import type { TaskFormState, TaskReqBody } from '~/types/task-types';

export const normalizeTaskFormState: (task: TaskFormState) => TaskReqBody = (
  task
) => {
  return {
    name: task.name.value,
    description: task.description.value,
    startTime: task.startTime.value,
    endTime: task.endTime.value,
    recurrence: task.recurrence.value,
    removeIt: task.removeIt.value,
  };
};

export const createTaskFormState: (task: TaskReqBody) => TaskFormState = (
  task
) => {
  const taskState: TaskFormState = JSON.parse(
    JSON.stringify(INITIAL_TASK_STATE)
  );
  taskState.name.value = task.name;
  taskState.description.value = task.description;
  taskState.startTime.value = task.startTime;
  taskState.endTime.value = task.endTime;
  taskState.recurrence.value = task.recurrence;
  taskState.removeIt.value = task.removeIt;
  return taskState;
};
