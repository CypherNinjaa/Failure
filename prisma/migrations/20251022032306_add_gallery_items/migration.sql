-- CreateEnum
CREATE TYPE "GalleryItemType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('FACILITY', 'EVENT', 'ACTIVITY', 'ACHIEVEMENT');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "pdfLink" TEXT;

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "type" "GalleryItemType" NOT NULL,
    "src" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "category" "GalleryCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryItem_category_idx" ON "GalleryItem"("category");

-- CreateIndex
CREATE INDEX "GalleryItem_isActive_idx" ON "GalleryItem"("isActive");

-- CreateIndex
CREATE INDEX "GalleryItem_displayOrder_idx" ON "GalleryItem"("displayOrder");
