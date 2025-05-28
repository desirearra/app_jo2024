# 🚀 Intégration Frontend ↔ Backend – Affichage dynamique des données

## Objectif

Cette Pull Request vise à connecter le frontend React/Vite au backend Node/Prisma, en affichant dynamiquement les données issues du seed (offres, événements, utilisateurs, etc.) et en supprimant progressivement les mocks côté frontend.

---

## ✨ Points clés de la PR

- Connexion des pages et composants frontend aux endpoints API réels
- Utilisation des hooks/services pour récupérer les données seed (offres, événements, etc.)
- Suppression progressive des données mockées
- Gestion des états de chargement et d’erreur (UX)
- Premiers CRUD fonctionnels (lecture, création, édition, suppression)
- Tests d’intégration (si possible)

---

## 🧪 Vérifications

- [ ] Les données affichées côté frontend proviennent bien du backend (seed)
- [ ] Les mocks sont supprimés ou désactivés
- [ ] Les états de loading/erreur sont gérés
- [ ] Les opérations CRUD fonctionnent (au moins en lecture)
- [ ] Les tests passent (unitaires et d’intégration)

---

## 📚 Instructions de test

- Lancer le backend avec la base seedée
- Lancer le frontend sur la branche d’intégration
- Vérifier l’affichage dynamique sur les pages concernées

---

## 📝 À faire après merge

- Mettre à jour la documentation Notion
- Communiquer à l’équipe pour validation

---

**Ready for review & merge! 🚀**
