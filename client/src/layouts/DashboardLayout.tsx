import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { TopNav } from "../components/layout/TopNav";

export function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full">
      <TopNav onMenu={() => setOpen(true)} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[256px_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile drawer */}
        {open ? (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

