"use client";
import React from "react";
// تأكد من تثبيت lucide-react عبر npm install lucide-react
import { Search, Play, TrendingUp } from "lucide-react";

export default function ExplorePage() {
  const trends = [
    { title: "Viral Hormozi Style", category: "Education", views: "1.2M" },
    { title: "AI Voiceover Magic", category: "Tech", views: "850K" },
    { title: "Minimalist Captions", category: "Vlog", views: "2.1M" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          {/* تم إصلاح تكرار italic هنا */}
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            Explore <span className="text-blue-600">Trends</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] mt-3">
            DISCOVER THE NEXT VIRAL HOOK
          </p>
        </header>

        {/* Search Bar Section */}
        <div className="relative mb-16 group">
          <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Search className="absolute left-5 text-zinc-500 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search for styles, niches, or creators..."
              className="w-full bg-zinc-900/40 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-blue-600 focus:bg-zinc-900/80 transition-all text-sm"
            />
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((item, i) => (
            <div 
              key={i} 
              className="group relative bg-zinc-950 border border-white/5 p-5 rounded-[2.5rem] hover:border-blue-600/40 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Thumbnail Area */}
              <div className="relative h-52 bg-zinc-900 rounded-[1.8rem] mb-5 overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                 <Play className="relative w-14 h-14 text-white/10 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500 z-20" />
                 
                 <div className="absolute bottom-4 left-4 bg-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full z-30 shadow-lg">
                   {item.views} VIEWS
                 </div>
              </div>

              {/* Text Info */}
              <div className="px-2">
                <h3 className="font-black text-xl mb-2 group-hover:text-blue-500 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-zinc-500" />
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}