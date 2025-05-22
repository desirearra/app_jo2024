# 🎯 Description de la Pull Request

## Type de changement

<!-- Cochez les cases appropriées en remplaçant [ ] par [x] -->

- [x] ✨ Nouvelle fonctionnalité
- [ ] 🐛 Correction de bug
- [ ] 📝 Documentation
- [ ] ♻️ Refactoring
- [ ] 🎨 Style
- [ ] ⚡️ Performance
- [x] 🧪 Tests
- [x] 🔧 Configuration
- [ ] 🔐 Sécurité
- [x] 📦 Dépendances

## Description des changements

Cette PR met en place la configuration initiale du frontend de l'application e-billets JO 2024.

### 📋 Changements effectués

- Configuration de Shadcn UI et ses dépendances
- Configuration de Tailwind CSS et PostCSS
- Mise en place du routage avec React Router
- Création du layout principal avec header et navigation
- Configuration des tests avec Jest et React Testing Library
- Correction des tests du routeur React
- Mise à jour du template de PR

### 🔍 Contexte

Cette PR fait partie de la tâche FRONT-1 du projet et met en place les fondations nécessaires pour le développement des futures fonctionnalités frontend.

## 🧪 Tests

- [x] Tests unitaires
  - Test du composant App
  - Test du layout principal
  - Test de la navigation
- [ ] Tests d'intégration
- [x] Tests manuels
  - Vérification du rendu du layout
  - Vérification de la navigation
- [ ] Tests de performance

## 📝 Notes

- Le système de routage est configuré pour faciliter l'ajout de nouvelles routes
- Les composants UI de base sont prêts à être utilisés
- Les tests sont configurés pour une bonne couverture du code

## 📚 Documentation

- [x] Documentation du code
- [x] Documentation technique
- [ ] Documentation utilisateur
- [x] Commentaires mis à jour

## ⚡ Breaking Changes

Aucun breaking change (configuration initiale)

## 🔄 Dépendances

Nouvelles dépendances ajoutées :

- shadcn-ui et ses composants
- tailwindcss et ses plugins
- react-router-dom
- @testing-library/react et jest

## 📋 Checklist

- [x] Le code suit les standards du projet
- [x] La documentation est à jour
- [x] Les tests passent
- [ ] Le code a été revu
- [x] Les conflits sont résolus
- [x] Les variables d'environnement sont documentées
- [x] Les messages de commit sont clairs
- [x] La branche est à jour avec la branche cible

## 🔗 Issues liées

<!-- Listez les issues liées à cette PR -->

Related to FRONT-1

# 🔒 Sécurisation CI et Améliorations Frontend

## Type de changement

- [x] 🛠️ Amélioration technique
- [x] 📚 Documentation
- [x] 🧪 Tests
- [x] ⚙️ Configuration

## Description

Cette PR fait partie de la mise en place du frontend et se concentre sur la sécurisation des identifiants dans le CI et l'amélioration de la maintenabilité du code.

### 🔐 Sécurité CI/CD

- ✅ Utilisation des secrets GitHub pour les identifiants de base de données
- ✅ Ajout de la sauvegarde des artefacts de build frontend
- ✅ Configuration des filtres CodeRabbit pour une meilleure revue de code

### 🎨 Améliorations Frontend

- Refactorisation du composant Button pour une meilleure maintenabilité
- Séparation des scripts de build et de vérification des types
- Ajustement des seuils de couverture de tests pour un démarrage progressif

### 📚 Documentation

- Mise à jour complète du README frontend
- Documentation de la structure des tests
- Documentation des composants UI et des alias d'importation

## 🧪 Tests

- [x] Tests unitaires
  - Tests du composant App
  - Tests du trigger PostgreSQL

## 📋 Checklist

- [x] Le code suit les standards du projet
- [x] La documentation est à jour
- [x] Les tests passent
- [x] Le code a été revu par CodeRabbit
- [x] Les retours de CodeRabbit ont été traités

## 🔄 Changements de Configuration

### CI/CD

```yaml
- name: 📦 Sauvegarder les artefacts de build frontend
  uses: actions/upload-artifact@v4
  with:
    name: frontend-build
    path: packages/frontend/dist
    retention-days: 7
```

### Jest

```js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 75,
    statements: 75,
  },
}
```

### Scripts

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "vite build"
  }
}
```

## 📦 Dépendances

Pas de nouvelles dépendances ajoutées.

## 🔍 Points d'attention

1. Les seuils de couverture ont été ajustés pour permettre un développement progressif
2. La séparation du type-check et du build permet une meilleure granularité des tâches
3. Le composant Button a été refactorisé pour une meilleure maintenabilité

## 🔜 Prochaines étapes

1. Continuer le développement des composants UI de base
2. Améliorer le layout principal
3. Mettre en place l'authentification
4. Développer les pages principales

## 📝 Notes supplémentaires

Cette PR prépare le terrain pour la suite du développement frontend en mettant en place des bases solides en termes de qualité de code, de sécurité et de maintenabilité.
