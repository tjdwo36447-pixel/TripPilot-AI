-- AlterTable
ALTER TABLE "public"."Reservation" ADD COLUMN     "bookingReference" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "externalReservationId" TEXT,
ADD COLUMN     "provider" TEXT;
