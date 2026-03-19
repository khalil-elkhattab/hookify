"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Compass, 
  CreditCard, 
  LayoutDashboard, 
  Settings, 
  LifeBuoy,
  Zap,
  Sparkles,
  ChevronRight,
  History, 
  Video,   
  Download
} from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
export default function AppSidebar({ email }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser(email);
  
  const history = useQuery(
    api.hooks.getUserHistory, 
    user?._id ? { userId: user._id } : "skip"
  );

  const hasCredits = user && user.credits > 0;

  const goToPricing = () => {
    router.push("/pricing");
  };

  const links = [
    { name: "Home Page", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Creative History", href: "/dashboard/history", icon: History }, 
    { name: "Explore", href: "/dashboard/explore", icon: Compass },
    { name: "Billing", href: "/pricing", icon: CreditCard }, 
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
  ];

  return (
    <aside 
      className="bg-[#050505] text-white hidden md:flex flex-col border-r border-white/5 h-screen sticky top-0 shadow-2xl relative z-50 w-64"
    >
      {/* --- Logo Section --- */}
      <div className="p-6 pb-2 px-6">
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:rotate-[10deg] transition-all duration-300 shrink-0">
            <Image src="/logo.svg" width={24} height={24} alt="Hookify" className="brightness-0 invert" />
          </div>
          <span className="font-black text-xl tracking-tighter italic uppercase bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Hookify
          </span>
        </Link>

        {/* --- Navigation Menu --- */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? "bg-white/5 text-blue-400 border border-white/10" 
                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-blue-500 rounded-r-full shadow-[4px_0_15px_#3b82f6]" />
                )}

                <div className="flex items-center gap-3.5 relative z-10">
                  <Icon className={`w-[18px] h-[18px] transition-transform duration-500 shrink-0 ${isActive ? "scale-110 text-blue-400" : "group-hover:scale-110 group-hover:rotate-3"}`} />
                  <span className={`text-[13px] font-semibold tracking-wide transition-colors ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-200"}`}>
                    {link.name}
                  </span>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 opacity-0 -translate-x-2 ${isActive ? "opacity-100 translate-x-0 text-blue-500" : "group-hover:opacity-40 group-hover:translate-x-0"}`} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- Recent Exports Section --- */}
      <div className="flex-1 mt-4 overflow-y-auto scrollbar-hide border-t border-white/[0.02] pt-6 px-6">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Video className="w-3 h-3 text-blue-500" /> Recent Exports
        </h3>
        
        <div className="space-y-2.5">
          {history === undefined ? (
            [1, 2, 3].map((i) => <div key={i} className="bg-white/[0.02] animate-pulse rounded-xl h-12 w-full" />)
          ) : (history?.length === 0 || !history) ? (
            <p className="text-[10px] text-zinc-700 italic px-2">No videos exported yet.</p>
          ) : (
            history.map((ad) => (
              <div key={ad._id} className="group relative bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-blue-500/30 transition-all cursor-default p-3">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <Video className="text-blue-500 w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col overflow-hidden flex-1">
                    <span className="text-[11px] font-bold text-zinc-300 truncate w-28 tracking-tight">
                      {ad.text}
                    </span>
                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">
                      {ad.style || "Standard"}
                    </span>
                  </div>
                  
                  <a 
                    href={ad.videoUrl} 
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white text-black rounded-lg transition-all hover:scale-105 active:scale-95 z-20"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- User/Bottom Section --- */}
      <div className="mt-auto space-y-4 p-4">
        <div 
          onClick={goToPricing} 
          className={`rounded-[2rem] border transition-all duration-500 relative overflow-hidden group shadow-2xl cursor-pointer p-5 ${!hasCredits ? 'border-rose-500/40 bg-rose-500/5' : 'bg-[#0A0A0A] border-white/5 hover:border-blue-500/20'}`}
        >
            <div className={`absolute -right-4 -bottom-4 w-20 h-20 blur-2xl rounded-full transition-colors ${!hasCredits ? 'bg-rose-600/10' : 'bg-blue-600/5 group-hover:bg-blue-600/10'}`} />
            
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-md ${hasCredits ? 'bg-yellow-500/10' : 'bg-rose-500/20'}`}>
                    <Zap className={`w-3 h-3 ${hasCredits ? "text-yellow-500 fill-yellow-500" : "text-rose-500 fill-rose-500"}`} />
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">System Credits</p>
                </div>
                <span className={`text-[11px] font-bold tabular-nums ${!hasCredits ? 'text-rose-500' : 'text-blue-500'}`}>
                  {user ? `${user.credits}/10` : "--"}
                </span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-1 mb-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${hasCredits ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"}`}
                  style={{ width: `${user ? (Math.min(user.credits / 10, 1) * 100) : 0}%` }}
                ></div>
              </div>

              {!hasCredits && user ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-[10px] font-black tracking-widest text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all">
                  <Sparkles className="w-3 h-3 fill-white" />
                  RECHARGE ENGINE
                </div>
              ) : (
                <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Active Plan</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              )}
            </div>
        </div>

        <div className="flex items-center bg-white/[0.02] rounded-2xl border border-white/5 px-4 py-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                {email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-[10px] font-medium text-zinc-500 truncate max-w-[80px]">{email}</span>
            </div>
            <Settings className="w-3.5 h-3.5 text-zinc-700 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </aside>
  );
}