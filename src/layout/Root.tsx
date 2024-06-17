import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { auth } from '../firebase/firebase.config';
import { useEffect } from 'react';

const Root = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        if (pathname === '/register' || pathname === '/login') {
          navigate('/');
        }
      } else {
        if (pathname === '/') {
          navigate('/login');
        }
      }
    });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <AppHeader />
      <main className='pb-5 h-100'>
        <Outlet />
      </main>
      <ToastContainer />
      <AppFooter />
    </>
  );
};

export default Root;
