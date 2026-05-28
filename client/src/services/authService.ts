import { http } from "../api/http";

export async function login(email: string, password: string) {
  const { data } = await http.post<{ success: boolean; message: string }>(
    "/api/auth/login",
    {
    email,
    password,
    },
  );
  return data;
}

export async function logout() {
  await http.post("/api/auth/logout");
}

export async function me() {
  const { data } = await http.get<{ user: { id: string; email: string; role: string } }>(
    "/api/auth/me",
  );
  return data.user;
}

