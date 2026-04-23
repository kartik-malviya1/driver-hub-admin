import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginAdmin } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem("admin_token");
    if (token) {
      throw redirect({ to: "/overview" });
    }
  },
  head: () => ({
    meta: [
      { title: "Login — Sawari Auto Admin" },
      {
        name: "description",
        content: "Secure login for the Sawari Auto ride-sharing admin console.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await loginAdmin(data.email, data.password);
      localStorage.setItem("admin_token", result.token);
      localStorage.setItem("admin_user", JSON.stringify(result.admin));
      toast.success("Login successful! Welcome back.");
      navigate({ to: "/overview" });
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group transition-all duration-500 hover:border-primary/40">
            <ShieldCheck className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">
            Sawari Admin
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access the fleet management console.
          </p>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-primary" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="admin@sawariauto.com"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-400" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-primary/80 hover:text-primary transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-primary" />
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500">
          Not an administrator?{" "}
          <a href="#" className="text-zinc-400 hover:text-white transition-colors">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
