-- CreateTable
CREATE TABLE "JobPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workLocation" TEXT NOT NULL,
    "jobTypes" TEXT[],
    "jobTitles" TEXT[],
    "seniority" TEXT,
    "languages" TEXT[],
    "includeKeywords" TEXT[],
    "excludeKeywords" TEXT[],
    "excludeCompanies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobPreferences_userId_key" ON "JobPreferences"("userId");

-- AddForeignKey
ALTER TABLE "JobPreferences" ADD CONSTRAINT "JobPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
