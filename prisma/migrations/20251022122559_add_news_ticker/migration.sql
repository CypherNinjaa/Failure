-- CreateEnum
CREATE TYPE "NewsTickerType" AS ENUM ('EVENT', 'FACILITY', 'ACHIEVEMENT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "NewsTickerItem" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "NewsTickerType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsTickerItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsTickerItem_isActive_idx" ON "NewsTickerItem"("isActive");

-- CreateIndex
CREATE INDEX "NewsTickerItem_displayOrder_idx" ON "NewsTickerItem"("displayOrder");
