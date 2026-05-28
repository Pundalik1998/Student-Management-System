import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { studentSchema, type StudentForm } from "../../schemas/studentSchemas";

export function StudentFormView({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  initialValues?: Partial<StudentForm>;
  onSubmit: (values: StudentForm) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialValues as StudentForm | undefined,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => onSubmit(values))}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <Input
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <Select label="Gender" error={errors.gender?.message} {...register("gender")}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input
          label="Course Enrolled"
          error={errors.courseEnrolled?.message}
          {...register("courseEnrolled")}
        />
      </div>

      <Input label="Address" error={errors.address?.message} {...register("address")} />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

