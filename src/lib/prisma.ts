import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

// Prevent multiple PrismaClient instances in dev (Next.js hot reloading)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const sqlite = new Database("dev.db");
const adapter = new PrismaBetterSqlite3({ url: "dev.db" });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
