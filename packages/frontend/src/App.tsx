import RootLayout from '@/components/layout/RootLayout';
import { Toaster } from '@/components/ui/toaster';
import { AuthPage } from '@/pages/Auth';
import { CartPage } from '@/pages/Cart';
import { EventDetailsPage } from '@/pages/EventDetails';
import { EventsPage } from '@/pages/Events';
import { Home } from '@/pages/Home';
import { OffersPage } from '@/pages/Offers';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/evenements/:id" element={<EventDetailsPage />} />
          <Route path="/offres" element={<OffersPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
