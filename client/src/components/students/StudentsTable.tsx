import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import type { StudentUiItem } from "../../services/studentService";

export function StudentsTable({
  items,
  onDelete,
  deletingId,
}: {
  items: StudentUiItem[];
  onDelete: (id: string) => void;
  deletingId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">{s.data.fullName}</td>
                <td className="px-4 py-3 text-slate-700">{s.data.email}</td>
                <td className="px-4 py-3 text-slate-700">{s.data.phoneNumber}</td>
                <td className="px-4 py-3 text-slate-700">{s.data.courseEnrolled}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/students/${s.id}/edit`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      className="px-3 py-2 text-xs"
                      isLoading={deletingId === s.id}
                      onClick={() => onDelete(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

