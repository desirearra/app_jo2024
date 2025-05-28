// Configuration des variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { config } from './config';

// Démarrage du serveur
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Serveur démarré sur le port ${config.port}`);
});
