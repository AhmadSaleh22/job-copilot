/*
  Warnings:

  - The `workLocation` column on the `JobPreferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "JobPreferences" DROP COLUMN "workLocation",
ADD COLUMN     "workLocation" TEXT[];
