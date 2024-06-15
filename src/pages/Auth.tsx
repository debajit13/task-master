import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Card, CardHeader, Col, Row, Button, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase.config';
import { toast } from 'react-toastify';
import useStore from '../store/store';

const Auth = () => {
  const login = useStore((state) => state?.login);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    resetInputHandler();
  }, []);

  useEffect(() => {
    resetInputHandler();
  }, [pathname]);

  const resetInputHandler = () => {
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const authHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pathname === '/register') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: username,
          });
          if (user && user.email && user.uid) {
            login({
              email: user.email,
              uid: user.uid,
              username: username,
            });
            toast.success('User registered successfully!');
            navigate('/');
          }
        })
        .catch((error) => {
          toast.error('Something went wrong!');
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    } else {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user && user.email && user.uid && user?.displayName) {
            login({
              email: user?.email,
              uid: user?.uid,
              username: user?.displayName,
            });
            toast.success('User logged in successfully!');
            navigate('/');
          }
        })
        .catch((error: { code: number; message: string }) => {
          toast.error('Something went wrong!');
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    }
  };

  return (
    <Row className='h-75 w-100 m-0'>
      <Col
        sm={6}
        className='d-flex pt-3 justify-content-center align-items-center'
      >
        <img
          src='https://firebasestorage.googleapis.com/v0/b/task-master-78640.appspot.com/o/discuss-talent-requirements.svg?alt=media&token=8a69b709-520c-42cb-a945-c0437f3feff6'
          alt='Login Image'
          width='90%'
          height='100%'
        />
      </Col>
      <Col
        sm={6}
        className='d-flex h-100 justify-content-center align-items-center'
      >
        <Card className='bg-dark border-3 border-white rounded-5 p-4 w-100'>
          <CardHeader className='text-white p-0'>
            <h1 className='m-0 p-0'>
              {pathname === '/register' ? 'Register' : 'Login'}
            </h1>
          </CardHeader>
          <Form
            className='text-white mt-3'
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => authHandler(e)}
          >
            {pathname === '/register' && (
              <Form.Group className='mb-2' controlId='formBasicEmail'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e?.target?.value);
                  }}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className='mb-2' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  setEmail(e?.target?.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className='mb-4' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e?.target?.value);
                }}
                placeholder='Password'
                required
              />
            </Form.Group>
            <p className='text-white'>
              {pathname === '/register' ? (
                <>
                  Already have an account? <Link to='/login'>Login here.</Link>
                </>
              ) : (
                <>
                  New to our site? <Link to='/register'>Register here.</Link>
                </>
              )}
            </p>
            <Button variant='info' type='submit'>
              {pathname === '/register' ? 'Register' : 'Login'}
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
export default Auth;
