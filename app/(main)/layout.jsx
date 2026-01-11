"use client"; // ❌ تأكد أن هذا في السطر رقم 1 تماماً

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "../_context/authContext"; 
import AppSidebar from "./_components/AppSidebar"; 

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function DashboardContent({ children }) {
  const { user: authUser } = useAuth(); 
  
  // جلب البيانات من Convex باستخدام الإيميل
  const user = useQuery(api.user.getUser, { 
    email: authUser?.email || "" 
  });

  return (
    <div className="flex min-h-screen bg-[#090b10] text-white">
      {/* مررنا الإيميل للسايدبار ليعرض النقاط هناك أيضاً */}
      <AppSidebar email={authUser?.email} /> 
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-8 bg-[#0f1117]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
             <span className="text-gray-500">Workspace</span>
             <span className="text-gray-700">/</span>
             <span className="text-gray-200">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-gray-800/40 p-1.5 pr-4 rounded-full border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-200 leading-none">
                    {user?.name || "Loading..."}
                  </span>
                  <span className="text-[9px] text-blue-400 font-medium tracking-tight">
                    {user ? `${user.credits} Credits Left` : "Free Member"}
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
    <ConvexProvider client={convex}>
      <DashboardContent>
        {children}
      </DashboardContent>
    </ConvexProvider>
  );
}