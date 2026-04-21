import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { login } from "@/api/auth.api";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      const { token, user } = res.data.data;

      setAuth(token, user);
      toast.success("Welcome back!");

      if (user.role === "buyer") navigate("/buyer/dashboard");
      else if (user.role === "seller") navigate("/seller/dashboard");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white px-4">
      {/* Glow background (same as dashboard) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Sign in to continue to{" "}
              <span className="text-cyan-400">BidZen</span>
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-white"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-slate-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-white"
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-5">
              Don’t have an account?{" "}
              <Link to="/register" className="text-cyan-400 hover:underline">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
