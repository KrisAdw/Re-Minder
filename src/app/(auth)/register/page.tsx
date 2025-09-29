"use client";

import { registerApi } from "@/lib/api/auth.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error("❌ Registration failed:", err);
    }
  };

  return (
    <div className="w-[clamp(25rem,30vw,50rem)] p-6">
      <div className="flex gap-2 flex-col items-center border-b border-border pb-8">
        <h1>Create an Account</h1>
        <p className="text-center text-sm">Please enter your details!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <p className="font-medium">Full Name</p>
            <input
              {...register("name")}
              className="w-full input"
              type="text"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <p className="font-medium">Email</p>
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
            <p className="font-medium">Password</p>
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

          <label className="flex flex-col gap-2">
            <p className="font-medium">Confirm Password</p>
            <input
              {...register("confirmPassword")}
              className="w-full input"
              type="password"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full btn-primary"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
