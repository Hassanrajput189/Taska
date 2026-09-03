import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import path from "path";
import fs from "fs";

const filePath = process.env.DB_CF;

if (!filePath) {
  throw new Error("DB_CF is not defined");
}



const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(filePath),
  },
});

export const prisma = new PrismaClient({
  adapter,
});