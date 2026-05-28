import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGO_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as NonNullable<
    SignOptions["expiresIn"]
  >,
  // 2-level AES encryption keys (NEVER use for passwords)
  aesKey1: required("AES_KEY_1"),
  aesKey2: required("AES_KEY_2"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  adminEmail: required("ADMIN_EMAIL"),
  adminPassword: required("ADMIN_PASSWORD"),
};

