-- CreateEnum
CREATE TYPE "GasType" AS ENUM ('regular', 'premium', 'diesel');

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "cre_id" TEXT NOT NULL,
    "location" TEXT[],

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "type" "GasType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "place_id" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlaceToPrice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlaceToPrice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_place_id_key" ON "Place"("place_id");

-- CreateIndex
CREATE INDEX "_PlaceToPrice_B_index" ON "_PlaceToPrice"("B");

-- AddForeignKey
ALTER TABLE "_PlaceToPrice" ADD CONSTRAINT "_PlaceToPrice_A_fkey" FOREIGN KEY ("A") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToPrice" ADD CONSTRAINT "_PlaceToPrice_B_fkey" FOREIGN KEY ("B") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
