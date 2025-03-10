/*
  Warnings:

  - You are about to drop the column `warehouseId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalItems" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "warehouseId";

-- CreateTable
CREATE TABLE "ProductAssignation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "ProductAssignation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockStore" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "commit" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" TEXT NOT NULL,

    CONSTRAINT "StockStore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssignation_productId_key" ON "ProductAssignation"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssignation_warehouseId_key" ON "ProductAssignation"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "StockStore_productId_key" ON "StockStore"("productId");

-- AddForeignKey
ALTER TABLE "ProductAssignation" ADD CONSTRAINT "ProductAssignation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAssignation" ADD CONSTRAINT "ProductAssignation_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockStore" ADD CONSTRAINT "StockStore_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
