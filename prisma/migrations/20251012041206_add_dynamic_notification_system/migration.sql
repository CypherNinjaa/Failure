/*
  Warnings:

  - The values [PENDING,SENT,FAILED] on the enum `NotificationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `relatedFeeId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `relatedPaymentId` on the `Notification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationGroup" AS ENUM ('FINANCE', 'ACADEMICS', 'ATTENDANCE', 'ACHIEVEMENT', 'EVENTS', 'ANNOUNCEMENTS', 'COMMUNICATION', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationFrequency" AS ENUM ('INSTANT', 'DAILY_DIGEST', 'WEEKLY_DIGEST');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SUCCESS', 'FAILED', 'PARTIALLY_SENT', 'QUEUED');

-- AlterEnum
ALTER TYPE "NotificationRecipient" ADD VALUE 'ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationStatus_new" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');
ALTER TABLE "public"."Notification" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Notification" ALTER COLUMN "status" TYPE "NotificationStatus_new" USING ("status"::text::"NotificationStatus_new");
ALTER TYPE "NotificationStatus" RENAME TO "NotificationStatus_old";
ALTER TYPE "NotificationStatus_new" RENAME TO "NotificationStatus";
DROP TYPE "public"."NotificationStatus_old";
ALTER TABLE "Notification" ALTER COLUMN "status" SET DEFAULT 'UNREAD';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'EXAM_SCHEDULED';
ALTER TYPE "NotificationType" ADD VALUE 'RESULT_PUBLISHED';
ALTER TYPE "NotificationType" ADD VALUE 'ASSIGNMENT_DUE';
ALTER TYPE "NotificationType" ADD VALUE 'ATTENDANCE_ALERT';
ALTER TYPE "NotificationType" ADD VALUE 'BADGE_EARNED';
ALTER TYPE "NotificationType" ADD VALUE 'ANNOUNCEMENT';
ALTER TYPE "NotificationType" ADD VALUE 'EVENT_REMINDER';

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "relatedFeeId",
DROP COLUMN "relatedPaymentId",
ADD COLUMN     "categoryKey" TEXT,
ADD COLUMN     "channels" JSONB,
ADD COLUMN     "digestSentAt" TIMESTAMP(3),
ADD COLUMN     "isDigest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isForced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "readAt" TIMESTAMP(3),
ALTER COLUMN "type" SET DEFAULT 'GENERAL',
ALTER COLUMN "status" SET DEFAULT 'UNREAD';

-- CreateTable
CREATE TABLE "NotificationCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "NotificationGroup" NOT NULL,
    "icon" TEXT,
    "defaultEnabled" BOOLEAN NOT NULL DEFAULT true,
    "applicableRoles" JSONB NOT NULL,
    "supportedChannels" JSONB NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "channels" JSONB NOT NULL,
    "frequency" "NotificationFrequency" NOT NULL DEFAULT 'INSTANT',
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT,
    "userId" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channels" JSONB NOT NULL,
    "deliveryStatus" "DeliveryStatus" NOT NULL,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationCategory_key_key" ON "NotificationCategory"("key");

-- CreateIndex
CREATE INDEX "NotificationCategory_category_idx" ON "NotificationCategory"("category");

-- CreateIndex
CREATE INDEX "NotificationCategory_isActive_idx" ON "NotificationCategory"("isActive");

-- CreateIndex
CREATE INDEX "UserNotificationPreference_userId_idx" ON "UserNotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "UserNotificationPreference_categoryKey_idx" ON "UserNotificationPreference"("categoryKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationPreference_userId_categoryKey_key" ON "UserNotificationPreference"("userId", "categoryKey");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_isActive_idx" ON "PushSubscription"("isActive");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_idx" ON "NotificationLog"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_categoryKey_idx" ON "NotificationLog"("categoryKey");

-- CreateIndex
CREATE INDEX "NotificationLog_deliveryStatus_idx" ON "NotificationLog"("deliveryStatus");

-- CreateIndex
CREATE INDEX "NotificationLog_sentAt_idx" ON "NotificationLog"("sentAt");

-- CreateIndex
CREATE INDEX "Notification_categoryKey_idx" ON "Notification"("categoryKey");

-- CreateIndex
CREATE INDEX "Notification_isDigest_idx" ON "Notification"("isDigest");

-- AddForeignKey
ALTER TABLE "UserNotificationPreference" ADD CONSTRAINT "UserNotificationPreference_categoryKey_fkey" FOREIGN KEY ("categoryKey") REFERENCES "NotificationCategory"("key") ON DELETE CASCADE ON UPDATE CASCADE;
