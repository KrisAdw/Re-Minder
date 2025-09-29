// src/app/(auth)/layout.tsx
import logo from "@/assets/logo/logo-blue.svg";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Simple auth navbar */}
      <div className="fixed bg-background flex justify-between top-4 left-6 right-6 pb-2">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <ThemeToggle />
      </div>

      {/* Auth content */}
      <div className="flex mt-12 justify-center items-center min-h-screen">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
