-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "AlbumCategory" AS ENUM ('EVENTS', 'SPORTS', 'ACADEMICS', 'CULTURAL', 'ACHIEVEMENTS', 'TESTIMONIALS');

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" SERIAL NOT NULL,
    "type" "AlbumType" NOT NULL,
    "src" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AlbumCategory" NOT NULL,
    "eventDate" TIMESTAMP(3),
    "photographer" TEXT,
    "duration" TEXT,
    "thumbnail" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryAlbum_category_idx" ON "GalleryAlbum"("category");

-- CreateIndex
CREATE INDEX "GalleryAlbum_isActive_idx" ON "GalleryAlbum"("isActive");

-- CreateIndex
CREATE INDEX "GalleryAlbum_displayOrder_idx" ON "GalleryAlbum"("displayOrder");

-- CreateIndex
CREATE INDEX "GalleryAlbum_featured_idx" ON "GalleryAlbum"("featured");

-- CreateIndex
CREATE INDEX "GalleryAlbum_type_idx" ON "GalleryAlbum"("type");
