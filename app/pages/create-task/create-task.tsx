import TaskForm from '~/components/task-form/task-form';
import { ROUTES } from '~/constants';

export const meta = () => {
  return [{ title: ROUTES.CREATE_TASK.title }];
};

const CreateTask = () => {
  return <TaskForm isEditMode={false} />;
};

export default CreateTask;
