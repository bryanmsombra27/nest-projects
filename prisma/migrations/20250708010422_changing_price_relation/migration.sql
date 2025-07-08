-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_place_id_fkey";

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Place"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
