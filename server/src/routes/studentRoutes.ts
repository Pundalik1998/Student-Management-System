import { Router } from "express";
import {
  deleteStudentById,
  getStudents,
  postRegister,
  putStudent,
} from "../controllers/studentController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  registerStudentEncryptedSchema,
  updateStudentEncryptedSchema,
} from "../validations/studentValidation.js";

export const studentRoutes = Router();

studentRoutes.post("/register", requireAuth, validate(registerStudentEncryptedSchema), postRegister);
studentRoutes.get("/students", requireAuth, getStudents);
studentRoutes.put("/student/:id", requireAuth, validate(updateStudentEncryptedSchema), putStudent);
studentRoutes.delete("/student/:id", requireAuth, deleteStudentById);

