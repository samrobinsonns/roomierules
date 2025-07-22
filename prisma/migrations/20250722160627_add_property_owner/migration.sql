/*
  Warnings:

  - Added the required column `ownerId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "ownerId" INTEGER;

-- Set ownerId for all existing properties to landlord1@landlord.com
UPDATE "Property" SET "ownerId" = (SELECT id FROM "User" WHERE email = 'landlord1@landlord.com' LIMIT 1) WHERE "ownerId" IS NULL;

-- Make ownerId NOT NULL
ALTER TABLE "Property" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
