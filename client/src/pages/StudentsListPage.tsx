import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StudentsTable } from "../components/students/StudentsTable";
import { Input } from "../components/common/Input";
import { Toast } from "../components/common/Toast";
import { useDeleteStudent, useStudents } from "../hooks/useStudents";
import { decryptStudent } from "../services/studentService";
import { useToasts } from "../hooks/useToasts";

export function StudentsListPage() {
  const { data, isLoading, isError, error, refetch } = useStudents();
  const del = useDeleteStudent();
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined);
  const { toasts, push, remove } = useToasts();

  const items = useMemo(() => {
    const decrypted = (data ?? []).map(decryptStudent);
    const s = q.trim().toLowerCase();
    if (!s) return decrypted;
    return decrypted.filter((x) => {
      const hay = `${x.data.fullName} ${x.data.email} ${x.data.phoneNumber} ${x.data.courseEnrolled}`.toLowerCase();
      return hay.includes(s);
    });
  }, [data, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-600">
            Encrypted at rest (server AES level-2) + decrypted in the browser (AES level-1).
          </p>
        </div>
        <Link
          to="/students/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Register
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          label="Search"
          placeholder="Search by name, email, phone, course..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={() => refetch()}
          className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading students...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
          <p className="font-medium">Failed to load students</p>
          <p className="mt-1 opacity-80">{String((error as Error)?.message ?? error)}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-900">No students found</p>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting your search, or register a new student.
          </p>
        </div>
      ) : (
        <StudentsTable
          items={items}
          deletingId={deletingId}
          onDelete={(id) => {
            if (!confirm("Delete this student?")) return;
            setDeletingId(id);
            del.mutate(id, {
              onSuccess: () => push("success", "Student deleted"),
              onError: () => push("error", "Failed to delete student"),
              onSettled: () => setDeletingId(undefined),
            });
          }}
        />
      )}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </div>
  );
}

