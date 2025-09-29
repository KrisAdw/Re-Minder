/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import api from "../axios";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const loginApi = async (payload: LoginPayload) => {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Invalid email or password";
    toast.error(message);
    throw err;
  }
};

export const registerApi = async (payload: RegisterPayload) => {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Registration failed";
    toast.error(message);
    throw err;
  }
};
