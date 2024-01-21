/*
  Warnings:

  - You are about to drop the column `quanity` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quanity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
