/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";

// pastikan baseURL tanpa trailing slash biar gak jadi double-slash
const baseURL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) ||
  "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true, // penting biar cookie refresh_token ikut
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Inject access token di setiap request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

const SKIP_REFRESH_ON: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

// ✅ Handle expired token
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const originalRequest = err.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) return Promise.reject(err);

    const url = originalRequest.url || "";

    // hanya refresh kalau: 401, bukan request refresh/login/register, dan belum di-retry
    const shouldTryRefresh =
      status === 401 &&
      !originalRequest._retry &&
      !SKIP_REFRESH_ON.some((p) => url.includes(p));

    if (!shouldTryRefresh) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      // kalau lagi refresh, antri dulu
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              (originalRequest.headers as any).Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ panggil endpoint refresh backend kamu
      const { data } = await api.post("auth/refresh");
      const newToken = (data as any).accessToken;

      // update token di store
      useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user!);

      // update default headers axios
      (api.defaults.headers as any).Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);

      // ulangi request awal dengan token baru
      if (originalRequest.headers) {
        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
      } else {
        originalRequest.headers = { Authorization: `Bearer ${newToken}` } as any;
      }

      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
