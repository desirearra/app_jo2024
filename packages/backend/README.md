# Backend – API E-billets JO 2024

## 🚀 Présentation

Ce backend Express/TypeScript gère l’API des e-billets JO 2024 : utilisateurs, offres, authentification JWT, sécurité, tests, documentation interactive.

## ▶️ Lancer le serveur

```bash
yarn workspace @app/backend dev
```

- Serveur par défaut sur [http://localhost:4000](http://localhost:4000)
- Variables d’environnement à configurer dans `.env`

## 📚 Documentation interactive (Swagger UI)

- Accès à la doc interactive : [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- Spec OpenAPI : `packages/backend/swagger.json`
- Endpoints documentés : Auth, Users, Offers (CRUD)

## 🔑 Authentification

- JWT obligatoire sur les routes protégées (users, offers admin)
- Exemple d’en-tête :
  ```http
  Authorization: Bearer <token>
  ```

## 🧪 Exemples d’utilisation API

### Authentification

```http
POST /api/auth/login
{
  "email": "admin@jo.fr",
  "password": "SuperSecret123!"
}
```

### Création d’utilisateur

```http
POST /api/auth/register
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@jo.fr",
  "password": "SuperSecret123!"
}
```

### Liste des offres

```http
GET /api/offers
```

### Création d’offre (admin)

```http
POST /api/offers
Authorization: Bearer <token>
{
  "name": "Offre VIP",
  "description": "Accès VIP JO 2024",
  "price": "199.99",
  "type": "VIP",
  "seats": 5
}
```

## 🛡️ Bonnes pratiques

- Respecter la structure des schémas (voir Swagger UI)
- Toujours utiliser le JWT pour les routes protégées
- Utiliser les statuts HTTP pour gérer les erreurs côté client
- Voir les tests d’intégration pour des exemples complets

## 📝 TODO Backend

- [ ] Tickets (CRUD, tests, doc)
- [ ] Double authentification (2FA)
- [ ] Compléter la doc Swagger (tous endpoints, schémas détaillés)
- [ ] Améliorer la couverture de tests

---
