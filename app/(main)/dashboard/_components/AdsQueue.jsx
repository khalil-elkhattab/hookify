// @ts-nocheck
"use client";
import React, { useMemo } from "react";

export default function AdPreview({ 
  allProductImages = [], 
  videoUrl = null,
  currentImageIndex = 0, 
  audioLevel = 0, 
  audioProgress = 0, 
  isPlaying = false, 
  visibleWords = [], 
  selectedStyle = "Viral Hormozi" 
}) {

  const isHookPhase = isPlaying && audioProgress < 20;

  // Caption Style Definitions
  const style = useMemo(() => {
    const settings = {
      "Viral Hormozi": {
        font: "font-[1000] italic uppercase tracking-tighter leading-[0.85]",
        highlight: "#facc15",
        textShadow: "0px 8px 25px rgba(0,0,0,0.9), 3px 3px 0px #000",
      },
      "MrBeast Style": {
        font: "font-black uppercase tracking-tight",
        highlight: "#3b82f6",
        textShadow: "0px 0px 20px rgba(59,130,246,0.5), 2px 2px 0px #000",
      },
      "Luxury": {
        font: "font-serif italic tracking-wide capitalize",
        highlight: "#ffffff",
        textShadow: "0px 4px 10px rgba(0,0,0,0.8)",
      },
      "UGC": {
        font: "font-sans font-bold tracking-tight",
        highlight: "#22c55e",
        textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
      }
    };
    return settings[selectedStyle] || settings["Viral Hormozi"];
  }, [selectedStyle]);

  // Determine current media: Prioritize the direct videoUrl if provided, else use the image array
  const currentMediaUrl = videoUrl || allProductImages[currentImageIndex];

  const isVideo = (url) => {
    if (!url) return false;
    const s = String(url).toLowerCase();
    return s.includes(".mp4") || s.includes(".mov") || s.includes("video") || s.startsWith("data:video") || s.startsWith("blob:");
  };

  return (
    <div className="relative aspect-[9/16] w-full max-w-[340px] rounded-[2rem] overflow-hidden transition-all duration-700 bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.4)] group border border-white/10">
      
      {/* 1. Media Layer */}
      <div className="absolute inset-0 z-0">
        {currentMediaUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Dynamic Background Glow */}
            <div className={`absolute inset-0 blur-[120px] opacity-30 transition-colors duration-1000 ${isHookPhase ? 'bg-yellow-400' : 'bg-blue-600'}`} />

            {isVideo(currentMediaUrl) ? (
              <video 
                key={currentMediaUrl} // Forces re-render on URL change
                src={currentMediaUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transition-transform duration-100"
                style={{ 
                  transform: isPlaying ? `scale(${1 + (audioLevel / 1000)})` : 'scale(1)'
                }}
              />
            ) : (
              <img 
                key={currentMediaUrl}
                src={currentMediaUrl} 
                alt="Ad Asset"
                className="w-full h-full object-cover transition-transform duration-300 shadow-2xl"
                style={{ 
                  transform: isPlaying ? `scale(${1.05 + (audioLevel / 500)})` : 'scale(1)'
                }}
              />
            )}

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 text-zinc-700 font-black text-[10px] tracking-[0.4em] uppercase gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-800 animate-spin" />
            Waiting for Media...
          </div>
        )}
      </div>

      {/* 2. Captions Layer */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6">
        <div className="flex flex-col items-center gap-1 text-center w-full">
          {isPlaying && visibleWords.length > 0 ? (
            visibleWords.slice(-2).map((word, idx) => {
              const isLast = idx === 1 || visibleWords.length === 1;
              return (
                <span 
                  key={`${word}-${idx}`}
                  style={{ 
                    color: isLast ? style.highlight : 'white',
                    textShadow: style.textShadow,
                    transform: isLast 
                        ? `scale(${1.1 + (audioLevel / 200)}) rotate(${isHookPhase ? '-3deg' : '0deg'})` 
                        : 'scale(0.85)',
                  }} 
                  className={`${style.font} ${isHookPhase ? 'text-[50px]' : 'text-[40px]'} transition-all duration-75 block drop-shadow-2xl select-none`}
                >
                  {word}
                </span>
              );
            })
          ) : (
            !isPlaying && currentMediaUrl && (
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-2 rounded-full text-[9px] font-black tracking-[0.4em] text-white uppercase">
                Ready to Ignite
              </div>
            )
          )}
        </div>
      </div>

      {/* 3. Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 z-40">
        <div 
          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-300 ease-out" 
          style={{ width: `${audioProgress}%` }} 
        />
      </div>

      {/* Premium SaaS Glass Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-40 z-50" />
      
    </div>
  );
}