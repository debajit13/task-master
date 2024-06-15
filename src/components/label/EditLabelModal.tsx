import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { MdEdit } from 'react-icons/md';
import { TaskType } from '../../types/type';
import { updateLabel } from '../../api/labelAPI';
import { toast } from 'react-toastify';

const EditLabelModal: React.FC<{
  uid: string;
  labelData: TaskType;
  reloadLabelListHandler: () => void;
}> = ({ labelData, uid, reloadLabelListHandler }) => {
  const [show, setShow] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(
    labelData?.label ? labelData?.label : ''
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateLabelHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uid) {
      updateLabel(uid, labelData?.id, label)
        .then(() => {
          reloadLabelListHandler();
          handleClose();
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
        size='sm'
        className='rounded-circle ms-2'
        variant='dark'
      >
        <MdEdit />
      </Button>

      <Modal contentClassName='bg-info' show={show} onHide={handleClose}>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Edit Label</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add New Label Form */}
          <Form onSubmit={(e) => updateLabelHandler(e)}>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>Label</Form.Label>
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
                Update Label ✓
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditLabelModal;
