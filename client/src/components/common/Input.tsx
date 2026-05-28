import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", ...rest }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...rest}
        className={[
          "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
            : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
          className,
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

