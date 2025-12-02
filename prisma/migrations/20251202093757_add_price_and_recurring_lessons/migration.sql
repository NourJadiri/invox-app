-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "notes" TEXT,
    "price" REAL,
    "recurrent" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,
    "recurringLessonId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lesson_recurringLessonId_fkey" FOREIGN KEY ("recurringLessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("createdAt", "end", "id", "notes", "start", "studentId", "title", "updatedAt") SELECT "createdAt", "end", "id", "notes", "start", "studentId", "title", "updatedAt" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
