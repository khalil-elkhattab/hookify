'use client';
import React from "react";
import Authentication from "./Authentication";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PlayCircle, ArrowRight, MessageSquareHeart, Sparkles, Star } from "lucide-react";

export default function Hero() {
  const { isLoaded } = useUser();

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center bg-[#030712] text-white px-6 text-center relative overflow-hidden">
      
      {/* 1. الإضاءة الخلفية الناعمة */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      {/* Badge علوي بسيط */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-8">
        <Sparkles className="w-3 h-3" />
        AI Video Engine 2.0
      </div>

      <h1 className="text-5xl md:text-7xl font-[1000] leading-[1.1] mb-6 max-w-5xl tracking-tight uppercase italic">
        HOOKIFY — Video Generator <br/>
        for <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Sellers & Dropshippers
        </span>
      </h1>

      <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-3xl leading-relaxed">
        AI generates script, images, and voiceover in seconds.
        Create, edit, and publish fast to save you time.
      </p>

      {/* 2. منطقة الأزرار (Cute & Logical Box) */}
      <div className="p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0a0a0f] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
          
          {/* حالة التحميل */}
          {!isLoaded ? (
            <div className="w-32 h-12 bg-white/5 animate-pulse rounded-xl"></div>
          ) : (
            <>
              {/* الحالة 1: غير مسجل -> يظهر زر Get Started فقط */}
              <SignedOut>
                <Authentication>
                  <span className="px-10 py-5 rounded-2xl font-black text-lg bg-purple-600 hover:bg-white hover:text-purple-600 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/20 group h-auto">
                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Authentication>
              </SignedOut>

              {/* الحالة 2: مسجل دخول -> يظهر Go to Dashboard فقط */}
              <SignedIn>
                <Link href="/dashboard">
                  <span className="px-10 py-5 rounded-2xl font-black text-lg bg-white text-black hover:bg-purple-600 hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-lg h-auto">
                    Go to Dashboard <Sparkles className="w-5 h-5 text-purple-500 fill-current" />
                  </span>
                </Link>
              </SignedIn>
            </>
          )}

          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

          {/* زر Watch Demo */}
          <button className="px-8 py-5 rounded-2xl font-bold text-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-purple-500" />
            Watch Demo
          </button>
        </div>
      </div>

      {/* 3. زر Feedback العائم اللطيف */}
      <div className="fixed bottom-6 right-6 group z-50">
        <button className="flex items-center gap-2 bg-[#1a1a2e]/80 hover:bg-purple-600 backdrop-blur-xl border border-white/10 p-4 rounded-2xl transition-all duration-300 shadow-2xl shadow-purple-500/10">
           <MessageSquareHeart className="w-6 h-6 text-purple-400 group-hover:text-white" />
           <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
             Give Feedback
           </span>
        </button>
      </div>

      {/* 4. نجوم التقييم */}
      <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm font-medium animate-fade-in">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-tight opacity-60">
          (4.9/5 stars based on 500+ users)
        </span>
      </div>

    </section>
  );
}