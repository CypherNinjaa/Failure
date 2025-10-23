-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalFeature" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusStat" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementMetric" (
    "id" SERIAL NOT NULL,
    "metric" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchievementMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAchievement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "winners" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Facility_displayOrder_idx" ON "Facility"("displayOrder");

-- CreateIndex
CREATE INDEX "Facility_isActive_idx" ON "Facility"("isActive");

-- CreateIndex
CREATE INDEX "AdditionalFeature_displayOrder_idx" ON "AdditionalFeature"("displayOrder");

-- CreateIndex
CREATE INDEX "AdditionalFeature_isActive_idx" ON "AdditionalFeature"("isActive");

-- CreateIndex
CREATE INDEX "CampusStat_displayOrder_idx" ON "CampusStat"("displayOrder");

-- CreateIndex
CREATE INDEX "CampusStat_isActive_idx" ON "CampusStat"("isActive");

-- CreateIndex
CREATE INDEX "Award_year_idx" ON "Award"("year");

-- CreateIndex
CREATE INDEX "Award_category_idx" ON "Award"("category");

-- CreateIndex
CREATE INDEX "Award_displayOrder_idx" ON "Award"("displayOrder");

-- CreateIndex
CREATE INDEX "Award_isActive_idx" ON "Award"("isActive");

-- CreateIndex
CREATE INDEX "AchievementMetric_displayOrder_idx" ON "AchievementMetric"("displayOrder");

-- CreateIndex
CREATE INDEX "AchievementMetric_isActive_idx" ON "AchievementMetric"("isActive");

-- CreateIndex
CREATE INDEX "StudentAchievement_year_idx" ON "StudentAchievement"("year");

-- CreateIndex
CREATE INDEX "StudentAchievement_displayOrder_idx" ON "StudentAchievement"("displayOrder");

-- CreateIndex
CREATE INDEX "StudentAchievement_isActive_idx" ON "StudentAchievement"("isActive");
