import type { Request, Response } from "express";
import { login } from "../services/authService.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import type { JwtUser } from "../middleware/auth.js";

export async function postLogin(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const result = await login(email, password);
  if (!result) return res.status(401).json({ message: "Invalid credentials" });

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ success: true, message: "Login successful" });
}

export async function postLogout(_req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
  });
  return res.json({ success: true });
}

export async function getMe(req: Request, res: Response) {
  const token = req.cookies?.token as string | undefined;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtUser;
    return res.json({ user: { id: payload.sub, email: payload.email, role: payload.role } });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

