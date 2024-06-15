import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Auth />,
      },
      {
        path: '/register',
        element: <Auth />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
