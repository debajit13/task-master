import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useStore from '../../store/store';
import { updateTask } from '../../api/tasksAPI';
import { MdEdit } from 'react-icons/md';
import { TaskData, TaskType } from '../../types/type';

interface EditModalData {
  task: TaskData;
  isDataEdited: () => void;
  allLabels: TaskType[] | [];
}

const EditTaskModal: React.FC<EditModalData> = ({
  isDataEdited,
  task,
  allLabels,
}) => {
  const uid = useStore((state) => state?.uid);
  const [show, setShow] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task?.title);
  const [description, setDescription] = useState<string>(task?.description);
  const [label, setLabel] = useState<string>(task?.label);
  const [time, setTime] = useState<string>(task?.time);
  const [isImportant, setIsImportant] = useState<boolean>(task?.isImportant);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFormHandler = () => {
    setTitle('');
    setDescription('');
    setLabel('');
    setTime('');
    setIsImportant(false);
  };

  const editTaskHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmation = confirm('Are you sure to edit this task?');
    if (confirmation) {
      updateTask(uid, task?.id, {
        title,
        description,
        label,
        completed: task?.completed,
        isImportant,
        time,
      }).then(() => {
        isDataEdited();
        resetFormHandler();
        handleClose();
      });
    }
  };

  return (
    <>
      <Button
        size='sm'
        className='rounded-circle'
        variant={task?.completed ? 'success' : 'info'}
        onClick={handleShow}
      >
        <MdEdit />
      </Button>
      <Modal contentClassName='bg-info' show={show} onHide={handleClose}>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => editTaskHandler(e)}>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type='text'
                value={title}
                onChange={(e) => setTitle(e?.target?.value)}
                placeholder='Write your task name here...'
                className='bg-info border-3 border-dark rounded-5'
                required
              />
            </Form.Group>
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as='textarea'
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
                className='bg-info border-3 border-dark rounded-4'
                rows={3}
                placeholder='Write your task description here...'
                required
              />
            </Form.Group>
            {allLabels.length > 0 && (
              <Form.Group>
                <Form.Label>Task Type</Form.Label>
                <Form.Select
                  className='bg-info border-3 border-dark rounded-5'
                  aria-label='Select Type'
                  value={label}
                  onChange={(e) => setLabel(e?.target?.value)}
                  required
                >
                  <option value=''>Select the type of task</option>
                  {allLabels.map((allLabel) => (
                    <option value={allLabel.label} key={allLabel.id}>
                      {allLabel.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <div className='form-group mb-3'>
              <label htmlFor='timepicker'>Select Date and Time</label>
              <input
                className='w-100 bg-info rounded-5  p-2 border-black text-black '
                type='datetime-local'
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
                name='timepicker'
                id='timepicker'
              />
            </div>
            <Form.Group className='d-flex'>
              <Form.Label htmlFor='mark-important' className='me-3'>
                Mark this task as important?
              </Form.Label>
              <Form.Check
                onChange={(e) => {
                  setIsImportant(e?.target?.checked);
                }}
                checked={isImportant}
                type='checkbox'
                id='mark-important'
              />
            </Form.Group>

            <div className='d-flex justify-content-end mt-5'>
              <Button variant='dark' type='submit' className='rounded-5'>
                Update Task ✓
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditTaskModal;
