-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFACode" TEXT,
ADD COLUMN     "twoFAExpiresAt" TIMESTAMP(3);
