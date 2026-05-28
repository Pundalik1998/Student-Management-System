import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition";
const linkActive = "bg-slate-900 text-white";
const linkIdle = "text-slate-700 hover:bg-slate-100";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="h-full w-64 border-r border-slate-200 bg-white">
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Dashboard
        </p>
      </div>
      <nav className="px-3 pb-4">
        <NavLink
          to="/students"
          className={({ isActive }) =>
            [linkBase, isActive ? linkActive : linkIdle].join(" ")
          }
          onClick={onNavigate}
        >
          Students
        </NavLink>
        <NavLink
          to="/students/new"
          className={({ isActive }) =>
            [linkBase, isActive ? linkActive : linkIdle].join(" ")
          }
          onClick={onNavigate}
        >
          Register Student
        </NavLink>
      </nav>
    </aside>
  );
}

