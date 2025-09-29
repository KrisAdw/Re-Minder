"use client";

import { User } from "lucide-react";
import SearchBar from "./SearchBar";
import Logo from "@/assets/logo/logo-blue.svg";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <Link href="/" className="flex cursor-pointer items-center gap-2">
          <Image src={Logo} alt="Logo" width={150} height={150} />
        </Link>
      </div>

      <div className="relative flex flex-1">
        <SearchBar />
        <span className="absolute right-0 top-1/2 h-8 w-px -translate-y-1/2 bg-border" />
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive cursor-pointer "
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
