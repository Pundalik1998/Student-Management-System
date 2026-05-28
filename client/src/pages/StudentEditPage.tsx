import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StudentFormView } from "../components/forms/StudentForm";
import { useStudents, useUpdateStudent } from "../hooks/useStudents";
import { decryptStudent } from "../services/studentService";
import type { StudentForm } from "../schemas/studentSchemas";

export function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { data, isLoading } = useStudents();
  const upd = useUpdateStudent();

  const initialValues = useMemo(() => {
    const item = (data ?? []).find((x) => x.id === id);
    if (!item) return undefined;
    const dec = decryptStudent(item);
    // password must be re-entered (never displayed)
    return { ...dec.data, password: "" };
  }, [data, id]);

  if (!id) return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Edit Student</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update details; the payload is re-encrypted before saving.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="text-sm text-slate-600">Loading...</div>
        ) : !initialValues ? (
          <div className="text-sm text-slate-600">Student not found.</div>
        ) : (
          <StudentFormView
            initialValues={initialValues}
            submitLabel="Save"
            isSubmitting={upd.isPending}
            onSubmit={async (values: StudentForm) => {
              await upd.mutateAsync({ id, input: values });
              nav("/students");
            }}
          />
        )}
      </div>
    </div>
  );
}

