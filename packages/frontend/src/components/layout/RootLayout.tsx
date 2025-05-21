import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            JO 2024
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/events">Événements</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">Connexion</Link>
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
