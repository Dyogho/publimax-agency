/*
  Warnings:

  - A unique constraint covering the columns `[supabaseId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "deliveryUrl" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "supabaseId" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_supabaseId_key" ON "Admin"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_supabaseId_key" ON "TeamMember"("supabaseId");
