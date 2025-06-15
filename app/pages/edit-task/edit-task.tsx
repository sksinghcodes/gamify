import { ROUTES } from '~/constants';
import TaskForm from '~/components/task-form/task-form';

export const meta = () => {
  return [{ title: ROUTES.EDIT_TASK.title }];
};

const EditTask = () => {
  return <TaskForm isEditMode={true} />;
};

export default EditTask;
