import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
} from 'react-bootstrap';
import { MdCalendarMonth, MdDelete, MdLabelImportant } from 'react-icons/md';
import { deleteTask, updateTask } from '../../api/tasksAPI';
import useStore from '../../store/store';
import EditTaskModal from './EditTaskModal';
import { useState } from 'react';
import { TaskType } from '../../types/type';
import moment from 'moment';

interface TaskCardData {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  label: string;
  isImportant: boolean;
  time: string;
  refreshTasksListHandler: () => void;
  allLabels: TaskType[] | [];
}

const TaskCard: React.FC<TaskCardData> = ({
  id,
  title,
  description,
  completed,
  label,
  isImportant,
  time,
  refreshTasksListHandler,
  allLabels,
}) => {
  const uid = useStore((state) => state?.uid);
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);

  const updateCompletedStatus = (checked: boolean) => {
    setIsCompleted(checked);
    updateTask(uid, id, {
      title,
      description,
      label,
      isImportant,
      time,
      completed: checked,
    }).then(() => {
      refreshTasksListHandler();
    });
  };

  const deleteTaskHandler = () => {
    const confirmation = confirm('Are you sure to delete the task?');
    if (confirmation) {
      deleteTask(uid, id)
        .then(() => {
          refreshTasksListHandler();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Card
      border={completed ? 'success' : 'info'}
      className='bg-dark border-3 rounded-4 text-white mb-3'
    >
      <CardHeader className='d-flex justify-content-between align-items-center'>
        <div>
          <h3 className='d-flex align-items-center'>
            {isImportant && <MdLabelImportant className='text-danger me-1' />}{' '}
            {title}
          </h3>
          {time && (
            <div className='d-flex justify-content-start align-items-center'>
              <MdCalendarMonth className='text-info h5 m-0 me-2' />
              {moment(time).format('DD/MM/YYYY HH:mm A')}
            </div>
          )}
        </div>

        <div className='d-flex justify-content-center align-items-center'>
          <EditTaskModal
            allLabels={allLabels}
            isDataEdited={refreshTasksListHandler}
            task={{
              id,
              title,
              description,
              completed,
              label,
              isImportant,
              time,
            }}
          />
          <Button
            size='sm'
            variant='danger'
            className='rounded-circle ms-2'
            onClick={deleteTaskHandler}
          >
            <MdDelete />
          </Button>
        </div>
      </CardHeader>
      <CardBody className='d-flex justify-content-between align-items-center'>
        <Card.Text>
          <span className='fw-bold'>Description:</span> {description}
        </Card.Text>
        <Form.Check
          type='checkbox'
          id='title'
          className='custom-checkbox'
          checked={isCompleted}
          onChange={(e) => {
            updateCompletedStatus(e?.target?.checked);
          }}
        />
      </CardBody>
      <CardFooter>
        <Badge
          bg={completed ? 'success' : 'info'}
          text={completed ? 'white' : 'black'}
        >
          {label}
        </Badge>
      </CardFooter>
    </Card>
  );
};
export default TaskCard;
