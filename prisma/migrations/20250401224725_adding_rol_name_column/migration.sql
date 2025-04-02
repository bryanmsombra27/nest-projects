/*
  Warnings:

  - Added the required column `name` to the `Rol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rol" ADD COLUMN     "name" TEXT NOT NULL;
