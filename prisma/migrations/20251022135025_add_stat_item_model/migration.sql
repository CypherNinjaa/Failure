-- CreateTable
CREATE TABLE "StatItem" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatItem_isActive_idx" ON "StatItem"("isActive");

-- CreateIndex
CREATE INDEX "StatItem_displayOrder_idx" ON "StatItem"("displayOrder");
