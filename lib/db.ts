import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import fs from "fs";
import path from "path";

let ca: string;

if (process.env.NODE_ENV === "development") {
  const caPath = path.join(
    process.cwd(),
    "certificate",
    "aiven.pem"
  );

  ca = fs.readFileSync(caPath, "utf8");
} else {
  ca = process.env.DB_CA || "";

  if (!ca) {
    throw new Error("DB_CA is not defined");
  }

  // If DB_CA contains literal \n characters
  ca = ca.replace(/\\n/g, "\n");
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({
  adapter,
});