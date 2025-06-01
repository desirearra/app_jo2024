# 📍 SITEMAP DE L'APPLICATION JO 2024

## 🗺️ Vue d'ensemble de la navigation (Pages principales)

### 1. 🏠 Accueil (/)

- Hero, explication, événements récents, CTA, footer

### 2. 🎫 Événements (/evenements)

- Filtres, liste, pagination

### 3. 🎯 Détail événement (/evenements/:id)

- Infos, offres liées, ajout panier

### 4. 🛍️ Offres (/offres)

- Filtres, liste, ajout panier

### 5. 🛒 Panier (/panier)

- Liste, modification, validation, commande

### 6. 👤 Authentification

- Connexion (/connexion)
- Inscription (/inscription)
- Mot de passe oublié (/mot-de-passe-oublie)
- code de confirmation par email (2FA) : si admin

### 7. 📱 Compte utilisateur (/compte)

- Dashboard, billets, commandes

### 8. 👑 Admin (/admin)

- Dashboard, gestion événements, offres, commandes, billets, utilisateurs

---

## 🗂️ Structure technique (dossiers clés)

```
app_jo2024/
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── contexts/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── public/
│   └── backend/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── types/
│       │   └── utils/
│       └── prisma/
├── docker-compose.yml
├── package.json
├── readme.md
├── sitemap.md
└── ...
```

---

## 🔗 Navigation et liens globaux

- Header sur toutes les pages
- Footer (liens légaux, réseaux sociaux)
- Fil d'Ariane sur pages internes
- Menu utilisateur connecté
- Menu admin (si admin)

---

## 📝 Notes

- Les pages sont typées, sécurisées, et accessibles.
- Les routes API sont sous `/api/*` (auth, users, events, offers, orders, tickets).
- L'espace admin permet le CRUD et la gestion avancée de toutes les entités.
- Le sitemap est aligné avec la structure technique et la navigation réelle du projet.
