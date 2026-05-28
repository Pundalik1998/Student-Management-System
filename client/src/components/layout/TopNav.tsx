import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext";

export function TopNav({ onMenu }: { onMenu: () => void }) {
  const nav = useNavigate();
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 md:hidden"
          >
            Menu
          </button>
          <Link to="/" className="font-semibold text-slate-900">
            Student Management
          </Link>
        </div>
        <button
          onClick={async () => {
            await logout();
            nav("/login", { replace: true });
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

