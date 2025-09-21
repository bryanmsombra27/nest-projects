/*
  Warnings:

  - A unique constraint covering the columns `[place_id]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Price_place_id_key" ON "public"."Price"("place_id");
