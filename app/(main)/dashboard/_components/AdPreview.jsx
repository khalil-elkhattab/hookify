// @ts-nocheck
"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Settings, X, Upload, Tag, Type, Move } from "lucide-react";

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
  // --- Branding States ---
  const [showBrandingMenu, setShowBrandingMenu] = useState(false);
  const [storeName, setStoreName] = useState("HOOKIFY STORE");
  const [userLogo, setUserLogo] = useState(null);
  const [activeOffer, setActiveOffer] = useState("50% OFF TODAY");
  
  // --- Positioning States ---
  const [logoPos, setLogoPos] = useState({ x: 20, y: 50 });
  const [namePos, setNamePos] = useState({ x: 20, y: 110 });
  const [offerPos, setOfferPos] = useState({ x: 20, y: 150 });

  const [draggingId, setDraggingId] = useState(null);
  const containerRef = useRef(null);

  // Dynamic Styles for AI Captions
  const style = useMemo(() => {
    const settings = {
      "Viral Hormozi": {
        font: "font-[1000] italic uppercase tracking-tighter leading-[0.85] text-5xl",
        highlight: "#facc15",
        textShadow: "0px 8px 25px rgba(0,0,0,0.9), 3px 3px 0px #000",
      },
      "MrBeast Style": {
        font: "font-black uppercase tracking-tight text-4xl",
        highlight: "#3b82f6",
        textShadow: "0px 0px 20px rgba(59,130,246,0.5), 2px 2px 0px #000",
      },
      "Luxury": {
        font: "font-serif italic tracking-wide capitalize text-3xl",
        highlight: "#ffffff",
        textShadow: "0px 4px 10px rgba(0,0,0,0.8)",
      },
      "UGC": {
        font: "font-sans font-bold tracking-tight text-4xl",
        highlight: "#22c55e",
        textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
      }
    };
    return settings[selectedStyle] || settings["Viral Hormozi"];
  }, [selectedStyle]);

  const currentMediaUrl = videoUrl || allProductImages[currentImageIndex];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUserLogo(URL.createObjectURL(file));
  };

  // Dragging Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;

      if (draggingId === 'logo') setLogoPos({ x: newX, y: newY });
      if (draggingId === 'name') setNamePos({ x: newX, y: newY });
      if (draggingId === 'offer') setOfferPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => setDraggingId(null);
    if (draggingId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId]);

  return (
    /* الحاوية الخارجية تأخذ 100% من مساحة الـ Dashboard المتاحة */
    <div className="relative group flex items-center justify-center h-full w-full overflow-hidden">
      
      {/* PHONE FRAME - تم تعديله ليستخدم h-full بدلاً من w-[320px] ثابتة */}
      <div 
        ref={containerRef}
        className="relative h-full aspect-[9/16] rounded-[3rem] overflow-hidden bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] border-[8px] border-zinc-900 select-none"
        style={{ maxHeight: '100%' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-50" />

        {/* 1. MEDIA LAYER */}
        <div className="absolute inset-0 z-0">
          {currentMediaUrl ? (
            videoUrl ? (
              <video src={currentMediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
            ) : (
              <img src={currentMediaUrl} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center italic text-zinc-700 text-xs text-center px-4">Awaiting Assets...</div>
          )}
        </div>

        {/* 2. OVERLAY / CAPTIONS LAYER */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none flex items-center justify-center p-6 text-center">
            <div 
              style={{ 
                textShadow: style.textShadow,
                transform: `scale(${1 + (audioLevel / 200)})` 
              }}
              className={`${style.font} transition-transform duration-75`}
            >
              {visibleWords.map((word, i) => (
                <span key={i} style={{ color: i === visibleWords.length - 1 ? style.highlight : 'white' }}>
                  {word}{" "}
                </span>
              ))}
            </div>
        </div>

        {/* 3. BRANDING LAYER (DRAGGABLE) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {userLogo && (
            <div 
              onMouseDown={() => setDraggingId('logo')}
              style={{ left: `${logoPos.x}%`, top: `${logoPos.y}%` }}
              className="absolute pointer-events-auto cursor-move group/item"
            >
              <img src={userLogo} className="w-12 h-12 rounded-lg object-contain bg-white/10 backdrop-blur-md p-1 border border-white/20" />
              <Move className="absolute -top-4 -right-4 w-3 h-3 text-blue-500 opacity-0 group-hover/item:opacity-100" />
            </div>
          )}

          {storeName && (
            <div 
              onMouseDown={() => setDraggingId('name')}
              style={{ left: `${namePos.x}%`, top: `${namePos.y}%` }}
              className="absolute pointer-events-auto cursor-move group/item bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 whitespace-nowrap"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{storeName}</span>
              <Move className="absolute -top-4 -right-4 w-3 h-3 text-blue-500 opacity-0 group-hover/item:opacity-100" />
            </div>
          )}

          {activeOffer && (
            <div 
              onMouseDown={() => setDraggingId('offer')}
              style={{ left: `${offerPos.x}%`, top: `${offerPos.y}%` }}
              className="absolute pointer-events-auto cursor-move group/item bg-blue-600 px-4 py-1 rounded-sm rotate-[-2deg] shadow-lg whitespace-nowrap"
            >
              <span className="text-[11px] font-black text-white uppercase italic">{activeOffer}</span>
              <Move className="absolute -top-4 -right-4 w-3 h-3 text-white opacity-0 group-hover/item:opacity-100" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden z-30">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${audioProgress}%` }} />
        </div>
      </div>

      {/* FLOATING CONFIG BUTTON */}
      <button 
        onClick={() => setShowBrandingMenu(!showBrandingMenu)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-2xl shadow-2xl hover:scale-110 transition-all z-[60]"
      >
        <Settings className={`w-5 h-5 ${showBrandingMenu ? 'animate-spin' : ''}`} />
      </button>

      {/* BRANDING CONFIG PANEL */}
      {showBrandingMenu && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-64 bg-[#0F0F0F] border border-white/10 rounded-3xl p-5 shadow-2xl z-[70] animate-in slide-in-from-right-10">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Brand Kit</h4>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setShowBrandingMenu(false)} />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Logo Overlay</label>
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-white/5 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                {userLogo ? <img src={userLogo} className="h-12 object-contain" /> : <Upload className="w-5 h-5 text-zinc-600" />}
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Store Identity</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[10px] outline-white text-white outline-none focus:border-blue-500" placeholder="e.g. MyShop" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Campaign Offer</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <input value={activeOffer} onChange={(e) => setActiveOffer(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[10px] outline-white text-white outline-none focus:border-blue-500" placeholder="e.g. 20% OFF" />
              </div>
            </div>
            
            <p className="text-[8px] text-zinc-600 italic">Drag elements inside the preview to reposition them.</p>
          </div>
        </div>
      )}
    </div>
  );
}