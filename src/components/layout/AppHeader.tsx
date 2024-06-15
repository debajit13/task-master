import { signOut } from 'firebase/auth';
import { Button, Container, Navbar } from 'react-bootstrap';
import {
  NavLink as HeaderLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { auth } from '../../firebase/firebase.config';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useStore from '../../store/store';

const AppHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useStore((state) => state?.logout);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        logout();
        toast.success('Logged Out successfully!');
        navigate('/login');
      })
      .catch((error) => {
        toast.error('Something went wrong!');
        console.error(error);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        logout();
      }
      setIsLoading(false);
    });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Navbar className='bg-info'>
        <Container>
          <Navbar.Brand as={HeaderLink} to='/' className='fw-bold text-white'>
            <img
              height='40px'
              className='rounded-circle me-2'
              src='https://firebasestorage.googleapis.com/v0/b/task-master-78640.appspot.com/o/task-master-logo.webp?alt=media&token=d1e8e107-6474-471a-b4a5-37815e637f11'
              alt='Task Master'
            />
            Task Master
          </Navbar.Brand>
          {isLoading
            ? 'Loading...'
            : isAuthenticated && (
                <Button
                  type='button'
                  variant='outline-dark rounded-5 fw-bold'
                  onClick={logoutHandler}
                >
                  Logout →
                </Button>
              )}
        </Container>
      </Navbar>
    </>
  );
};
export default AppHeader;
