import { Button } from '@/components/ui/button';

/****
 * Affiche la page d'accueil avec un titre et une sélection de boutons illustrant différents styles.
 *
 * Cette page présente le titre "Accueil - JO 2024" et six boutons de variantes différentes pour démontrer les options d'interface utilisateur disponibles.
 */
export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Accueil - JO 2024</h1>
      <div className="flex gap-4 flex-wrap">
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="link">Link Button</Button>
      </div>
    </div>
  );
}
