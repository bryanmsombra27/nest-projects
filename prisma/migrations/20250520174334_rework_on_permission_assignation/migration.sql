/*
  Warnings:

  - You are about to drop the column `module_id` on the `Permisos_submodulos` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `Permisos_submodulos` table. All the data in the column will be lost.
  - Added the required column `module_permission_id` to the `Permisos_submodulos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submodule_id` to the `Permisos_submodulos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Permisos_submodulos" DROP CONSTRAINT "Permisos_submodulos_module_id_fkey";

-- DropForeignKey
ALTER TABLE "Permisos_submodulos" DROP CONSTRAINT "Permisos_submodulos_role_id_fkey";

-- AlterTable
ALTER TABLE "Permisos_submodulos" DROP COLUMN "module_id",
DROP COLUMN "role_id",
ADD COLUMN     "module_permission_id" TEXT NOT NULL,
ADD COLUMN     "submodule_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Permisos_submodulos" ADD CONSTRAINT "Permisos_submodulos_submodule_id_fkey" FOREIGN KEY ("submodule_id") REFERENCES "Submodulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos_submodulos" ADD CONSTRAINT "Permisos_submodulos_module_permission_id_fkey" FOREIGN KEY ("module_permission_id") REFERENCES "Permisos_modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
