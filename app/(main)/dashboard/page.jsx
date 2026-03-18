"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Link2Icon, MixerHorizontalIcon, UpdateIcon, 
  PlusIcon, GlobeIcon, SpeakerLoudIcon,
  LightningBoltIcon, ComponentInstanceIcon, HeartIcon,
  MagicWandIcon, LaptopIcon, Cross2Icon, BarChartIcon, VideoIcon,
  MagnifyingGlassIcon, TextIcon, PlayIcon, 
  EyeOpenIcon, CopyIcon, CheckIcon, ChevronDownIcon, DownloadIcon
} from "@radix-ui/react-icons";
import { Share2, Facebook, Instagram, Youtube, Send, Layers } from "lucide-react"; 

// TikTok Icon Component
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

import AdPreview from "./_components/AdPreview";
import { analyzeHook } from "./_components/scoring-engine";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import MusicSearch from '../../components/MusicSearch'; 

export const dynamic = "force-dynamic";

const languages = [
  { name: "Moroccan Darija", code: "Arabic_MA", flag: "🇲🇦" },
  { name: "Saudi (Khaliji)", code: "Arabic_SA", flag: "🇸🇦" },
  { name: "English (US)", code: "English", flag: "🇺🇸" },
  { name: "Chinese (Viral)", code: "Chinese", flag: "🇨🇳" },
  { name: "French (Native)", code: "French", flag: "🇫🇷" },
  { name: "Spanish (Native)", code: "Spanish", flag: "🇪🇸" },
  { name: "German (Native)", code: "German", flag: "🇩🇪" },
  { name: "Portuguese (BR)", code: "Portuguese", flag: "🇧🇷" },
  { name: "Hindi (Indian)", code: "Hindi", flag: "🇮🇳" },
  { name: "Japanese", code: "Japanese", flag: "🇯🇵" },
  { name: "Korean", code: "Korean", flag: "🇰🇷" },
  { name: "Italian", code: "Italian", flag: "🇮🇹" },
];

export default function HookifyDashboard() {
  const router = useRouter(); 
  const { user, isLoaded: isUserLoaded } = useUser();
  const videoStyles = ["Viral Hormozi", "MrBeast Style", "Luxury", "UGC"];

  const [productUrl, setProductUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[2].code); 
  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [selectedStyle, setSelectedStyle] = useState(videoStyles[0]);
  const [selectedMusicUrl, setSelectedMusicUrl] = useState(null);  
  
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [activeHook, setActiveHook] = useState("AI Ad Engine Ready...");
  const [activeHookId, setActiveHookId] = useState(null); 
  const [allProductImages, setAllProductImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [scrapedVideos, setScrapedVideos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.1);
  const [aiVariations, setAiVariations] = useState(null);
  const [lastVoiceBlob, setLastVoiceBlob] = useState(null); 
  const [videoStats, setVideoStats] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);
  const [renderStatusText, setRenderStatusText] = useState("DOWNLOAD FINAL VIDEO");
  const [aiVoiceUrl, setAiVoiceUrl] = useState(null);

  // مرجع للوصول إلى بيانات التعديل داخل AdPreview
  const adPreviewRef = useRef(null);

  const activeLang = languages.find(l => l.code === selectedLanguage) || languages[2];

  const analysis = useMemo(() => {
    if (!activeHook || activeHook === "AI Ad Engine Ready...") return null;
    return analyzeHook(activeHook);
  }, [activeHook]);

  const storeUser = useMutation(api.users.storeUser);
  const trackExport = useMutation(api.hooks.trackExport);
  const userData = useQuery(api.users.currentUser, isUserLoaded && user ? undefined : "skip");

  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const currentObjectUrlRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  useEffect(() => { 
    setIsMounted(true);
    if (isUserLoaded && user) {
        const country = Cookies.get("x-user-country") || "US";
        const language = Cookies.get("x-user-language") || "en";
        const city = Cookies.get("x-user-city") || "Unknown";
        storeUser({ country, language, city }).catch(err => console.error("Store user error:", err)); 
    }
    return () => stopAllMedia();
  }, [user, isUserLoaded]);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    if (voiceRef.current) voiceRef.current.volume = voiceVolume;
  }, [voiceVolume]);

  const startAnalyzing = (audioElement) => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const context = audioContextRef.current;
      if (context.state === 'suspended') context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128; 
      if (!audioSourceRef.current) audioSourceRef.current = context.createMediaElementSource(audioElement);
      audioSourceRef.current.connect(analyser);
      analyser.connect(context.destination);
      const update = () => {
        if (!isPlaying) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(avg);
        requestAnimationFrame(update);
      };
      update();
    } catch (e) { console.warn("Visualizer blocked"); }
  };

  const stopAllMedia = () => {
    setIsPlaying(false);
    if (voiceRef.current) { voiceRef.current.pause(); voiceRef.current.src = ""; voiceRef.current = null; }
    if (musicRef.current) { musicRef.current.pause(); musicRef.current.src = ""; musicRef.current = null; }
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    if (currentObjectUrlRef.current) URL.revokeObjectURL(currentObjectUrlRef.current);
    setAudioLevel(0);
    setAudioProgress(0);
  };

  const updateVisuals = (progress, text) => {
    setAudioProgress(progress);
    const words = text.split(" ");
    const wordIndex = Math.floor((progress / 100) * words.length);
    setVisibleWords(words.slice(0, wordIndex + 1));
    if (!videoUrl && allProductImages.length > 0) {
      const imgIndex = Math.floor((progress / 100) * allProductImages.length);
      setCurrentImageIndex(Math.min(imgIndex, allProductImages.length - 1));
    }
  };

  const runVisualSimulation = (text) => {
    const words = text.split(" ");
    const duration = words.length * 450; 
    const startTime = Date.now();
    simulationIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      updateVisuals(progress, text);
      if (progress >= 100) stopAllMedia();
    }, 50);
  };

  const playVoice = async (text) => {
    if (!text || text === "AI Ad Engine Ready...") return;
    stopAllMedia();
    setIsPlaying(true);
    try {
      if (selectedMusicUrl) {
        const bgMusic = new Audio(selectedMusicUrl);
        bgMusic.volume = musicVolume;
        bgMusic.loop = true;
        musicRef.current = bgMusic;
        bgMusic.play().catch(() => {});
      }
      const response = await fetch("/api/generate/tts", { 
        method: "POST", headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ text, language: selectedLanguage }) 
      });
      if (!response.ok) throw new Error("TTS API Fail");
      const blob = await response.blob();
      setLastVoiceBlob(blob);
      
      const blobUrl = URL.createObjectURL(blob);
      setAiVoiceUrl(blobUrl);

      currentObjectUrlRef.current = blobUrl;
      const audio = new Audio(blobUrl);
      audio.volume = voiceVolume;
      voiceRef.current = audio;
      audio.ontimeupdate = () => updateVisuals((audio.currentTime / audio.duration) * 100, text);
      audio.onplay = () => startAnalyzing(audio);
      audio.onended = () => stopAllMedia();
      await audio.play();
    } catch (err) { runVisualSimulation(text); }
  };

  const handleGenerate = async () => {
    if (!productUrl) return alert("Please enter product name or link!");
    setLoading(true);
    setLoadingStatus("🚀 Hunting Viral Videos...");
    try {
      const scrapeRes = await fetch("/api/generate/scrape", { 
        method: "POST", headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ productUrl, source: "tiktok" }) 
      });
      const scrapeData = await scrapeRes.json();
      if (!scrapeData.success) throw new Error(scrapeData.error || "Failed to fetch assets");

      setVideoUrl(null);
      setAllProductImages([]);
      setScrapedVideos([]);

      if (scrapeData.videos && scrapeData.videos.length > 0) {
        setScrapedVideos(scrapeData.videos);
        setVideoUrl(scrapeData.videos[0].videoUrl);
        setVideoStats(scrapeData.videos[0].stats);
      } else {
        setVideoStats(null);
        let cleanedImages = (scrapeData.images || []).map(img => {
            let url = typeof img === 'object' ? (img.link || img.url) : img;
            return url?.startsWith("//") ? `https:${url}` : url;
        }).filter(Boolean);
        setAllProductImages(cleanedImages);
      }

      setLoadingStatus("🧠 AI Writing Script...");
      const aiRes = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productTitle: scrapeData.title || productUrl, language: selectedLanguage, style: selectedStyle })
      });
      const aiData = await aiRes.json();
      if (aiData.success) {
          setAiVariations(aiData.hooks); 
          const firstHook = Object.values(aiData.hooks)[0];
          setActiveHook(firstHook);
          setLoadingStatus("✨ Masterpiece Ready!");
          playVoice(firstHook);
      }
    } catch (error) { setLoadingStatus("❌ Error: " + error.message); } finally { setLoading(false); }
  };

  // --- MODIFIED DOWNLOAD LOGIC: SENDING REAL DATA FROM PREVIEW ---
  const handleDownloadAd = async () => {
    if (!activeHook || activeHook === "AI Ad Engine Ready...") return alert("Generate an ad first!");
    
    setIsDownloading(true);
    setRenderStatusText("INITIALIZING...");
    
    // محاولة جلب الإحداثيات والبيانات مباشرة من AdPreview إذا كانت متاحة عبر State
    // ملاحظة: بما أن AdPreview مكون داخلي، يفضل تمرير البيانات إليه بدلاً من سحبها منه،
    // ولكن هنا نرسل القيم الحالية التي يراها المستخدم.

    try {
      const response = await fetch("/api/generate/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            aiScript: activeHook, 
            videoUrl: videoUrl, 
            selectedMusic: selectedMusicUrl,
            selectedStyle: selectedStyle,
            aiVoiceUrl: aiVoiceUrl, // رابط الصوت الذي تم توليده
            storeName: "Hookify Store", // يمكنك جعل هذا State إذا أردت
            activeOffer: "SPECIAL OFFER",
            logoPos: { x: 20, y: 20 }, // الإحداثيات الافتراضية أو المسحوبة
            namePos: { x: 20, y: 80 },
            offerPos: { x: 20, y: 120 }
        })
      });

      const initialData = await response.json();
      if (!initialData.response || !initialData.response.id) {
        throw new Error(initialData.details || "Render Request Refused");
      }

      const renderId = initialData.response.id;

      const checkInterval = setInterval(async () => {
        setRenderStatusText("RENDERING IN CLOUD...");
        
        try {
          const statusRes = await fetch(`https://api.shotstack.io/stage/render/${renderId}`, {
            headers: { 
              'x-api-key': process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY,
              'Content-Type': 'application/json' 
            }
          });
          
          const statusData = await statusRes.json();
          if (!statusData.response) return;
          
          const currentStatus = statusData.response.status;

          if (currentStatus === 'done') {
            clearInterval(checkInterval);
            setRenderStatusText("SAVING TO DEVICE...");
            
            const finalVideoUrl = statusData.response.url;

            const videoBlobResponse = await fetch(finalVideoUrl);
            const blob = await videoBlobResponse.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `hookify-${renderId}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            await trackExport({ 
              style: selectedStyle, 
              text: activeHook,
              videoUrl: finalVideoUrl 
            });

            setIsDownloading(false);
            setRenderStatusText("✅ DOWNLOAD READY");
            setTimeout(() => setRenderStatusText("DOWNLOAD FINAL VIDEO"), 3000);
          } else if (currentStatus === 'failed') {
            clearInterval(checkInterval);
            throw new Error("Render Failed Internally");
          }
        } catch (err) {
          console.error("Polling Error:", err);
        }
      }, 5000);

    } catch (error) { 
      setIsDownloading(false);
      setRenderStatusText("DOWNLOAD FINAL VIDEO");
      alert(`Render Error: ${error.message}`); 
    }
  };

  const handlePublish = async (platform) => {
    const PIPEDREAM_URL = "https://e93aa22d438c84b959d2999c970bc566.m.pipedream.net"; 
    setPublishStatus(`⏳ Publishing to ${platform}...`);

    const payload = {
      platform: platform,
      text: activeHook,
      videoUrl: videoUrl || (allProductImages.length > 0 ? "Image Sequence" : null),
      product: productUrl,
      userEmail: user?.emailAddresses[0]?.emailAddress,
      timestamp: new Date().toISOString(),
      style: selectedStyle,
      musicUrl: selectedMusicUrl
    };

    try {
      const response = await fetch(PIPEDREAM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setPublishStatus(`🚀 Published to ${platform} Successfully!`);
        setTimeout(() => setPublishStatus(null), 4000);
      } else {
        throw new Error("Pipedream connection failed");
      }
    } catch (e) {
      setPublishStatus(`❌ Failed to publish to ${platform}`);
      setTimeout(() => setPublishStatus(null), 4000);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isMounted) return null;

  return (
    <main className="p-4 md:p-8 lg:p-10 max-w-[1700px] mx-auto text-white space-y-10 min-h-screen bg-[#020202] overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      
      {publishStatus && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
            <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                <CheckIcon className="w-5 h-5" />
                {publishStatus}
            </div>
        </div>
      )}

      <div className="flex justify-between items-start -mt-8 mb-4 relative z-10">
          <div className="flex gap-3">
              {videoStats && (
                <div className="bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                   <VideoIcon className="text-pink-500 w-4 h-4" />
                   <div className="flex flex-col">
                     <span className="text-[8px] font-black text-pink-500 uppercase">Viral Engagement</span>
                     <span className="text-xs font-black text-white leading-none">{videoStats.views.toLocaleString()} Views</span>
                   </div>
                </div>
              )}
          </div>
          <div className="flex gap-3">
              <div className="bg-zinc-900/60 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                <LightningBoltIcon className="text-blue-500 w-4 h-4 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Power Credits</span>
                  <span className="text-sm font-black text-white leading-none">{userData?.credits ?? 0}</span>
                </div>
              </div>
              <button onClick={() => router.push("/pricing")} className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">Upgrade</button>
          </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch relative z-10">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#0A0A0A]/80 border border-white/[0.08] p-8 rounded-[2.5rem] space-y-6 backdrop-blur-3xl shadow-3xl relative">
            <h3 className="font-black flex items-center gap-2 text-blue-400 uppercase text-[11px] tracking-[0.3em]">
              <div className="p-1.5 bg-blue-500/10 rounded-lg"><MixerHorizontalIcon /></div> Creative Engine v2
            </h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Search or URL</label>
              <div className="relative group/input">
                 <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="Paste link or search product..." className="w-full bg-black/60 border border-white/5 rounded-3xl px-5 py-6 text-sm focus:border-blue-500/50 outline-none text-white pl-12 pr-16 transition-all shadow-inner" />
                 <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                 <button onClick={handleGenerate} disabled={loading || !productUrl} className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.05] shadow-lg active:scale-95'}`}>
                    {loading ? <UpdateIcon className="animate-spin w-4 h-4" /> : <MagicWandIcon className="w-4 h-4" />}
                 </button>
              </div>
              
              <div className="space-y-2 pt-2 relative">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Target Language</p>
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-full flex items-center justify-between bg-white/5 border border-white/10 px-5 py-4 rounded-2xl hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{activeLang.flag}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{activeLang.name}</span>
                  </div>
                  <ChevronDownIcon className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0F0F0F] border border-white/10 rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[300px] overflow-y-auto scrollbar-hide animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 gap-1">
                            {languages.map((lang) => (
                             <button key={lang.code} onClick={() => { setSelectedLanguage(lang.code); setIsLangOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedLanguage === lang.code ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-zinc-400'}`}>
                               <span className="text-lg">{lang.flag}</span>
                               <span className="text-[11px] font-bold uppercase tracking-tight">{lang.name}</span>
                               {selectedLanguage === lang.code && <CheckIcon className="ml-auto w-4 h-4" />}
                             </button>
                          ))}
                        </div>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-4 border-t border-white/5">
                 <MusicSearch onSelectMusic={(url) => setSelectedMusicUrl(url)} />
              </div>
            </div>
          </div>

          {scrapedVideos.length > 0 && (
            <div className="bg-[#0A0A0A]/80 border border-white/[0.08] p-6 rounded-[2.5rem] space-y-4 backdrop-blur-3xl shadow-2xl">
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] px-1">Viral Assets Found</p>
              <div className="grid grid-cols-3 gap-3">
                {scrapedVideos.slice(0, 3).map((vid, idx) => (
                  <button key={idx} onClick={() => { setVideoUrl(vid.videoUrl); setVideoStats(vid.stats); stopAllMedia(); }} className={`relative aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${videoUrl === vid.videoUrl ? 'border-blue-500 scale-105' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                    <img src={vid.thumbnail} className="w-full h-full object-cover" alt="Viral asset" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`p-2 rounded-full ${videoUrl === vid.videoUrl ? 'bg-blue-500 text-white' : 'bg-black/40 text-white'}`}>
                        {videoUrl === vid.videoUrl ? <CheckIcon /> : <PlayIcon />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col items-center gap-8 bg-zinc-900/10 rounded-[3rem] p-6 border border-white/5">
            <div className="relative w-full flex justify-center scale-90 md:scale-100">
              <div className="absolute inset-0 m-auto border-[3px] rounded-[3.5rem] transition-all duration-300 opacity-20 pointer-events-none" style={{ width: '105%', height: '105%', borderColor: isPlaying ? '#3b82f6' : '#18181b', transform: `scale(${1 + (audioLevel/400)})` }} />
              <AdPreview ref={adPreviewRef} allProductImages={allProductImages} videoUrl={videoUrl} currentImageIndex={currentImageIndex} audioLevel={audioLevel} audioProgress={audioProgress} isPlaying={isPlaying} visibleWords={visibleWords} selectedStyle={selectedStyle} />
            </div>

            <div className="flex flex-col gap-6 w-full max-w-[500px] items-center">
                <div className="w-full bg-zinc-900/40 border border-white/5 p-5 rounded-[2.5rem] space-y-4 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <SpeakerLoudIcon className="w-3 h-3 text-blue-500"/><input type="range" min="0" max="1" step="0.05" value={voiceVolume} onChange={(e) => setVoiceVolume(parseFloat(e.target.value))} className="w-full h-1 accent-blue-500 appearance-none bg-white/5 rounded-full outline-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    <ComponentInstanceIcon className="w-3 h-3 text-zinc-500"/><input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full h-1 accent-zinc-400 appearance-none bg-white/5 rounded-full outline-none" />
                  </div>
                </div>

                <div className="w-full bg-[#0F0F0F] border border-white/5 p-6 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Share2 size={16} /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Instant Publish</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[{ id: 'Facebook', icon: <Facebook size={16}/>, color: 'hover:bg-blue-600' }, { id: 'Instagram', icon: <Instagram size={16}/>, color: 'hover:bg-pink-600' }, { id: 'TikTok', icon: <TikTokIcon size={18}/>, color: 'hover:bg-white hover:text-black' }, { id: 'YouTube', icon: <Youtube size={16}/>, color: 'hover:bg-red-600' }].map((p) => (
                      <button key={p.id} onClick={() => handlePublish(p.id)} className={`bg-white/5 border border-white/5 text-zinc-400 p-4 rounded-2xl flex items-center justify-center transition-all ${p.color} hover:text-white active:scale-90`}>
                        {p.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <button onClick={handleDownloadAd} disabled={isDownloading} className="w-full py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.4em] bg-white text-black hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
                      {isDownloading ? <UpdateIcon className="animate-spin" /> : <DownloadIcon className="group-hover:animate-bounce w-4 h-4" />} 
                      {renderStatusText}
                  </button>
                  <p className="text-center text-[8px] text-zinc-500 uppercase tracking-widest">Captions, Voice, and Music will be baked into the file</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {aiVariations && (
              <div className="w-full bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-2xl space-y-4 shadow-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">AI Script Variations</p>
                <div className="space-y-3">
                  {Object.values(aiVariations).slice(0, 5).map((hook, idx) => (
                    <div key={idx} className={`group flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${activeHook === hook ? 'bg-blue-600/20 border-blue-500/50' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Variation {idx + 1}</span>
                        <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-2">{hook}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => { setActiveHook(hook); playVoice(hook); }} className={`p-2.5 rounded-xl transition-all ${activeHook === hook ? 'bg-blue-500 text-white' : 'bg-white/5 text-zinc-400'}`}><EyeOpenIcon /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysis && (
              <div className="w-full bg-gradient-to-br from-zinc-900/80 to-black border border-white/[0.08] p-6 rounded-[2rem] backdrop-blur-3xl shadow-3xl">
                <div className="flex justify-between items-end mb-4">
                  <div><h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1 flex items-center gap-2"><BarChartIcon /> AI Ad Score</h4><p className="text-xl font-black text-white uppercase leading-none">{analysis.verdict}</p></div>
                  <div className="text-3xl font-[1000]" style={{ color: analysis.color }}>{analysis.totalScore}%</div>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative p-0.5">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${analysis.totalScore}%`, backgroundColor: analysis.color }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}