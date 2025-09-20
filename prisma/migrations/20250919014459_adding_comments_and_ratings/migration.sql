-- CreateTable
CREATE TABLE "public"."CommentRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gasStationId" TEXT NOT NULL,
    "comment" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentRating_userId_gasStationId_key" ON "public"."CommentRating"("userId", "gasStationId");

-- AddForeignKey
ALTER TABLE "public"."CommentRating" ADD CONSTRAINT "CommentRating_gasStationId_fkey" FOREIGN KEY ("gasStationId") REFERENCES "public"."Place"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
