import type { Request, Response } from "express";
import {
  createStudentFromEncryptedLevel1,
  deleteStudent,
  listStudentsForClient,
  updateStudentFromEncryptedLevel1,
} from "../services/studentService.js";
import type { AesEncryptedPayload } from "../utils/crypto.js";

export async function postRegister(req: Request, res: Response) {
  const { encryptedData } = req.body as { encryptedData: AesEncryptedPayload };
  const created = await createStudentFromEncryptedLevel1(encryptedData);
  return res.status(201).json(created);
}

export async function getStudents(_req: Request, res: Response) {
  const students = await listStudentsForClient();
  return res.json(students);
}

export async function putStudent(req: Request, res: Response) {
  const { id } = req.params;
  const { encryptedData } = req.body as { encryptedData: AesEncryptedPayload };
  const updated = await updateStudentFromEncryptedLevel1(String(id), encryptedData);
  return res.json(updated);
}

export async function deleteStudentById(req: Request, res: Response) {
  const { id } = req.params;
  await deleteStudent(String(id));
  return res.status(204).send();
}

