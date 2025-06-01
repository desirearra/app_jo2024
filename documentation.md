# 📚 Documentation Technique - E-billets JO 2024

## 📋 Table des matières

1. [Architecture du Projet](#architecture-du-projet)
2. [Stack Technique](#stack-technique)
3. [Structure de la Base de Données](#structure-de-la-base-de-données)
4. [Sécurité](#sécurité)
5. [API](#api)
6. [Déploiement](#déploiement)

## 🏗 Architecture du Projet

### Structure du Monorepo

```
app_jo2024/
├── packages/
│   ├── frontend/          # Application React
│   │   ├── src/
│   │   │   ├── assets/   # Images, fonts, etc.
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── public/
│   │
│   └── backend/          # API Express
│       ├── src/
│       │   ├── config/   # Configuration
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   └── utils/
│       └── prisma/      # Schémas et migrations
├── docker-compose.yml   # Configuration Docker
└── package.json        # Configuration du monorepo
```

## 🛠 Stack Technique

### Frontend

- **Framework**: React avec Vite
- **Language**: TypeScript
- **UI**: Shadcn UI
- **State Management**: À définir (Context API ou Redux)
- **Tests**: Jest + React Testing Library

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Tests**: Jest

### DevOps

- **Conteneurisation**: Docker
- **Base de données**: PostgreSQL 16 (Alpine)
- **CI/CD**: À définir
- **Déploiement**: Heroku

## 📊 Structure de la Base de Données

### MCD (Modèle Conceptuel de Données)

```mermaiderDiagram
    UTILISATEUR ||--o{ COMMANDE : passe
    UTILISATEUR {
        uuid id PK
        string email
        string password_hash
        string nom
        string prenom
        string role
        string cle1
        datetime created_at
        datetime updated_at
    }

    OFFRE ||--o{ COMMANDE : contient
    OFFRE {
        uuid id PK
        string nom
        string description
        decimal prix
        enum type
        int places
        boolean actif
        datetime created_at
        datetime updated_at
    }

    COMMANDE ||--o{ BILLET : genere
    COMMANDE {
        uuid id PK
        uuid utilisateur_id FK
        uuid offre_id FK
        string statut
        string type_transaction
        string id_transaction
        decimal montant_total
        datetime date_commande
        string cle2
    }

    BILLET {
        uuid id PK
        uuid commande_id FK
        string qr_code
        boolean utilise
        datetime date_utilisation
        string cle_finale
    }
```

### Types d'Offres

- Solo (1 personne)
- Duo (2 personnes)
- Famille (4 personnes)

## 🔐 Sécurité

### Authentification

- JWT pour l'authentification des API
- MFA via email ou OTP
- Stockage sécurisé des mots de passe (bcrypt)

### Système de Clés

1. **Clé 1**: Générée à la création du compte

   - Dérivée via HMAC avec master key
   - Stockée de manière chiffrée

2. **Clé 2**: Générée à la commande

   - HMAC avec master key et infos transaction
   - Liée à la transaction spécifique

3. **Clé Finale**: Concaténation Clé1 + Clé2
   - Utilisée pour générer le QR Code
   - Vérifiable sans accès à la base de données

### Chiffrement

- AES-256 pour le chiffrement des données sensibles
- Master key stockée dans les variables d'environnement

## 🌐 API

### Points d'entrée principaux

- `/api/auth/*` : Authentification
- `/api/offers/*` : Gestion des offres
- `/api/orders/*` : Gestion des commandes
- `/api/tickets/*` : Gestion des billets

Documentation détaillée des endpoints à venir avec Swagger/OpenAPI.

## 🚀 Déploiement

### Environnement de développement

```bash
# Installation
npm install

# Lancement de la base de données
docker compose up -d

# Démarrage du frontend et du backend
npm run dev
```

### Variables d'Environnement

- `PORT`: Port du serveur (défaut: 3000)
- `DATABASE_URL`: URL de connexion PostgreSQL
- `JWT_SECRET`: Clé secrète pour JWT
- `JWT_EXPIRES_IN`: Durée de validité des tokens

### Base de données

PostgreSQL via Docker :

- User: jo2024
- Database: jo2024
- Port: 5432

## 📈 Monitoring

- Logs applicatifs via Winston
- Monitoring des performances avec Sentry (à voir si possible)
- Métriques de base de données (à voir si possible)

## 🔄 Workflow de Développement

1. Développement en TDD
2. Review de code via codeRabit
3. Tests automatisés dans la CI
4. Déploiement automatique sur Heroku

## Génération de la clé finale (finalKey) des tickets

Chaque ticket possède une clé unique `finalKey` générée ainsi :

- `finalKey = SHA-256(user.key1 + ':' + key2 + ':' + orderItem.id + ':' + idx)`
  - `user.key1` : clé unique de l'utilisateur
  - `key2` : clé unique de la commande
  - `orderItem.id` : identifiant unique de l'item de commande
  - `idx` : index du ticket dans l'item (pour gérer les quantités)

Cela garantit l'unicité de chaque ticket, même pour plusieurs tickets sur la même commande/offre.

**Référence :** voir `orders.service.ts` (création des tickets)
