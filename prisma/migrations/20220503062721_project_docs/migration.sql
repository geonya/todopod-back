/*
  Warnings:

  - Added the required column `projectId` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
