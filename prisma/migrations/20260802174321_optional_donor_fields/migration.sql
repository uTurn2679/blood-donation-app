-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DonorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "location" TEXT,
    "department" TEXT,
    "session" TEXT,
    "lastDonation" DATETIME,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DonorProfile" ("bloodGroup", "createdAt", "id", "isAvailable", "lastDonation", "location", "updatedAt", "userId") SELECT "bloodGroup", "createdAt", "id", "isAvailable", "lastDonation", "location", "updatedAt", "userId" FROM "DonorProfile";
DROP TABLE "DonorProfile";
ALTER TABLE "new_DonorProfile" RENAME TO "DonorProfile";
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
