import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { config } from './config';

// Configuration des variables d'environnement
dotenv.config();

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
  res.status(500).json({
    status: 'error',
    message: 'Une erreur interne est survenue',
  });
});

// Démarrage du serveur
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Serveur démarré sur le port ${config.port}`);
});
