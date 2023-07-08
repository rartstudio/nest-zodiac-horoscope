-- CreateTable
CREATE TABLE "Patient" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phoneNumber" VARCHAR(25) NOT NULL,
    "countryCode" VARCHAR(25) NOT NULL,
    "profileUrl" TEXT,
    "placeOfBirth" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdcreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
