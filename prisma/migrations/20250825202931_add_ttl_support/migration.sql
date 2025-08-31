-- AlterTable
ALTER TABLE "public"."auth_rate_limits" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 hour';

-- CreateIndex
CREATE INDEX "auth_rate_limits_expiresAt_idx" ON "public"."auth_rate_limits"("expiresAt");
