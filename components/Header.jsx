'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import Authentication from "./Authentication";

export default function Header() {
  // استخدام Clerk بدلاً من Firebase
  const { user, isLoaded } = useUser();

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" width={80} height={80} className="object-contain" alt="Hookify"/>
        <span className="font-extrabold text-2xl tracking-wide">Hookify</span>
      </div>

      {/* Auth Section */}
      {!isLoaded ? (
        <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
      ) : (
        <div className="flex items-center gap-4">
          {/* في حالة تسجيل الدخول */}
          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-primary px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition">
                Dashboard
              </Button>
            </Link>
            {/* زر المستخدم الرسمي من Clerk (يعرض الصورة والقائمة المنسدلة) */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* في حالة عدم تسجيل الدخول */}
          <SignedOut>
            <Authentication>Get Started</Authentication>
          </SignedOut>
        </div>
      )}
    </header>
  );
}