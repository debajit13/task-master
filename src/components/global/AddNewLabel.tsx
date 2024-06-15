import { useState } from 'react';
import { Button, Card, Form, ListGroup, Modal } from 'react-bootstrap';
import { addLabel, deleteLabel } from '../../api/labelAPI';
import useStore from '../../store/store';
import { toast } from 'react-toastify';
import { TaskType } from '../../types/type';
import { MdDelete, MdInfo } from 'react-icons/md';
import EditLabelModal from '../label/EditLabelModal';

const AddNewLabel: React.FC<{
  reloadLabelListHandler: () => void;
  existingLabels: TaskType[] | [];
}> = ({ reloadLabelListHandler, existingLabels }) => {
  const uid = useStore((state) => state?.uid);
  const [label, setLabel] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFormHandler = () => {
    setLabel('');
  };

  const addLabelHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uid) {
      if (existingLabels.length > 0) {
        const isAlreadyExisted = existingLabels.find(
          (existingLabel) => existingLabel.label === label.toLowerCase()
        );
        if (isAlreadyExisted) {
          toast.error('This label is already existed!');
          return;
        }
      }
      addLabel(uid, label?.toLowerCase()).then(() => {
        reloadLabelListHandler();
        resetFormHandler();
        handleClose();
        toast.success('label addded successfully!');
      });
    } else {
      toast.error('Something went wrong!');
    }
  };

  const deleteLabelHandler = (labelId: string) => {
    const confirmation = confirm('Are you sure to delete the label?');
    if (confirmation) {
      deleteLabel(uid, labelId)
        .then(() => {
          reloadLabelListHandler();
          toast.success('Label deleted successfully!');
        })
        .catch((error) => {
          toast.error('Something went wrong!');
          console.error(error);
        });
    }
  };

  return (
    <>
      <Button
        onClick={handleShow}
        className='rounded-5 border-2 fw-bold d-flex justify-content-center align-items-center'
        variant='outline-info'
      >
        Manage Labels <MdInfo className='m-0 ms-1' />
      </Button>
      <Modal contentClassName='bg-info' show={show} onHide={handleClose}>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Manage Labels</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => addLabelHandler(e)}>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>New Label</Form.Label>
              <Form.Control
                type='text'
                value={label}
                onChange={(e) => setLabel(e?.target?.value)}
                placeholder='Write your label name here...'
                className='bg-info border-3 border-dark rounded-5'
                required
              />
            </Form.Group>
            <div className='d-flex justify-content-end mt-2 mb-3'>
              <Button variant='dark' type='submit' className='rounded-5'>
                Add Label ✓
              </Button>
            </div>
          </Form>

          <Card border='info' bg='dark' text='white' className='rounded-4 p-1'>
            <Card.Header className='border-0'>
              <h5 className='mb-0'>Your Labels</h5>
            </Card.Header>
            <Card.Body>
              {existingLabels.length > 0 ? (
                <ListGroup className='rounded-4 bg-info border-0'>
                  {existingLabels.map((existingLabel: TaskType) => (
                    <ListGroup.Item
                      variant='info'
                      key={existingLabel?.id}
                      className='bg-info d-flex justify-content-between align-items-center'
                    >
                      {existingLabel?.label}
                      <div>
                        <Button
                          size='sm'
                          variant='danger'
                          className='rounded-circle ms-2'
                          onClick={() => deleteLabelHandler(existingLabel?.id)}
                        >
                          <MdDelete />
                        </Button>
                        <EditLabelModal
                          uid={uid}
                          labelData={existingLabel}
                          reloadLabelListHandler={reloadLabelListHandler}
                        />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card.Text className='text-center'>No label found.</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddNewLabel;
