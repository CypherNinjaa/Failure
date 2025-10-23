-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrincipalInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageAudio" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "experience" TEXT,
    "specialization" TEXT,
    "philosophies" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrincipalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadershipMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'leadership',
    "experience" TEXT,
    "education" TEXT,
    "photo" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "specialization" TEXT,
    "achievements" JSONB,
    "bio" TEXT,
    "quote" TEXT,
    "linkedIn" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadershipMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineEvent_displayOrder_idx" ON "TimelineEvent"("displayOrder");

-- CreateIndex
CREATE INDEX "TimelineEvent_isActive_idx" ON "TimelineEvent"("isActive");

-- CreateIndex
CREATE INDEX "PrincipalInfo_isActive_idx" ON "PrincipalInfo"("isActive");

-- CreateIndex
CREATE INDEX "LeadershipMember_category_idx" ON "LeadershipMember"("category");

-- CreateIndex
CREATE INDEX "LeadershipMember_displayOrder_idx" ON "LeadershipMember"("displayOrder");

-- CreateIndex
CREATE INDEX "LeadershipMember_isActive_idx" ON "LeadershipMember"("isActive");
