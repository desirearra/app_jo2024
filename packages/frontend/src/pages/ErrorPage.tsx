import { Button } from '@/components/ui/button';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError() as unknown;

  let title = 'Une erreur est survenue';
  let message = "Désolé, une erreur inattendue s'est produite.";
  const details =
    typeof error === 'object' && error !== null && 'data' in error
      ? (error as { data: string }).data
      : 'Unknown error';

  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page non trouvée';
      message = "Désolé, la page que vous recherchez n'existe pas.";
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
          <pre className="text-xs text-muted-foreground">{details}</pre>
        </div>

        <Button asChild>
          <Link to="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
