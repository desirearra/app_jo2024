import { Button } from '@/components/ui/button';
import { CartWidget } from '@/components/ui/CartWidget';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function RootLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="https://www.olympics.com/images/static/b2p-images/logo_color.svg"
              alt="Logo JO Paris 2024"
              className="h-8 w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />
            <motion.span
              className="text-lg font-semibold hidden sm:inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Paris 2024
            </motion.span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/evenements">
              <Button
                variant={isActive('/evenements') ? 'default' : 'ghost'}
                className="text-sm sm:text-base rounded-full"
              >
                Événements
              </Button>
            </Link>
            <Link to="/offres">
              <Button
                variant={isActive('/offres') ? 'default' : 'ghost'}
                className="text-sm sm:text-base rounded-full"
              >
                Offres
              </Button>
            </Link>
            <CartWidget />
            <Link to="/auth">
              <Button variant="outline" className="text-sm sm:text-base rounded-full">
                Connexion
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2024 Jeux Olympiques de Paris. Tous droits réservés.
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <Link to="/mentions-legales" className="hover:text-gray-900">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="hover:text-gray-900">
                Confidentialité
              </Link>
              <Link to="/contact" className="hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
