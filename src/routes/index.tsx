import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import { ROUTES } from '@/constants/routes'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
])
