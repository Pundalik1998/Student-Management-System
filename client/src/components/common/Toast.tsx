import { useEffect } from "react";

export type ToastData = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastData;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  const styles =
    toast.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : toast.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-slate-200 bg-white text-slate-900";

  return (
    <div
      className={[
        "pointer-events-auto w-full max-w-sm rounded-xl border p-3 shadow-sm",
        styles,
      ].join(" ")}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">{toast.message}</p>
        <button
          onClick={() => onClose(toast.id)}
          className="rounded-md px-2 py-1 text-xs hover:bg-black/5"
        >
          Close
        </button>
      </div>
    </div>
  );
}

