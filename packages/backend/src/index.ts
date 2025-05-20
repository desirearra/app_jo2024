import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API e-billets JO 2024 opérationnelle" });
});

// Gestion des erreurs globale
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Une erreur interne est survenue",
    });
  }
);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
