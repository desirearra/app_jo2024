-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OffreType" AS ENUM ('SOLO', 'DUO', 'FAMILLE');

-- CreateEnum
CREATE TYPE "CommandeStatut" AS ENUM ('EN_ATTENTE', 'PAYEE', 'ANNULEE', 'REMBOURSEE');

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "cle1" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- Create trigger for utilisateurs
CREATE TRIGGER update_utilisateurs_updated_at
    BEFORE UPDATE ON "utilisateurs"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- CreateTable
CREATE TABLE "offres" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,
    "type" "OffreType" NOT NULL,
    "places" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offres_pkey" PRIMARY KEY ("id")
);

-- Create trigger for offres
CREATE TRIGGER update_offres_updated_at
    BEFORE UPDATE ON "offres"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- CreateTable
CREATE TABLE "commandes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "utilisateurId" UUID NOT NULL,
    "offreId" UUID NOT NULL,
    "statut" "CommandeStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "typeTransaction" TEXT,
    "idTransaction" TEXT,
    "montantTotal" DECIMAL(10,2) NOT NULL,
    "cle2" TEXT,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commandeId" UUID NOT NULL,
    "qrCode" TEXT NOT NULL,
    "utilise" BOOLEAN NOT NULL DEFAULT false,
    "dateUtilisation" TIMESTAMP(3),
    "cleFinale" TEXT,

    CONSTRAINT "billets_pkey" PRIMARY KEY ("id")
);

-- Create indexes on commandes foreign keys for better performance
CREATE INDEX "commandes_utilisateurId_idx" ON "commandes"("utilisateurId");
CREATE INDEX "commandes_offreId_idx" ON "commandes"("offreId");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "billets_qrCode_key" ON "billets"("qrCode");

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "offres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billets" ADD CONSTRAINT "billets_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
