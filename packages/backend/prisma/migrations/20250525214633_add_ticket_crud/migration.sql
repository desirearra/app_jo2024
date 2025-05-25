/*
  Warnings:

  - The values [VALID,BLOCKED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `orderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `offerId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('ACTIVE', 'USED', 'CANCELLED');
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderDate";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "orderId",
DROP COLUMN "usedAt",
ADD COLUMN     "offerId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
