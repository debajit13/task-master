import { Button, Card, CardBody, Container } from 'react-bootstrap';
import AppFooter from '../components/layout/AppFooter';
import AppHeader from '../components/layout/AppHeader';
import { MdArrowBack } from 'react-icons/md';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const uid = useStore((state) => state?.uid);
  const navigate = useNavigate();

  const backToHomeHandler = () => {
    if (uid) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <AppHeader />
      <Container>
        <Card
          bg='dark'
          text='white'
          className='w-75 m-auto border-3 border-white rounded-5 mt-5'
          style={{
            maxWidth: '600px',
          }}
        >
          <Card.Img src='https://firebasestorage.googleapis.com/v0/b/task-master-78640.appspot.com/o/404-not-found.svg?alt=media&token=f2ee8946-df1f-4422-9622-b1cbdb0b9c34' />
          <CardBody className='text-center'>
            <h1> 404 No Data Found</h1>
            <Button
              className='rounded-5 mt-2 mb-2'
              variant='info'
              size='lg'
              onClick={backToHomeHandler}
            >
              <MdArrowBack className='me-2' />
              Go Back to Home
            </Button>
          </CardBody>
        </Card>
      </Container>
      <AppFooter />
    </>
  );
};
export default NotFound;
