-- DropForeignKey
ALTER TABLE "Submodulos" DROP CONSTRAINT "Submodulos_module_id_fkey";

-- AddForeignKey
ALTER TABLE "Submodulos" ADD CONSTRAINT "Submodulos_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
