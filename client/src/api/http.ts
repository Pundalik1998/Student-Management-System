import axios from "axios";

function requiredEnv(name: string): string {
  const v = import.meta.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v as string;
}

export const http = axios.create({
  baseURL: requiredEnv("VITE_API_BASE_URL"),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

