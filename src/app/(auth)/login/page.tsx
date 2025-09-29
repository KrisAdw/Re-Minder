"use client";

import Link from "next/link";
import { loginApi } from "@/lib/api/auth.api";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      // 1. Call API login
      const res = await loginApi(data);

      // 2. Save auth (JWT + user info) ke Zustand
      useAuthStore.getState().setAuth(res.accessToken, res.user);

      toast.success("Login successful!");
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
      console.error("❌ Login failed:", message);
    }
  };

  return (
    <div className="w-[clamp(25rem,30vw,50rem)] p-6">
      <div className="flex gap-2 flex-col items-center border-b border-border pb-8">
        <h1>Hello There</h1>
        <p className="text-center text-sm">
          Ready to capture your next big idea? Your thoughts are waiting for
          you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <p className="font-medium">Email:</p>
            <input
              {...register("email")}
              className="w-full input"
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <p className="font-medium">Password:</p>
            <input
              {...register("password")}
              className="w-full input"
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </label>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="accent-primary" />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
            <Link href={"/forgot-password"} className="text-sm">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full btn-primary"
          >
            {isSubmitting ? "Logging in..." : "Submit"}
          </button>
        </div>
      </form>

      <p className="text-center mt-6 text-sm">
        Don&apos;t have an account yet? <Link href={"/register"}>Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
