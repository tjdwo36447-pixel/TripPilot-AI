-- AlterTable
ALTER TABLE "public"."Flight" ADD COLUMN     "arrivalAt" TIMESTAMP(3),
ADD COLUMN     "departureAt" TIMESTAMP(3),
ADD COLUMN     "externalOfferId" TEXT,
ADD COLUMN     "provider" TEXT;
