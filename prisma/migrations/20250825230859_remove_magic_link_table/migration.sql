/*
  Warnings:

  - You are about to drop the `magic_links` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."auth_rate_limits" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 hour';

-- DropTable
DROP TABLE "public"."magic_links";
