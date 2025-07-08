/*
  Warnings:

  - You are about to drop the column `price` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Price` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "price",
DROP COLUMN "type",
ADD COLUMN     "diesel" DOUBLE PRECISION,
ADD COLUMN     "premium" DOUBLE PRECISION,
ADD COLUMN     "regular" DOUBLE PRECISION;

-- DropEnum
DROP TYPE "GasType";
