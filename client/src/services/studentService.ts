import { http } from "../api/http";
import type { AesEncryptedPayload } from "../types/crypto";
import type { StudentPlain, StudentView } from "../types/student";
import { studentCrypto } from "../utils/crypto";

export type StudentApiItem = {
  id: string;
  encryptedData: AesEncryptedPayload;
  createdAt: string;
  updatedAt: string;
};

export type StudentUiItem = {
  id: string;
  data: StudentView;
  createdAt: string;
  updatedAt: string;
};

export async function createStudent(input: StudentPlain) {
  const encryptedData = studentCrypto.encryptLevel1(input);
  const { data } = await http.post<StudentApiItem>("/api/register", { encryptedData });
  return data;
}

export async function updateStudent(id: string, input: StudentPlain) {
  const encryptedData = studentCrypto.encryptLevel1(input);
  const { data } = await http.put<StudentApiItem>(`/api/student/${id}`, { encryptedData });
  return data;
}

export async function deleteStudent(id: string) {
  await http.delete(`/api/student/${id}`);
}

export async function listStudents() {
  const { data } = await http.get<StudentApiItem[]>("/api/students");
  return data;
}

export function decryptStudent(item: StudentApiItem): StudentUiItem {
  const data = studentCrypto.decryptLevel1<StudentView>(item.encryptedData);
  return { id: item.id, data, createdAt: item.createdAt, updatedAt: item.updatedAt };
}

