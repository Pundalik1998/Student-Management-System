import { useNavigate } from "react-router-dom";
import { StudentFormView } from "../components/forms/StudentForm";
import { useCreateStudent } from "../hooks/useStudents";
import type { StudentForm } from "../schemas/studentSchemas";

export function StudentCreatePage() {
  const nav = useNavigate();
  const create = useCreateStudent();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Register Student</h1>
        <p className="mt-1 text-sm text-slate-600">
          Student details are encrypted in the browser before being sent to the server.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <StudentFormView
          submitLabel="Create"
          isSubmitting={create.isPending}
          onSubmit={async (values: StudentForm) => {
            await create.mutateAsync(values);
            nav("/students");
          }}
        />
      </div>
    </div>
  );
}

