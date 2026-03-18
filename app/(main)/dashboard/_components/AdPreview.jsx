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
  // --- States for Branding Content ---
  const [showBrandingMenu, setShowBrandingMenu] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [userLogo, setUserLogo] = useState(null);
  const [activeOffer, setActiveOffer] = useState("");
  
  // --- Individual Positioning States ---
  const [logoPos, setLogoPos] = useState({ x: 20, y: 20 });
  const [namePos, setNamePos] = useState({ x: 20, y: 80 });
  const [offerPos, setOfferPos] = useState({ x: 20, y: 120 });

  // --- Dragging Logic for Multiple Elements ---
  const [draggingId, setDraggingId] = useState(null); // 'logo', 'name', or 'offer'
  const containerRef = useRef(null);

  const isHookPhase = isPlaying && audioProgress < 20;

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

  const currentMediaUrl = videoUrl || allProductImages[currentImageIndex];

  const isVideo = (url) => {
    if (!url) return false;
    const s = String(url).toLowerCase();
    return s.includes(".mp4") || s.includes(".mov") || s.includes("video") || s.startsWith("data:video") || s.startsWith("blob:");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUserLogo(URL.createObjectURL(file));
  };

  // --- Universal Drag Handler ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - rect.left - 30; 
      let newY = e.clientY - rect.top - 15;

      newX = Math.max(10, Math.min(newX, rect.width - 80));
      newY = Math.max(10, Math.min(newY, rect.height - 40));

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
    <div 
      ref={containerRef}
      className="relative aspect-[9/16] w-full max-w-[340px] rounded-[2rem] overflow-hidden bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.4)] group border border-white/10 select-none"
    >
      
      {/* 1. Media Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {currentMediaUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`absolute inset-0 blur-[120px] opacity-30 transition-colors duration-1000 ${isHookPhase ? 'bg-yellow-400' : 'bg-blue-600'}`} />
            {isVideo(currentMediaUrl) ? (
              <video 
                key={currentMediaUrl}
                src={currentMediaUrl} 
                autoPlay loop muted playsInline
                className="w-full h-full object-cover transition-transform duration-100"
                style={{ transform: isPlaying ? `scale(${1 + (audioLevel / 1000)})` : 'scale(1)' }}
              />
            ) : (
              <img 
                key={currentMediaUrl}
                src={currentMediaUrl} 
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: isPlaying ? `scale(${1.05 + (audioLevel / 500)})` : 'scale(1)' }}
              />
            )}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 text-zinc-700 font-black text-[10px] tracking-[0.4em] uppercase gap-4 text-center p-4">
              Waiting for Assets...
          </div>
        )}
      </div>

      {/* 2. Independent Draggable Elements */}
      {userLogo && (
        <div 
          onMouseDown={() => !showBrandingMenu && setDraggingId('logo')}
          style={{ transform: `translate(${logoPos.x}px, ${logoPos.y}px)`, cursor: draggingId === 'logo' ? 'grabbing' : 'grab' }}
          className="absolute z-40 p-1 hover:ring-1 hover:ring-white/30 rounded-lg group/item"
        >
          <img src={userLogo} className="w-12 h-12 object-contain rounded-lg drop-shadow-xl" />
          <Move size={10} className="absolute -top-2 -right-2 text-white opacity-0 group-hover/item:opacity-100" />
        </div>
      )}

      {storeName && (
        <div 
          onMouseDown={() => !showBrandingMenu && setDraggingId('name')}
          style={{ transform: `translate(${namePos.x}px, ${namePos.y}px)`, cursor: draggingId === 'name' ? 'grabbing' : 'grab' }}
          className="absolute z-40 p-1 hover:ring-1 hover:ring-white/30 rounded-full group/item"
        >
          <span className="text-[10px] text-white/70 font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
            {storeName}
          </span>
          <Move size={10} className="absolute -top-2 -right-2 text-white opacity-0 group-hover/item:opacity-100" />
        </div>
      )}

      {activeOffer && (
        <div 
          onMouseDown={() => !showBrandingMenu && setDraggingId('offer')}
          style={{ transform: `translate(${offerPos.x}px, ${offerPos.y}px)`, cursor: draggingId === 'offer' ? 'grabbing' : 'grab' }}
          className="absolute z-40 p-1 hover:ring-1 hover:ring-white/30 rounded-full group/item"
        >
          <div className="bg-red-600 text-white text-[9px] font-black px-4 py-1 rounded-full shadow-2xl animate-bounce uppercase whitespace-nowrap">
            {activeOffer}
          </div>
          <Move size={10} className="absolute -top-1 -right-1 text-white opacity-0 group-hover/item:opacity-100" />
        </div>
      )}

      {/* 3. Captions Layer */}
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
                    transform: isLast ? `scale(${1.1 + (audioLevel / 200)}) rotate(${isHookPhase ? '-3deg' : '0deg'})` : 'scale(0.85)',
                  }} 
                  className={`${style.font} ${isHookPhase ? 'text-[50px]' : 'text-[40px]'} transition-all duration-75 block drop-shadow-2xl`}
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

      {/* 4. Settings Icon Button */}
      <button 
        onClick={() => setShowBrandingMenu(!showBrandingMenu)}
        className="absolute top-6 left-6 z-[60] p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
      >
        {showBrandingMenu ? <X size={16} /> : <Settings size={16} />}
      </button>

      {/* 5. Branding Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-[240px] bg-black/90 backdrop-blur-2xl z-[55] border-r border-white/10 p-6 flex flex-col gap-6 transition-transform duration-500 ${showBrandingMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mt-10 space-y-4">
          <h3 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/10 pb-2">Ad Customizer</h3>
          
          <div className="space-y-2">
            <label className="text-[9px] text-zinc-500 font-bold uppercase flex items-center gap-2"><Type size={12}/> Store Name</label>
            <input 
              type="text" 
              value={storeName}
              placeholder="e.g. MyShop.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-[10px] outline-none focus:border-blue-500"
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] text-zinc-500 font-bold uppercase flex items-center gap-2"><Upload size={12}/> Logo</label>
            <label className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition">
              <Upload size={16} className="text-zinc-500 mb-1" />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              <span className="text-[8px] text-zinc-400 uppercase">Upload Brand Logo</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] text-zinc-500 font-bold uppercase flex items-center gap-2"><Tag size={12}/> Offers</label>
            <div className="grid grid-cols-1 gap-1">
              {['Sale 50% Off', 'Free Shipping', 'Limited Stock'].map(offer => (
                <button 
                  key={offer}
                  onClick={() => setActiveOffer(activeOffer === offer ? "" : offer)}
                  className={`text-[9px] p-2 rounded-lg text-left transition ${activeOffer === offer ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  {offer}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
             <p className="text-[8px] text-blue-400 font-bold uppercase mb-1">Interactive Editor:</p>
             <p className="text-[8px] text-zinc-400 leading-tight">Drag elements directly on the video to position them individually.</p>
          </div>
        </div>

        <button 
          onClick={() => setShowBrandingMenu(false)}
          className="mt-auto w-full bg-blue-600 text-white text-[10px] font-black p-3 rounded-xl uppercase hover:bg-blue-500 transition-colors"
        >
          Close & Preview
        </button>
      </div>

      {/* 6. Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 z-40">
        <div 
          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-300" 
          style={{ width: `${audioProgress}%` }} 
        />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-40 z-50" />
    </div>
  );
}