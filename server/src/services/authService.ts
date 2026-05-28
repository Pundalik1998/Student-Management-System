import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";

export async function ensureAdminUser() {
  const adminEmail = env.adminEmail.toLowerCase();
  const existing = await UserModel.findOne({ email: adminEmail }).lean();
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await UserModel.create({
    email: adminEmail,
    passwordHash,
    role: "admin",
  });
}

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: "admin" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  return { token };
}

