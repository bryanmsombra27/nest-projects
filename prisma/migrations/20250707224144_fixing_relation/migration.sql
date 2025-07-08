/*
  Warnings:

  - You are about to drop the `_PlaceToPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaceToPrice" DROP CONSTRAINT "_PlaceToPrice_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToPrice" DROP CONSTRAINT "_PlaceToPrice_B_fkey";

-- DropTable
DROP TABLE "_PlaceToPrice";

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
