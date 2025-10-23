-- CreateTable
CREATE TABLE "SupportStaff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "education" TEXT,
    "experience" TEXT,
    "specialization" TEXT,
    "photo" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportStaff_department_idx" ON "SupportStaff"("department");

-- CreateIndex
CREATE INDEX "SupportStaff_displayOrder_idx" ON "SupportStaff"("displayOrder");

-- CreateIndex
CREATE INDEX "SupportStaff_isActive_idx" ON "SupportStaff"("isActive");
