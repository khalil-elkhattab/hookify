"use client";
import React from "react";
import { CheckIcon, RocketIcon, LightningBoltIcon, StarIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

// الهيدر البسيط لتجنب أخطاء المسارات
function SimpleHeader() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center mb-16 relative z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-[0_0_20px_rgba(37,99,235,0.4)]">H</div>
        <span className="font-black tracking-tighter text-2xl uppercase">Hookify</span>
      </div>
      <button 
        onClick={() => router.back()} 
        className="bg-zinc-900/50 border border-white/5 px-5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
      >
        <ArrowLeftIcon /> Back
      </button>
    </div>
  );
}

const plans = [
  {
    name: "Starter",
    price: "10",
    credits: 50,
    features: ["50 AI Ad Hooks", "High-Quality Video Export", "Standard Support", "AliExpress Scraper"],
    icon: <LightningBoltIcon className="text-yellow-400 w-6 h-6" />,
    color: "border-zinc-800",
    description: "Perfect for testing new products."
  },
  {
    name: "Growth",
    price: "25",
    credits: 150,
    features: ["150 AI Ad Hooks", "Priority Rendering", "AI Background Removal", "Premium Support"],
    icon: <RocketIcon className="text-blue-500 w-6 h-6" />,
    color: "border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    popular: true,
    description: "Best for scaling winning ads."
  },
  {
    name: "Scale",
    price: "50",
    credits: 500,
    features: ["500 AI Ad Hooks", "Ultra-Fast Rendering", "Custom AI Styles", "24/7 VIP Support"],
    icon: <StarIcon className="text-purple-500 w-6 h-6" />,
    color: "border-zinc-800",
    description: "For agencies and power users."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 relative overflow-hidden">
      {/* تأثيرات الخلفية الجمالية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SimpleHeader />

        {/* عنوان الصفحة */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-8xl font-[1000] tracking-[ -0.05em] uppercase leading-none">
            RECHARGE <span className="text-blue-600 italic">POWER</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto font-bold uppercase tracking-widest opacity-80">
            Choose a credit pack to start generating high-converting ads.
          </p>
        </div>

        {/* كروت الخطط */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-zinc-900/30 border ${plan.color} p-10 rounded-[3rem] flex flex-col space-y-8 backdrop-blur-3xl transition-all hover:scale-[1.02] duration-500 group`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  Most Popular
                </span>
              )}
              
              <div className="flex justify-between items-start">
                <div className="p-4 bg-black/50 rounded-[1.5rem] border border-white/5 group-hover:border-blue-500/30 transition-colors">
                  {plan.icon}
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Credit Pack</span>
                    <span className="text-2xl font-black text-white">{plan.credits}</span>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{plan.name}</h3>
                <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-wide">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-5xl font-[1000] tracking-tighter">${plan.price}</span>
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">/ USD</span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-xs font-bold text-zinc-400 uppercase tracking-tight">
                    <div className="p-1 bg-blue-500/10 rounded-md">
                        <CheckIcon className="text-blue-500 w-3 h-3" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => alert(`Redirecting to payment for ${plan.name} plan...`)}
                className={`w-full py-5 rounded-[1.8rem] font-[1000] text-[11px] uppercase tracking-[0.2em] transition-all ${
                  plan.popular 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                  : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                Buy {plan.credits} Credits
              </button>
            </div>
          ))}
        </div>

        {/* تذييل الصفحة */}
        <p className="text-center mt-20 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          Secure payments powered by Stripe & Lemon Squeezy
        </p>
      </div>
    </div>
  );
}