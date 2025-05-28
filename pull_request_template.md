# 🚀 Release PR – Merge `develop` → `main`

## Description

Cette Pull Request fusionne la branche `develop` dans `main` pour une nouvelle release de l’application.  
Elle inclut toutes les évolutions, corrections et améliorations validées depuis la dernière release.

---

## ✨ Principales évolutions incluses

- **Déploiement Fly.io** : Backend et frontend déployés et configurés
- **Connexion Frontend ↔ Backend** : Intégration API centralisée avec axios, suppression progressive des mocks
- **Fixtures & Seed Prisma** : Ajout de données d’exemple (admin, offres, événements) pour faciliter le développement et les tests
- **CRUD Offres/Événements** : Premiers écrans fonctionnels côté admin, début d’intégration des opérations réelles
- **Tests & Qualité** : Couverture de tests améliorée (logger, services), correction des warnings ESLint/Jest
- **CI/CD** : Pipeline de build/test/coverage opérationnel
- **Divers** : Corrections de bugs, améliorations UI, documentation technique

---

## 🧪 Vérifications

- [x] Tests unitaires et d’intégration passés
- [x] Couverture de code conforme au seuil projet
- [x] Déploiement Fly.io validé (backend & frontend)
- [x] Fonctionnalités principales testées manuellement

---

## 📚 Instructions de déploiement

- Lancer le script de seed Prisma si besoin (`npx prisma db seed`)
- Vérifier les variables d’environnement sur Fly.io
- Suivre la checklist de release projet

---

## 📝 À faire après le merge

- Taguer la release sur `main`
- Mettre à jour la documentation Notion
- Communiquer la release à l’équipe

---

**Prêt pour la release ! 🚀  
Merci à toute l’équipe pour le travail accompli.**
