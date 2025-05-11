-- CreateTable
CREATE TABLE "Modulos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submodulos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "Submodulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permisos_modulos" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "edit" BOOLEAN NOT NULL,
    "write" BOOLEAN NOT NULL,
    "delete" BOOLEAN NOT NULL,
    "role_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "Permisos_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permisos_submodulos" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "edit" BOOLEAN NOT NULL,
    "write" BOOLEAN NOT NULL,
    "delete" BOOLEAN NOT NULL,
    "role_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "Permisos_submodulos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submodulos" ADD CONSTRAINT "Submodulos_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos_modulos" ADD CONSTRAINT "Permisos_modulos_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos_modulos" ADD CONSTRAINT "Permisos_modulos_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos_submodulos" ADD CONSTRAINT "Permisos_submodulos_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos_submodulos" ADD CONSTRAINT "Permisos_submodulos_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Submodulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
