import RootLayout from '@/components/layout/RootLayout';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AccountPage from '@/pages/Account';
import AdminPage from '@/pages/Admin';
import { CartPage } from '@/pages/Cart';
import { ErrorPage } from '@/pages/ErrorPage';
import { EventDetailsPage } from '@/pages/EventDetails';
import { EventsPage } from '@/pages/Events';
import { Home } from '@/pages/Home';
import { OffersPage } from '@/pages/Offers';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/evenements', element: <EventsPage /> },
      { path: '/evenements/:id', element: <EventDetailsPage /> },
      { path: '/offres', element: <OffersPage /> },
      { path: '/panier', element: <CartPage /> },
      { path: '/compte', element: <AccountPage /> },
      { path: '/admin', element: <AdminPage /> },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </AppProvider>
  );
}
