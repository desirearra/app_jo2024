# Frontend JO 2024 🏅

Application frontend pour le projet JO 2024, construite avec React, TypeScript, Vite et Shadcn UI.

## 🚀 Technologies

- **Framework** : React 18 avec TypeScript
- **Build** : Vite
- **UI** :
  - Shadcn UI (composants)
  - Tailwind CSS (styles)
  - Radix UI (primitives)
- **Tests** :
  - Jest
  - React Testing Library
- **Qualité de code** :
  - ESLint
  - Prettier
  - TypeScript strict mode

## 📦 Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🧪 Tests

Les tests sont organisés dans des dossiers `__tests__` à côté des composants qu'ils testent :

```
src/
  components/
    Button/
      __tests__/
        Button.test.tsx
      Button.tsx
  pages/
    Home/
      __tests__/
        Home.test.tsx
      Home.tsx
```

Pour exécuter les tests :

```bash
# Lancer tous les tests
npm test

# Mode watch
npm run test:watch

# Avec couverture
npm run test:coverage
```

## 🔍 Scripts disponibles

- `dev` : Démarre le serveur de développement
- `build` : Build pour la production
- `type-check` : Vérifie les types TypeScript
- `lint` : Vérifie le code avec ESLint
- `lint:fix` : Corrige automatiquement les erreurs ESLint
- `format` : Formate le code avec Prettier
- `test` : Lance les tests
- `test:watch` : Lance les tests en mode watch
- `test:coverage` : Lance les tests avec couverture

## 📚 Structure du projet

```
src/
  components/        # Composants réutilisables
    ui/             # Composants UI de base (Shadcn)
    layout/         # Composants de mise en page
  pages/            # Pages de l'application
  styles/           # Styles globaux et thème
  lib/             # Utilitaires et helpers
  hooks/           # Hooks React personnalisés
  contexts/        # Contextes React
  assets/          # Images, fonts, etc.
```

## 🎨 Composants UI

Les composants UI sont basés sur Shadcn UI et utilisent Tailwind CSS pour le styling. Ils sont :

- Accessibles (a11y)
- Typés avec TypeScript
- Testés
- Personnalisables via Tailwind

## 🔄 Alias d'importation

Le projet utilise l'alias `@` pour les imports depuis le dossier `src` :

```typescript
// Au lieu de
import { Button } from '../../../components/ui/button';

// Utilisez
import { Button } from '@/components/ui/button';
```
