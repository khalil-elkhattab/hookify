'use client';
import React from "react";
import Authentication from "./Authentication";
import { Button } from "./ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center bg-[#030712] text-white px-6 text-center relative overflow-hidden">
      
      {/* تأثير ضوئي خلف النص */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full -z-10"></div>

      {/* العنوان */}
      <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 max-w-5xl tracking-tight">
        HOOKIFY — Video Generator <br/>
        for <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Sellers & Dropshippers
        </span>
      </h1>

      {/* الوصف */}
      <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-3xl leading-relaxed">
        AI generates script, images, and voiceover in seconds.<br className="hidden md:block"/>
        Create, edit, and publish fast to save you time.
      </p>

      {/* الأزرار */}
      <div className="flex flex-row items-center justify-center gap-6 w-full">
        
        {/* إذا لم يكن مسجلاً: يظهر زر Get Started */}
        <SignedOut>
          <Authentication>
              Get Started
          </Authentication>
        </SignedOut>

        {/* إذا كان مسجلاً: يظهر زر الذهاب للوحة التحكم */}
        <SignedIn>
          <Link href="/dashboard">
            <Button className="px-12 py-7 rounded-full font-black text-xl bg-purple-600 hover:bg-purple-700 transition transform hover:scale-105 h-auto">
                Go to Dashboard
            </Button>
          </Link>
        </SignedIn>

        {/* زر Watch Demo */}
        <Button 
          variant="outline" 
          className="px-12 py-7 rounded-full font-black text-xl border-gray-800 text-white hover:bg-gray-800 transition transform hover:scale-105 h-auto"
        >
          Watch Demo
        </Button>

      </div>
    </section>
  );
}