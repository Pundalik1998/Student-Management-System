import mongoose, { type InferSchemaType } from "mongoose";
import type { AesEncryptedPayload } from "../utils/crypto.js";

const encryptedSchema = new mongoose.Schema<AesEncryptedPayload>(
  {
    ct: { type: String, required: true },
    iv: { type: String, required: true },
    s: { type: String, required: true },
  },
  { _id: false },
);

const studentSchema = new mongoose.Schema(
  {
    encryptedData: { type: encryptedSchema, required: true },
    // supports lookups/search without decrypting DB payload
    emailHash: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

export type StudentDoc = InferSchemaType<typeof studentSchema>;

export const StudentModel =
  (mongoose.models.Student as mongoose.Model<StudentDoc>) ||
  mongoose.model<StudentDoc>("Student", studentSchema);

