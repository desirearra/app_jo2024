import RootLayout from '@/components/layout/RootLayout';
import { Toaster } from '@/components/ui/toaster';
import { AuthPage } from '@/pages/Auth';
import { CartPage } from '@/pages/Cart';
import { EventDetailsPage } from '@/pages/EventDetails';
import { EventsPage } from '@/pages/Events';
import { Home } from '@/pages/Home';
import { OffersPage } from '@/pages/Offers';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/evenements', element: <EventsPage /> },
      { path: '/evenements/:id', element: <EventDetailsPage /> },
      { path: '/offres', element: <OffersPage /> },
      { path: '/panier', element: <CartPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/auth/register', element: <AuthPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
