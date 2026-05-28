import { Route, Routes, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "../pages/LoginPage";
import { StudentsListPage } from "../pages/StudentsListPage";
import { StudentCreatePage } from "../pages/StudentCreatePage";
import { StudentEditPage } from "../pages/StudentEditPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsListPage />} />
          <Route path="/students/new" element={<StudentCreatePage />} />
          <Route path="/students/:id/edit" element={<StudentEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
}

