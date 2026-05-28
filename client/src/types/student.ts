export type Gender = "male" | "female" | "other";

export type StudentPlain = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  courseEnrolled: string;
  password: string;
};

export type StudentView = Omit<StudentPlain, "password">;

