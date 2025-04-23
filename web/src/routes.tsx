import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/:slug',
    element: <Redirect />,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
