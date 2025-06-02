# 📚 Documentation Technique – E-billets JO 2024 (Mise à jour 2024)

## 📋 Table des matières

1. [Fonctionnalités principales](#fonctionnalites-principales)
2. [Stack Technique](#stack-technique)
3. [Entités & Modèle de Données](#entites--modele-de-donnees)
4. [API & Endpoints](#api--endpoints)
5. [Sécurité](#securite)
6. [Tests & Qualité](#tests--qualite)
7. [UX & Accessibilité](#ux--accessibilite)
8. [Dashboard Admin](#dashboard-admin)
9. [Déploiement & DevOps](#deploiement--devops)
10. [Génération des clés](#generation-des-cles)

---

## 🚀 Fonctionnalités principales

- Authentification sécurisée (JWT, 2FA pour admin, gestion des rôles)
- Gestion CRUD complète : Utilisateurs, Offres, Événements, Commandes, Billets
- Soft delete (désactivation/restauration) et hard delete (suppression définitive) pour toutes les entités
- Dashboard admin : stats, revenus, ventes récentes, DataTable, recherche, filtres, modales d'action
- Gestion du stock : vérification et décrémentation atomique lors de l'achat
- Panier utilisateur : ajout/suppression d'offres, validation, feedback instantané (toasts)
- Billets numériques : génération de QR code, statut, vérification sécurisée
- Cascade delete : suppression d'une commande supprime orderItems et tickets associés
- Statuts harmonisés : badge coloré (StatusBadge) pour utilisateurs, commandes, billets
- Feedback utilisateur : toasts pour toutes les actions critiques
- Sécurité : middleware d'auth, vérification des rôles, 2FA admin, hashing, validation Zod
- Tests automatisés : Jest (backend & frontend), Testing Library, TDD systématique
- Accessibilité & UX : composants Shadcn UI, focus, contrastes, responsive, modales accessibles
- CI/CD : hooks git, lint, format, tests, déploiement Docker/Fly.io
- Documentation interactive : Swagger/OpenAPI pour l'API backend

---

## 🛠 Stack Technique

### Frontend

- React (Vite, TypeScript)
- UI : Shadcn UI, Radix UI, Tailwind CSS
- State : Context API (AppContext, AuthContext)
- Tests : Jest, React Testing Library
- Routing : React Router
- Feedback : Toasts, modales, sheets, DataTable, StatusBadge
- Accessibilité : focus, contrastes, ARIA, responsive

### Backend

- Express.js (TypeScript)
- ORM : Prisma (PostgreSQL)
- Validation : Zod
- Sécurité : JWT, 2FA, hashing, middleware d'auth, rôles
- Tests : Jest (unitaires, intégration)
- API : RESTful, Swagger/OpenAPI
- Cascade delete : Prisma (relations onDelete: Cascade)
- Gestion du stock : transactionnelle, atomique

### DevOps

- Docker (multi-service)
- Fly.io (déploiement)
- CI/CD : hooks git, lint, tests, build
- Monitoring : logs applicatifs, Sentry (prévu)
- Documentation : Swagger UI, README, Notion

---

## 📦 Entités & Modèle de Données

- User : rôle, 2FA, commandes, tickets, soft/hard delete
- Event : offres liées, soft/hard delete
- Offer : type (Solo/Duo/Famille), stock, eventId, soft/hard delete
- Order : multi-items, cascade delete, key2, tickets générés
- OrderItem : tickets associés, cascade delete
- Ticket : QR code (finalKey), statut, places, cascade delete

Voir le schéma Prisma pour le détail des relations et des champs.

---

## 🌐 API & Endpoints

- `/api/auth/*` : login, register, 2FA, JWT
- `/api/users/*` : CRUD, soft/hard delete, profil enrichi
- `/api/events/*` : CRUD, soft/hard delete
- `/api/offers/*` : CRUD, soft/hard delete, gestion stock
- `/api/orders/*` : CRUD, cascade, validation stock, tickets
- `/api/tickets/*` : CRUD, vérification QR code, statuts

Documentation interactive complète : `/api/docs` (Swagger UI)

---

## 🛡️ Sécurité

- JWT pour toutes les routes protégées
- 2FA obligatoire pour les admins
- Hashing des mots de passe (bcrypt)
- Validation stricte (Zod)
- Protection des routes par rôle
- Cascade delete pour éviter les orphelins

---

## 🧪 Tests & Qualité

- TDD systématique (tests avant dev)
- Tests unitaires & intégration (backend & frontend)
- Coverage élevé sur les features critiques
- Lint/format : ESLint, Prettier, hooks git
- Micro-commits : un commit par feature/refactor

---

## 🎨 UX & Accessibilité

- Composants UI : Shadcn, Radix, Tailwind
- StatusBadge pour tous les statuts
- Modales accessibles (actions, confirmations)
- Toasts pour feedback utilisateur
- Responsive et mobile-first

---

## 📈 Dashboard Admin

- Stats : revenus, ventes, offres, événements
- DataTable : recherche, filtres, actions, modales
- Gestion CRUD : offres, événements, commandes, utilisateurs, billets
- Suppression soft/hard : toutes entités
- Vérification billets : QR code, statuts, feedback

---

## 🚀 Déploiement & DevOps

- Docker (PostgreSQL, backend, frontend)
- Fly.io (prod)
- CI/CD : lint, test, build, déploiement auto
- Monitoring : logs, Grafana
- Notion : suivi projet, todolist, documentation

### Environnement de développement

```bash
# Installation
yarn install

# Lancement de la base de données
docker compose up -d

# Création des tables et des données de démonstration
yarn seed

# Démarrage du frontend et du backend
yarn dev

# Démarrage des tests depuis la racine du projet
yarn test
```

### Variables d'Environnement backend

- `PORT`: Port du serveur (défaut: 3000)
- `NODE_ENV`: Environnement de développement (défaut: development)
- `DATABASE_URL`: URL de connexion PostgreSQL
- `SHADOW_DATABASE_URL`: URL de connexion PostgreSQL (shadow pour les tests)
- `JWT_SECRET`: Clé secrète pour JWT
- `JWT_EXPIRES_IN`: Durée de validité des tokens
- `MASTER_KEY`: Clé secrète pour les tickets
- `SMTP_HOST`: Hôte SMTP
- `SMTP_PORT`: Port SMTP
- `SMTP_USER`: Nom d'utilisateur SMTP
- `SMTP_PASS`: Mot de passe SMTP
- `SMTP_FROM`: Adresse de l'expéditeur

### Variables d'Environnement frontend

- `VITE_API_URL`: URL de l'API backend (défaut: http://localhost:3000)

---

## 🔑 Génération des clés

- key1 : à la création du compte (user)
- key2 : à la commande (order)
- finalKey : SHA-256(user.key1 + ':' + key2 + ':' + orderItem.id + ':' + idx)
  → Unicité et sécurité du QR code

---

## 📚 Pour aller plus loin

- Swagger UI : `/api/docs`
- Notion : suivi projet, todolist, documentation
- README : instructions de dev, scripts, env

---

_Documentation mise à jour automatiquement selon l'état du projet (mai 2024)._
