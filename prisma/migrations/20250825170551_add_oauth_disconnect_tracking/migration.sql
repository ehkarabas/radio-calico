-- AlterTable
ALTER TABLE "public"."accounts" ADD COLUMN     "disconnectedAt" TIMESTAMP(3),
ADD COLUMN     "reconnectRequired" BOOLEAN NOT NULL DEFAULT false;
