-- CreateTable
CREATE TABLE "Module" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolesOnModules" (
    "roleId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "RolesOnModules_pkey" PRIMARY KEY ("roleId","moduleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- AddForeignKey
ALTER TABLE "RolesOnModules" ADD CONSTRAINT "RolesOnModules_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesOnModules" ADD CONSTRAINT "RolesOnModules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
