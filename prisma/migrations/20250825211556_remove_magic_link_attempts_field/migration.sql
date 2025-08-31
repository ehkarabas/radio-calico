/*
  Warnings:

  - You are about to drop the column `attempts` on the `magic_links` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."auth_rate_limits" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 hour';

-- AlterTable
ALTER TABLE "public"."magic_links" DROP COLUMN "attempts";
