import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { CartWidget } from '@/components/ui/CartWidget';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu mobile si clic en dehors
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen]);

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
            <span className="text-lg font-semibold animate-fade-in-up [animation-delay:200ms]">
              Paris 2024
            </span>
          </Link>

          {/* Menu desktop */}
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
            {/* {isAuthenticated ? (
              <>
                {user?.role === 'admin' || user?.role === 'ADMIN' ? (
                  <button
                    className="py-2 px-4 rounded hover:bg-gray-100 font-medium text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/admin');
                    }}
                  >
                    Tableau de bord
                  </button>
                ) : (
                  <button
                    className="py-2 px-4 rounded hover:bg-gray-100 font-medium text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/compte');
                    }}
                  >
                    Profil & commandes
                  </button>
                )}
                <button
                  className="py-2 px-4 rounded hover:bg-gray-100 font-medium text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <button
                className="py-2 px-4 rounded hover:bg-gray-100 font-medium text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthOpen(true);
                }}
              >
                Connexion
              </button>
            )}
            <CartWidget /> */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="hover:scale-105 active:scale-95 transition-transform"
                    onClick={() => setAccountMenuOpen(v => !v)}
                  >
                    Mon compte
                  </Button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                      {user?.role === 'admin' || user?.role === 'ADMIN' ? (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigate('/admin');
                          }}
                        >
                          Tableau de bord
                        </button>
                      ) : (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigate('/compte');
                          }}
                        >
                          Profil & commandes
                        </button>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                      >
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="hover:scale-105 active:scale-95 transition-transform"
                  onClick={() => setAuthOpen(true)}
                >
                  Connexion
                </Button>
              )}
              <CartWidget />
            </div>
          </div>

          {/* Menu mobile (burger) */}
          <div className="flex items-center gap-2 sm:hidden">
            <CartWidget />
            <button
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
        {/* Drawer/menu mobile */}
        {mobileMenuOpen && (
          <div className="absolute top-0 right-0 z-50 bg-white flex justify-end w-full">
            <div
              ref={mobileMenuRef}
              className="min-w-full h-full bg-white shadow-lg p-6 flex flex-col gap-6 animate-slide-in-right"
            >
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="https://www.olympics.com/images/static/b2p-images/logo_color.svg"
                  alt="Logo JO Paris 2024"
                  className="h-8 w-auto animate-fade-in hover:scale-105 transition-transform"
                />
                <span className="text-lg font-semibold ">Paris 2024</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="self-end absolute top-4 right-4 p-2 rounded hover:bg-gray-100"
                aria-label="Fermer le menu"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <Link
                to="/"
                className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/evenements"
                className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Événements
              </Link>
              <Link
                to="/offres"
                className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Offres
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' || user?.role === 'ADMIN' ? (
                    <button
                      className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/admin');
                      }}
                    >
                      Tableau de bord
                    </button>
                  ) : (
                    <button
                      className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/compte');
                      }}
                    >
                      Profil & commandes
                    </button>
                  )}
                  <button
                    className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <button
                  className="py-2 px-4 rounded hover:bg-gray-100 text-lg font-medium text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        )}
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
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
