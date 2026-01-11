'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/app/_context/authContext"; // now it exists
import Authentication from "./Authentication";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" width={80} height={80} className="object-contain" alt="Hookify"/>
        <span className="font-extrabold text-2xl tracking-wide">Hookify</span>
      </div>

      {/* Auth Section */}
      {loading ? null : user ? (
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-primary px-6 py-3 rounded-lg text-white font-semibold">
              Dashboard
            </Button>
          </Link>
          <div className="w-12 h-12 bg-white text-primary font-bold rounded-full flex items-center justify-center shadow-md">
            {user.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
        </div>
      ) : (
        <Authentication>Get Started</Authentication>
      )}
    </header>
  );
}






