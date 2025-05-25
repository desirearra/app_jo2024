// Configuration des variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import { config } from './config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API e-billets JO 2024 opérationnelle' });
});

// Gestionnaire d'erreurs global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // En développement, on peut afficher plus de détails sur l'erreur
  const isDev = config.nodeEnv === 'development';

  // Logger l'erreur (utiliser un vrai logger en production)
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error('Erreur serveur:', err);
  }
  res.status(500).json({
    status: 'error',
    message: 'Une erreur interne est survenue',
    ...(isDev && { stack: err.stack, details: err.message }),
  });
});

// Démarrage du serveur
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Serveur démarré sur le port ${config.port}`);
});
