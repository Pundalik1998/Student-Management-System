import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { loginSchema, type LoginForm } from "../schemas/authSchemas";
import { login } from "../services/authService";
import { useAuth } from "../services/authContext";

export function LoginPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="min-h-full">
      <div className="mx-auto flex min-h-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage student records.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await login(values.email, values.password);
                await refresh();
                nav("/students", { replace: true });
              } catch (e) {
                setError("password", {
                  type: "server",
                  message: "Invalid email or password",
                });
              }
            })}
          >
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Tip: set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in
            <code>server/.env</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

