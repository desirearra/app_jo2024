/*
  Warnings:

  - You are about to drop the column `offerId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderItemId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `places` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_offerId_fkey";

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "places" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "offerId";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "orderItemId" UUID NOT NULL,
ADD COLUMN     "places" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "offerId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
