import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtUser = {
  sub: string;
  email: string;
  role: "admin";
};

export function generateToken(user: JwtUser) {
  return jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

