# 🚀 Description de la Pull Request

## Type de changement

<!-- Cochez les cases appropriées en remplaçant [ ] par [x] -->

- [x] ✨ Nouvelle fonctionnalité
- [x] 🐛 Correction de bug
- [x] 📝 Documentation
- [x] ♻️ Refactoring
- [ ] 🎨 Style
- [ ] ⚡️ Performance
- [x] 🧪 Tests
- [x] 🔧 Configuration
- [x] 🔐 Sécurité
- [x] 📦 Dépendances

## Résumé

Cette PR apporte une **intégration complète entre le frontend et le backend**, ainsi qu'une refonte majeure de l'admin, de la gestion des entités et de la sécurité :

- Connexion du frontend à l'API backend (helpers, types, endpoints)
- Refonte des services, contrôleurs et schémas backend pour intégration totale
- Harmonisation des contextes (AppContext, AuthContext)
- CRUD complet et suppression hard/soft pour toutes les entités (offres, événements, commandes, utilisateurs, billets)
- Cascade delete (suppression d'une commande supprime orderItems et tickets)
- Gestion du stock d'offres (vérification et décrémentation atomique)
- Refonte des flows d'authentification (login, register, 2FA, forgot password)
- UI/UX harmonisée (landing, offres, admin, feedback, StatusBadge, toasts)
- Refactorisation et enrichissement des tests (backend & frontend)
- Documentation technique et MCD à jour

---

## Détail des principaux commits

- **feat(prisma):** update schema for cascade deletes and offer places
- **feat(backend):** refactor services and controllers for full frontend-backend integration
- **feat(types):** update backend types and zod schemas for strict validation
- **test(backend):** update and add tests for new order, offer, user, and ticket flows
- **feat(frontend):** connect API helpers and types to backend endpoints
- **feat(context):** harmonize AppContext and AuthContext for backend integration
- **feat(admin):** enable hard delete, feedback, and cascade for all entities
- **feat(auth):** refactor login, register, 2FA, and forgot password flows
- **refactor(ui):** harmonize landing, offers, and UI components
- **test(frontend):** update and add tests for new frontend-backend flows
- **refactor(auth):** remove legacy auth pages and dead code
- **docs:** update documentation and add missing helpers/types (final cleanup)

---

## 🧪 Tests

- [x] Tests unitaires backend & frontend
- [x] Tests d'intégration backend
- [x] Tests manuels sur tous les flows critiques

---

## 📚 Documentation

- [x] README et MCD à jour
- [x] Sitemap et flows documentés
- [x] JSDoc sur les services et schémas

---

## ⚡ Breaking Changes

- Suppression des anciennes pages d'authentification
- Changement du flow de suppression (hard/soft + cascade)
- Nouvelle gestion du stock et des statuts

---

## 📦 Dépendances

- Mise à jour des dépendances backend et frontend pour l'intégration
- Migration Prisma appliquée

---

## 📋 Checklist

- [x] Le code suit les standards du projet
- [x] La documentation est à jour
- [x] Les tests passent (CI verte)
- [x] Les conflits sont résolus
- [x] Les variables d'environnement sont documentées
- [x] Les messages de commit sont clairs
- [x] La branche est à jour avec la branche cible

---

## 🔗 Issues liées

<!-- Listez les issues liées à cette PR -->

Related to BACK-1, BACK-2, BACK-3

---

## 🔍 Points d'attention

- Vérifier la gestion du stock et des statuts en production

---

## 🔜 Prochaines étapes

1. Déploiement en staging
2. Test fonctionnel et sécurité
3. Déploiement en production

---

Prêt pour review et merge sur `develop` 🚦
