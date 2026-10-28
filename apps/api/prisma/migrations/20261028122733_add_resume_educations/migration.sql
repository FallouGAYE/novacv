-- CreateTable
CREATE TABLE "resume_educations" (
    "id" UUID NOT NULL,
    "resumeId" UUID NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "city" TEXT,
    "country" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_educations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_educations_resumeId_idx" ON "resume_educations"("resumeId");

-- CreateIndex
CREATE INDEX "resume_educations_resumeId_position_idx" ON "resume_educations"("resumeId", "position");

-- AddForeignKey
ALTER TABLE "resume_educations" ADD CONSTRAINT "resume_educations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
