// app/(main)/dashboard/history/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  VideoIcon, 
  CalendarIcon, 
  DownloadIcon, 
  ExternalLinkIcon,
  UpdateIcon,
  BarChartIcon
} from "@radix-ui/react-icons";
import Header from "../_components/Header";

export default function HistoryPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // جلب البيانات من Convex
  const exports = useQuery(api.hooks.getUserExports);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="p-4 md:p-8 lg:p-10 max-w-[1700px] mx-auto text-white space-y-10 min-h-screen bg-[#020202]">
      {/* الخلفية المتدرجة كما في الداشبورد */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      
      <Header />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
            <VideoIcon className="w-8 h-8 text-blue-500" />
            Generation History
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Manage and download your previously rendered AI Ads
          </p>
        </div>

        {exports === undefined ? (
          // حالة التحميل
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <UpdateIcon className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-zinc-500 font-black text-[10px] tracking-[0.3em] uppercase">Synchronizing Library...</p>
          </div>
        ) : exports.length === 0 ? (
          // حالة لا توجد بيانات
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-20 text-center backdrop-blur-xl">
            <div className="bg-zinc-800/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <VideoIcon className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-black mb-2">No Ads Found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">You haven't exported any videos yet. Start creating in the dashboard!</p>
          </div>
        ) : (
          // عرض النتائج
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exports.map((video) => (
              <div 
                key={video._id} 
                className="group bg-[#0A0A0A]/80 border border-white/[0.08] rounded-[2.5rem] overflow-hidden backdrop-blur-3xl hover:border-blue-500/30 transition-all duration-500 shadow-3xl"
              >
                {/* معاينة الفيديو أو الصورة */}
                <div className="aspect-[9/16] bg-zinc-900 relative overflow-hidden h-[350px]">
                  <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    muted
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {video.style}
                  </div>
                </div>

                {/* التفاصيل */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <CalendarIcon className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(video._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold leading-relaxed line-clamp-2 text-zinc-200">
                      "{video.text}"
                    </p>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <a 
                      href={video.videoUrl} 
                      target="_blank"
                      download
                      className="flex-1 bg-white text-black text-[10px] font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                    >
                      <DownloadIcon /> DOWNLOAD
                    </a>
                    <button 
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                    >
                      <ExternalLinkIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}