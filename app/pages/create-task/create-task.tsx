import { ROUTES } from '~/constants';
import TaskForm from '~/components/task-form/task-form';

export const meta = () => {
  return [{ title: ROUTES.CREATE_TASK.title }];
};

const CreateTask = () => {
  return <TaskForm isEditMode={false} />;
};

export default CreateTask;
