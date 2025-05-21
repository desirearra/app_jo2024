import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';

/**
 * Affiche la structure principale de l'application avec un en-tête de navigation et une zone de contenu pour les routes imbriquées.
 *
 * L'en-tête comprend un lien vers la page d'accueil et deux boutons de navigation vers les pages "Événements" et "Connexion". Le contenu principal affiche les composants des routes enfants via {@link Outlet}.
 */
export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            JO 2024
          </Link>
          <div className="flex gap-4">
            <Link to="/events">
              <Button variant="ghost">Événements</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline">Connexion</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
