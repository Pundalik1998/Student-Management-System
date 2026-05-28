import { z } from "zod";

const aesPayloadSchema = z.object({
  ct: z.string().min(1),
  iv: z.string().min(1),
  s: z.string().min(1),
});

export const registerStudentEncryptedSchema = z.object({
  encryptedData: aesPayloadSchema,
});

export const updateStudentEncryptedSchema = z.object({
  encryptedData: aesPayloadSchema,
});

