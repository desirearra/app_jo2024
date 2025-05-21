# 🔄 Configuration du Workflow CI

## Description

Cette PR met en place le workflow d'intégration continue (CI) avec GitHub Actions pour automatiser les tests, le linting et le build du projet.

## 📦 Changements effectués

### 🔧 Configuration du Workflow CI

- Configuration du job `test-and-lint` :
  - ✅ Mise en place d'un service PostgreSQL pour les tests
  - ✅ Vérification du code avec ESLint
  - ✅ Vérification du formatage avec Prettier
  - ✅ Exécution des tests avec Jest
- Configuration du job `build` :
  - ✅ Build du frontend (Vite)
  - ✅ Build du backend (TypeScript)

### 🎯 Déclencheurs

- Push sur la branche `main`
- Pull Requests vers `main`

## 🧪 Tests

Le workflow lui-même exécute :

- Tests unitaires du frontend
- Tests unitaires du backend avec base de données de test
- Vérification du linting et formatage
- Vérification de la compilation

## 📋 Points d'attention pour la review

- Vérifier la configuration PostgreSQL pour les tests
- Vérifier les versions de Node.js et des dépendances
- Vérifier les commandes de build pour chaque workspace

## 🔜 Prochaines étapes

- [ ] Configuration des checks de PR
- [ ] Configuration du déploiement continu (CD)
- [ ] Configuration du monitoring et des alertes
