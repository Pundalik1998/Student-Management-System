export type Gender = "male" | "female" | "other";

export type StudentPlain = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  address: string;
  courseEnrolled: string;
  password: string;
};

export type StudentPlainStored = Omit<StudentPlain, "password"> & {
  passwordHash: string;
};

