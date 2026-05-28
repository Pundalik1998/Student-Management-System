import bcrypt from "bcryptjs";
import { StudentModel } from "../models/Student.js";
import { studentCrypto, type AesEncryptedPayload } from "../utils/crypto.js";
import { sha256Hex } from "../utils/hash.js";
import type { StudentPlain, StudentPlainStored } from "../types/student.js";
import { HttpError } from "../utils/httpError.js";

function validatePlainStudent(input: unknown): StudentPlain {
  if (!input || typeof input !== "object") throw new HttpError(400, "Bad input");
  const obj = input as Record<string, unknown>;

  const required = [
    "fullName",
    "email",
    "phoneNumber",
    "dateOfBirth",
    "gender",
    "address",
    "courseEnrolled",
    "password",
  ] as const;
  for (const k of required) {
    if (typeof obj[k] !== "string" || !obj[k]) {
      throw new HttpError(400, `Missing field: ${k}`);
    }
  }
  const gender = obj.gender as string;
  if (!["male", "female", "other"].includes(gender)) {
    throw new HttpError(400, "Invalid gender");
  }
  const email = String(obj.email).toLowerCase();
  if (!email.includes("@")) throw new HttpError(400, "Invalid email");

  const password = String(obj.password);
  if (password.length < 8) throw new HttpError(400, "Password too short");

  return {
    fullName: String(obj.fullName),
    email,
    phoneNumber: String(obj.phoneNumber),
    dateOfBirth: String(obj.dateOfBirth),
    gender: gender as StudentPlain["gender"],
    address: String(obj.address),
    courseEnrolled: String(obj.courseEnrolled),
    password,
  };
}

function stripForClient(plainStored: StudentPlainStored) {
  // client never needs password or hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = plainStored;
  return rest;
}

export async function createStudentFromEncryptedLevel1(
  encryptedLevel1: AesEncryptedPayload,
) {
  const plain = validatePlainStudent(
    studentCrypto.decryptLevel1FromClient(encryptedLevel1),
  );
  const emailHash = sha256Hex(plain.email);

  const exists = await StudentModel.findOne({ emailHash }).lean();
  if (exists) throw new HttpError(409, "Student with this email already exists");

  const passwordHash = await bcrypt.hash(plain.password, 12);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...restPlain } = plain;
  const stored: StudentPlainStored = { ...restPlain, passwordHash };
  const encryptedForDb = studentCrypto.encryptForDbFromPlain(stored);

  const created = await StudentModel.create({
    encryptedData: encryptedForDb,
    emailHash,
  });

  const level1ForClient = studentCrypto.encryptLevel1ForClientFromPlain(
    stripForClient(stored),
  );

  return {
    id: created._id.toString(),
    encryptedData: level1ForClient,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
}

export async function listStudentsForClient() {
  const students = await StudentModel.find().sort({ createdAt: -1 });
  return students.map((s) => {
    const plain = studentCrypto.decryptFromDbToPlain(s.encryptedData) as Record<
      string,
      unknown
    >;
    const level1 = studentCrypto.encryptLevel1ForClientFromPlain(plain);
    return {
      id: s._id.toString(),
      encryptedData: level1,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  });
}

export async function updateStudentFromEncryptedLevel1(
  id: string,
  encryptedLevel1: AesEncryptedPayload,
) {
  const existing = await StudentModel.findById(id);
  if (!existing) throw new HttpError(404, "Student not found");

  const plain = validatePlainStudent(
    studentCrypto.decryptLevel1FromClient(encryptedLevel1),
  );
  const passwordHash = await bcrypt.hash(plain.password, 12);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...restPlain } = plain;
  const stored: StudentPlainStored = { ...restPlain, passwordHash };

  const emailHash = sha256Hex(plain.email);
  const encryptedForDb = studentCrypto.encryptForDbFromPlain(stored);

  existing.encryptedData = encryptedForDb;
  existing.emailHash = emailHash;
  await existing.save();

  const level1ForClient = studentCrypto.encryptLevel1ForClientFromPlain(
    stripForClient(stored),
  );

  return {
    id: existing._id.toString(),
    encryptedData: level1ForClient,
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  };
}

export async function deleteStudent(id: string) {
  const deleted = await StudentModel.findByIdAndDelete(id);
  if (!deleted) throw new HttpError(404, "Student not found");
}

