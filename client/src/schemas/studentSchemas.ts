import { z } from "zod";

export const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(1, "Address is required"),
  courseEnrolled: z.string().min(1, "Course is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type StudentForm = z.infer<typeof studentSchema>;

