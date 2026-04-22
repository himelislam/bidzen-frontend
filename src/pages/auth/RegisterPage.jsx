import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { register as registerUser } from "@/api/auth.api";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["buyer", "seller"], {
    required_error: "Please select a role",
  }),
});

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      const { token, user } = res.data.data;

      setAuth(token, user);
      toast.success(res.data?.message || `Welcome to BidZen, ${user.name}!`);

      if (user.role === "buyer") navigate("/buyer/dashboard");
      else navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-950 flex items-center justify-center text-white px-4">
      {/* SAME glow as login page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Create Account
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Join <span className="text-cyan-400">BidZen</span> today
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm text-slate-400">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition text-white"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition  text-white"
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

              {/* Role */}
              <div>
                <label className="text-sm text-slate-400">I want to</label>

                <div className="space-y-2 mt-2">
                  <label className="flex items-center text-white gap-2 p-2 rounded-lg border border-white/10 bg-slate-900 hover:border-cyan-500/40 transition">
                    <input type="radio" value="buyer" {...register("role")} />
                    Buy items in auctions
                  </label>

                  <label className="flex items-center text-white gap-2 p-2 rounded-lg border border-white/10 bg-slate-900 hover:border-cyan-500/40 transition">
                    <input type="radio" value="seller" {...register("role")} />
                    Sell items in auctions
                  </label>
                </div>

                {errors.role && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
