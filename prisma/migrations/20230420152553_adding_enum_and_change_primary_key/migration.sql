/*
  Warnings:

  - The primary key for the `RolesOnModules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RolesOnModules` table. All the data in the column will be lost.
  - You are about to drop the column `permission` on the `RolesOnModules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RolesOnModules" DROP CONSTRAINT "RolesOnModules_pkey",
DROP COLUMN "id",
DROP COLUMN "permission",
ADD COLUMN     "permissions" "Permission"[],
ADD CONSTRAINT "RolesOnModules_pkey" PRIMARY KEY ("roleId", "moduleId");
