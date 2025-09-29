"use client";

import { CircleCheck, CircleX, CircleAlert, Info } from "lucide-react";
import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      expand
      richColors   
      toastOptions={{
        className: "!rounded-lg !border-none !shadow-lg",
        classNames: {
          default: "!border-bluehov !bg-background !text-white",
          success: "!bg-success !text-white",
          error: "!bg-red-600 !text-white",
          warning: "!bg-yellow-500 !text-black",
          info: "!bg-blue-500 !text-white",
        },
      }}
      icons={{
        success: <span><CircleCheck size={18} /></span>,
        error: <span><CircleX size={18} /></span>,
        warning: <span><CircleAlert size={18} /></span>,
        info: <span><Info size={18} /></span>,
      }}
    />
  );
}
