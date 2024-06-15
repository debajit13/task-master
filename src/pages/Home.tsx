import { Button, Container, Form, Nav, Spinner } from 'react-bootstrap';
import AddTaskModal from '../components/global/AddTaskModal';
import useStore from '../store/store';
import { useEffect, useState } from 'react';
import { getTasks } from '../api/tasksAPI';
import { TaskData, TaskType } from '../types/type';
import TaskCard from '../components/global/TaskCard';
import { toast } from 'react-toastify';
import AddNewLabel from '../components/global/AddNewLabel';
import { getLabels } from '../api/labelAPI';

const status = ['All', 'Pending', 'Completed'];

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const username = useStore((state) => state?.username);
  const uid = useStore((state) => state?.uid);
  const [tasks, setTasks] = useState<TaskData[] | []>([]);
  const [allTasks, setAllTasks] = useState<TaskData[] | []>([]);
  const [taskListStatus, setTaskListStatus] = useState<string>(status[0]);
  const [label, setLabel] = useState<string>('');
  const [allLabels, setAllLabels] = useState<TaskType[]>([]);

  const getLabelsHandler = () => {
    getLabels(uid).then((res) => {
      if (typeof res !== 'undefined') {
        setAllLabels([...res]);
        setLabel('');
      }
    });
  };

  const getTasksHandler = () => {
    setIsLoading(true);
    if (uid) {
      getTasks(uid)
        .then((res) => {
          if (typeof res !== 'undefined') {
            let tempTasks =
              res.length > 0
                ? res.sort((x, y) =>
                    x.completed === y.completed ? 0 : x.completed ? 1 : -1
                  )
                : [];
            tempTasks =
              tempTasks.length > 0
                ? tempTasks.sort((x, y) =>
                    x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
                  )
                : [];
            setTasks([...tempTasks]);
            setAllTasks([...tempTasks]);
            setLabel('');
            setTaskListStatus(status[0]);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error);
        });
    }
  };

  useEffect(() => {
    switch (taskListStatus) {
      case 'All':
        setTasks(
          allTasks.filter((task) => (label ? task.label === label : task))
        );
        break;
      case 'Completed':
        setTasks(
          allTasks?.filter(
            (task) =>
              task.completed === true && (label ? task.label === label : task)
          )
        );
        break;
      case 'Pending':
        setTasks(
          allTasks?.filter(
            (task) =>
              task.completed === false && (label ? task.label === label : task)
          )
        );
        break;
      default:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListStatus, label]);

  useEffect(() => {
    getLabelsHandler();
    getTasksHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className='mt-5 mb-5'>
      <h3 className='mb-4'>Welcome {username ? username : 'User'},</h3>
      <section className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Tasks</h1>
        <AddTaskModal allLabels={allLabels} isDataAdded={getTasksHandler} />
      </section>
      <section className='mb-4'>
        <Nav
          variant='pills'
          defaultActiveKey={status[0]}
          className='mb-4 rounded-4'
          activeKey={taskListStatus}
          onSelect={(e) => {
            if (e) {
              setTaskListStatus(e);
            }
          }}
        >
          {status.map((item) => (
            <Nav.Item key={item}>
              <Nav.Link
                className={taskListStatus === item ? 'bg-info' : 'text-info'}
                eventKey={item}
              >
                {item}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <section className='d-flex mb-4 justify-content-between align-items-baseline'>
          <Form.Group className='d-flex w-50'>
            {allLabels.length > 0 && (
              <Form.Select
                className='bg-info border-3 border-dark  rounded-5'
                aria-label='Select Type'
                value={label}
                onChange={(e) => setLabel(e?.target?.value)}
                required
              >
                <option value=''>Select label</option>
                {allLabels.map((allLabel) => (
                  <option key={allLabel?.id} value={allLabel?.label}>
                    {allLabel?.label}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <AddNewLabel
            reloadLabelListHandler={getLabelsHandler}
            existingLabels={allLabels}
          />
        </section>

        {isLoading ? (
          <div className='text-center'>
            <Spinner animation='border' variant='info'></Spinner>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              allLabels={allLabels}
              key={task?.id}
              id={task?.id}
              title={task?.title}
              description={task?.description}
              label={task?.label}
              isImportant={task?.isImportant}
              time={task?.time}
              completed={task?.completed}
              refreshTasksListHandler={getTasksHandler}
            />
          ))
        ) : (
          <p className='text-white text-center'>No data found</p>
        )}
      </section>
    </Container>
  );
};
export default Home;
