import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400 disabled:bg-slate-400",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300 disabled:text-slate-400",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-300 disabled:bg-rose-300",
};

export function Button({
  className = "",
  variant = "primary",
  isLoading,
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        styles[variant],
        className,
      ].join(" ")}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

