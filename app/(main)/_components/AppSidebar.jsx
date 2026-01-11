"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  X
} from "lucide-react";
import { useUser } from "../../hooks/useUser";

export default function AppSidebar({ email }) {
  const pathname = usePathname();
  const user = useUser(email);
  const [showPaywall, setShowPaywall] = useState(false); // حالة إظهار نافذة الدفع
  
  const hasCredits = user && user.credits > 0;

  // --- دالة معالجة الدفع والتحويل إلى Stripe/Payment Platform ---
  const handlePayment = async (priceId) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: priceId, 
          email: email // نرسل إيميل المستخدم لربط الدفع بحسابه
        }),
      });

      const data = await response.json();

      if (data.url) {
        // التحويل إلى صفحة الدفع الآمنة
        window.location.href = data.url; 
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment system is temporarily down. Please try again.");
    }
  };

  const links = [
    { name: "Home Page", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/dashboard/explore", icon: Compass },
    { name: "Billing", href: "#", icon: CreditCard, onClick: () => setShowPaywall(true) }, 
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
  ];

  return (
    <>
      <aside className="bg-[#050505] text-white w-64 hidden md:flex flex-col border-r border-white/5 h-screen sticky top-0 shadow-2xl transition-all duration-500 ease-in-out">
        {/* --- Logo Section --- */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:rotate-[10deg] transition-all duration-300">
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
                  onClick={link.onClick}
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
                    <Icon className={`w-[18px] h-[18px] transition-transform duration-500 ${isActive ? "scale-110 text-blue-400" : "group-hover:scale-110 group-hover:rotate-3"}`} />
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

        {/* --- User/Bottom Section --- */}
        <div className="p-4 mt-auto space-y-4">
          
          <div className={`p-5 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group shadow-2xl ${!hasCredits ? 'border-rose-500/40 bg-rose-500/5 animate-pulse' : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'}`}>
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 blur-2xl rounded-full transition-colors ${!hasCredits ? 'bg-rose-600/10' : 'bg-blue-600/5 group-hover:bg-blue-600/10'}`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${hasCredits ? 'bg-yellow-500/10' : 'bg-rose-500/20'}`}>
                      <Zap className={`w-3 h-3 ${hasCredits ? "text-yellow-500 fill-yellow-500" : "text-rose-500 fill-rose-500"}`} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">System Credits</p>
                  </div>
                  <span className={`text-[11px] font-bold tabular-nums ${!hasCredits ? 'text-rose-500' : 'text-blue-500'}`}>
                    {user ? `${user.credits}/5` : "--"}
                  </span>
                </div>
                
                <div className="w-full bg-white/5 rounded-full h-1 mb-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${hasCredits ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"}`}
                    style={{ width: `${user ? (user.credits / 5) * 100 : 0}%` }}
                  ></div>
                </div>

                {!hasCredits && user ? (
                  <button 
                    onClick={() => setShowPaywall(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-[10px] font-black tracking-widest text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all active:scale-[0.97]"
                  >
                    <Sparkles className="w-3 h-3 fill-white" />
                    RECHARGE ENGINE
                  </button>
                ) : (
                  <div className="flex items-center justify-between px-1" onClick={() => setShowPaywall(true)} style={{cursor: 'pointer'}}>
                     <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Active Plan</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                )}
              </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] rounded-2xl border border-white/5">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                  {email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-[10px] font-medium text-zinc-500 truncate max-w-[80px]">{email}</span>
             </div>
             <Settings className="w-3.5 h-3.5 text-zinc-700 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* --- Smart Payment Overlay (The 404 Style Paywall) --- */}
      {showPaywall && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="absolute inset-0" onClick={() => setShowPaywall(false)} />
          <div className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center border-b border-white/5">
              <button onClick={() => setShowPaywall(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-blue-500 font-black tracking-widest uppercase text-[10px] mb-2">Refill Required</h2>
              <p className="text-2xl font-black italic uppercase tracking-tighter text-white">Choose your credit pack</p>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* باقة الـ 9 دولار */}
               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/50 transition-all group">
                  <p className="text-[10px] font-bold text-zinc-500 mb-1 uppercase">Starter Pack</p>
                  <h3 className="text-3xl font-black italic text-white mb-4">$9 <span className="text-sm font-normal text-zinc-500">/ 10 Credits</span></h3>
                  <button 
                    onClick={() => handlePayment("price_123_starter")} 
                    className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                  >
                    PURCHASE
                  </button>
               </div>

               {/* باقة الـ 29 دولار */}
               <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/50 hover:border-blue-500 transition-all group">
                  <p className="text-[10px] font-bold text-blue-400 mb-1 uppercase">Pro Pack (Best Value)</p>
                  <h3 className="text-3xl font-black italic text-white mb-4">$29 <span className="text-sm font-normal text-zinc-500">/ 50 Credits</span></h3>
                  <button 
                    onClick={() => handlePayment("price_123_pro")} 
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    PURCHASE
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}