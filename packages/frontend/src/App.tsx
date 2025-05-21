import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
    ],
  },
]);

/**
 * Fournit la configuration de routage principale de l'application React.
 *
 * Affiche le routeur avec les différentes pages et mises en page définies.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
