import { Button } from '@/components/ui/button';
import { CartWidget } from '@/components/ui/CartWidget';
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
            <img
              src="https://www.olympics.com/images/static/b2p-images/logo_color.svg"
              alt="Logo JO Paris 2024"
              className="h-8 w-auto animate-fade-in hover:scale-105 transition-transform"
            />
            <span className="text-lg font-semibold hidden sm:inline-block animate-fade-in-up [animation-delay:200ms]">
              Paris 2024
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Button
                asChild
                variant={isActive('/') ? 'default' : 'ghost'}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <Link to="/">Accueil</Link>
              </Button>
              <Button
                asChild
                variant={isActive('/evenements') ? 'default' : 'ghost'}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <Link to="/evenements">Événements</Link>
              </Button>
              <Button
                asChild
                variant={isActive('/offres') ? 'default' : 'ghost'}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <Link to="/offres">Offres</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                asChild
                variant={isActive('/auth') ? 'default' : 'ghost'}
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <Link to="/auth">Connexion</Link>
              </Button>
              <CartWidget />
            </div>
          </div>
        </nav>
      </header>

      <main>
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
