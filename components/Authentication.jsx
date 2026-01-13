'use client';

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Authentication({ children }) {
  // استخدام Clerk للتحقق من حالة المستخدم
  const { isSignedIn, user, isLoaded } = useUser();

  // إذا كان Clerk لا يزال يحمل البيانات، لا تظهر شيئاً مؤقتاً
  if (!isLoaded) return null;

  return (
    <>
      {isSignedIn ? (
        // في حالة تسجيل الدخول: زر Logout بنفس ستايلك القديم
        <SignOutButton>
          <Button
            className="px-12 py-4 rounded-full font-extrabold text-lg
                       transition transform hover:scale-105
                       bg-red-600 text-white hover:bg-red-700"
          >
            Logout ({user.firstName})
          </Button>
        </SignOutButton>
      ) : (
        // في حالة عدم تسجيل الدخول: زر Login بنفس ستايلك القديم
        <SignInButton mode="modal">
          <Button
            className="px-12 py-4 rounded-full font-extrabold text-lg
                       transition transform hover:scale-105
                       bg-white text-red-600 hover:bg-gray-100"
          >
            {children}
          </Button>
        </SignInButton>
      )}
    </>
  );
}