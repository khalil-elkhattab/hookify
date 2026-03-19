"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  MagnifyingGlassIcon, PlayIcon, CheckIcon, 
  Cross2Icon, SpeakerLoudIcon, UpdateIcon, PauseIcon 
} from "@radix-ui/react-icons";
import { searchMusic } from '../services/musicService'; // تأكد من صحة المسار

export default function MusicSearch({ onSelectMusic }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const previewAudioRef = useRef(null);

  // تشغيل الأغنية التالية تلقائياً عند انتهاء الحالية
  useEffect(() => {
    if (previewIndex !== -1 && results[previewIndex]) {
      const currentTrack = results[previewIndex];
      // ملاحظة: نستخدم preview أو url حسب ما يعود من الـ API الخاص بك
      const audioUrl = currentTrack.preview || currentTrack.url;
      
      if (previewAudioRef.current) {
        previewAudioRef.current.src = audioUrl;
        previewAudioRef.current.play().catch(err => console.log("Autoplay blocked or error:", err));
        
        previewAudioRef.current.onended = () => {
          if (previewIndex < results.length - 1) {
            setPreviewIndex(previewIndex + 1);
          } else {
            setPreviewIndex(-1); // العودة للبداية أو التوقف
          }
        };
      }
    }
  }, [previewIndex, results]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchMusic(query);
      setResults(data || []);
      setIsOpen(true); // فتح الصفحة الصغيرة فور ظهور النتائج
      if (data && data.length > 0) setPreviewIndex(0); // ابدأ بتشغيل أول أغنية فوراً
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const closePage = () => {
    setIsOpen(false);
    setPreviewIndex(-1);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Background Music</label>
      
      {/* حقل البحث الرئيسي في الـ Dashboard */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search tracks..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-blue-500 outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {loading ? <UpdateIcon className="animate-spin w-3 h-3 text-white" /> : <MagnifyingGlassIcon className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* الصفحة الصغيرة (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* خلفية معتمة */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closePage} />
          
          <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Preview Playlist</h3>
              </div>
              <button onClick={closePage} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                <Cross2Icon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
              {results.map((track, idx) => (
                <div 
                  key={track.id || idx} 
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${
                    previewIndex === idx 
                    ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button 
                      onClick={() => setPreviewIndex(idx)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                        previewIndex === idx ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-zinc-400'
                      }`}
                    >
                      {previewIndex === idx ? <SpeakerLoudIcon className="w-4 h-4 animate-pulse" /> : <PlayIcon className="w-4 h-4" />}
                    </button>
                    <div className="truncate">
                      <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">
                        {track.title || track.name}
                      </p>
                      <p className="text-[8px] text-zinc-500 font-bold uppercase truncate">
                        {track.artist?.name || track.artist}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const finalUrl = track.preview || track.url;
                      onSelectMusic(finalUrl);
                      closePage(); // إغلاق الصفحة فور الاختيار
                    }}
                    className="ml-4 px-4 py-2 bg-white text-black text-[9px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                  >
                    SELECT
                  </button>
                </div>
              ))}
            </div>

            {/* عنصر الصوت الخفي */}
            <audio ref={previewAudioRef} hidden />
            
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="h-[1px] w-full bg-white/5" />
              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.1em] mt-2">
                Auto-playing next track
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}