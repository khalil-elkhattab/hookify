"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClerkProvider, useAuth, UserButton } from "@clerk/nextjs"; // استخدمنا Clerk هنا
import AppSidebar from "./_components/AppSidebar";

// إعداد عميل Convex
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function DashboardContent({ children }) {
  // جلب بيانات المستخدم الحالي من Convex
  // ملاحظة: Convex سيتعرف على المستخدم تلقائياً عبر Clerk Token
  const user = useQuery(api.users.currentUser); 

  return (
    <div className="flex min-h-screen bg-[#090b10] text-white">
      {/* السايدبار سيعرف المستخدم الآن عبر Convex */}
      <AppSidebar /> 
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-8 bg-[#0f1117]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
             <span className="text-gray-500">Workspace</span>
             <span className="text-gray-700">/</span>
             <span className="text-gray-200">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
             {/* زر الملف الشخصي من Clerk */}
             <UserButton afterSignOutUrl="/" />

             <div className="flex items-center gap-3 bg-gray-800/40 p-1.5 pr-4 rounded-full border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg overflow-hidden">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-200 leading-none">
                    {user?.name || "Khalil..."}
                  </span>
                  <span className="text-[9px] text-blue-400 font-medium tracking-tight">
                    {user ? `${user.credits} Credits Left` : "Loading Credits..."}
                  </span>
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    // تغليف التطبيق بـ Clerk ثم Convex لضمان عمل الهوية بشكل صحيح
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <DashboardContent>
          {children}
        </DashboardContent>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}