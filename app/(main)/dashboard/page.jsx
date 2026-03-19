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
import { Share2, Facebook, Instagram, Youtube, Send, Layers, Activity, MousePointer2, Move } from "lucide-react"; 

// استيراد المكون الجديد
import MagicRadar from "../../components/MagicRadar"; 

// TikTok Icon Component
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

import AdPreview from "./_components/AdPreview";
import { analyzeHook } from "./_components/scoring-engine";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import MusicSearch from "../../components/MusicSearch";

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

  useEffect(() => { if (musicRef.current) musicRef.current.volume = musicVolume; }, [musicVolume]);
  useEffect(() => { if (voiceRef.current) voiceRef.current.volume = voiceVolume; }, [voiceVolume]);

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

  const handleDownloadAd = async () => {
    if (!activeHook || activeHook === "AI Ad Engine Ready...") return alert("Generate an ad first!");
    setIsDownloading(true);
    setRenderStatusText("INITIALIZING...");
    try {
      const response = await fetch("/api/generate/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            aiScript: activeHook, videoUrl, selectedMusic: selectedMusicUrl, selectedStyle,
            aiVoiceUrl, storeName: "Hookify Store", activeOffer: "SPECIAL OFFER",
            logoPos: { x: 20, y: 20 }, namePos: { x: 20, y: 80 }, offerPos: { x: 20, y: 120 }
        })
      });
      const initialData = await response.json();
      if (!initialData.response || !initialData.response.id) throw new Error(initialData.details || "Render Request Refused");
      const renderId = initialData.response.id;
      const checkInterval = setInterval(async () => {
        setRenderStatusText("RENDERING IN CLOUD...");
        try {
          const statusRes = await fetch(`https://api.shotstack.io/stage/render/${renderId}`, {
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY, 'Content-Type': 'application/json' }
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
            await trackExport({ style: selectedStyle, text: activeHook, videoUrl: finalVideoUrl });
            setIsDownloading(false);
            setRenderStatusText("✅ DOWNLOAD READY");
            setTimeout(() => setRenderStatusText("DOWNLOAD FINAL VIDEO"), 3000);
          } else if (currentStatus === 'failed') {
            clearInterval(checkInterval);
            throw new Error("Render Failed Internally");
          }
        } catch (err) { console.error("Polling Error:", err); }
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
    try {
      const response = await fetch(PIPEDREAM_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform, text: activeHook, videoUrl: videoUrl || "Image Sequence",
          product: productUrl, userEmail: user?.emailAddresses[0]?.emailAddress,
          timestamp: new Date().toISOString(), style: selectedStyle, musicUrl: selectedMusicUrl
        })
      });
      if (response.ok) {
        setPublishStatus(`🚀 Published to ${platform} Successfully!`);
        setTimeout(() => setPublishStatus(null), 4000);
      } else throw new Error("Pipedream connection failed");
    } catch (e) {
      setPublishStatus(`❌ Failed to publish to ${platform}`);
      setTimeout(() => setPublishStatus(null), 4000);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />

      {/* NAV BAR */}
      <nav className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <LightningBoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-lg">HOOKIFY <span className="text-blue-500">PRO</span></span>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{loadingStatus || "System Ready"}</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Power Credits</span>
                <span className="text-sm font-black text-white">{userData?.credits ?? 0}</span>
            </div>
            <button onClick={() => router.push("/pricing")} className="bg-white text-black px-4 py-1.5 rounded-lg text-xs font-black hover:bg-blue-500 hover:text-white transition-all">UPGRADE</button>
        </div>
      </nav>

      {/* DASHBOARD GRID */}
      <div className="relative z-10 p-6 grid grid-cols-12 gap-6 h-[calc(100vh-70px)]">
        
        {/* LEFT PANEL */}
        <section className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <MousePointer2 size={12} /> Input Node
                </h3>
                
                <div className="space-y-5">
                    {/* المكون الجديد: Magic Radar Button */}
                    <div className="pb-2">
                      <MagicRadar keyword={productUrl} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase">Product Link or Name</label>
                        <div className="relative">
                            <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-blue-500 outline-none transition-all" />
                            <button onClick={handleGenerate} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg">
                                {loading ? <UpdateIcon className="animate-spin w-3 h-3" /> : <MagicWandIcon className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase">Target Audience</label>
                        <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-full flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs">
                            <span className="flex items-center gap-2">{activeLang.flag} {activeLang.name}</span>
                            <ChevronDownIcon />
                        </button>
                    </div>

                    <MusicSearch onSelectMusic={(url) => setSelectedMusicUrl(url)} />
                </div>
            </div>

            {scrapedVideos.length > 0 && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-4">Asset Library</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {scrapedVideos.slice(0, 4).map((vid, idx) => (
                            <button key={idx} onClick={() => { setVideoUrl(vid.videoUrl); setVideoStats(vid.stats); }} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${videoUrl === vid.videoUrl ? 'border-blue-600' : 'border-transparent opacity-50'}`}>
                                <img src={vid.thumbnail} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>

        {/* CENTER PANEL */}
        <section className="col-span-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute left-[-30px] top-1/2 w-[30px] h-[2px] bg-gradient-to-r from-blue-600/50 to-transparent" />
            <div className="absolute right-[-30px] top-1/2 w-[30px] h-[2px] bg-gradient-to-l from-blue-600/50 to-transparent" />
            
            <div className="relative group flex items-center justify-center h-full max-h-[75vh] w-full max-w-[360px] aspect-[9/16] transition-transform duration-500">
                <div className="absolute -inset-10 bg-blue-600/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <AdPreview 
                    ref={adPreviewRef} 
                    allProductImages={allProductImages} 
                    videoUrl={videoUrl} 
                    currentImageIndex={currentImageIndex} 
                    audioLevel={audioLevel} 
                    audioProgress={audioProgress} 
                    isPlaying={isPlaying} 
                    visibleWords={visibleWords} 
                    selectedStyle={selectedStyle} 
                />
            </div>

            <div className="mt-6 w-full max-w-sm space-y-4 px-4">
                <div className="flex gap-4 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3"><SpeakerLoudIcon className="w-3 h-3 text-blue-500" /><input type="range" min="0" max="1" step="0.05" value={voiceVolume} onChange={(e) => setVoiceVolume(parseFloat(e.target.value))} className="w-full h-1 accent-blue-500 bg-white/10 rounded-full appearance-none" /></div>
                        <div className="flex items-center gap-3"><ComponentInstanceIcon className="w-3 h-3 text-zinc-500" /><input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full h-1 accent-zinc-500 bg-white/10 rounded-full appearance-none" /></div>
                    </div>
                </div>
            </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="col-span-3 flex flex-col gap-4 overflow-y-auto pl-2 scrollbar-hide">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-green-500" />
                <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Activity size={12} /> Optimization Node
                </h3>
                
                {analysis ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-400">Viral Potential</span>
                            <span className="text-2xl font-black" style={{ color: analysis.color }}>{analysis.totalScore}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full transition-all duration-1000" style={{ width: `${analysis.totalScore}%`, backgroundColor: analysis.color }} />
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5 italic">"{analysis.verdict}"</p>
                    </div>
                ) : (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-xl">
                        <p className="text-[9px] font-black text-zinc-600 uppercase">Awaiting AI Script...</p>
                    </div>
                )}
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 shadow-2xl">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Export Pipeline</h3>
                <div className="space-y-3">
                    <button onClick={handleDownloadAd} disabled={isDownloading} className="w-full py-4 rounded-xl bg-white text-black font-black text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        {isDownloading ? <UpdateIcon className="animate-spin" /> : <DownloadIcon className="w-4 h-4" />} {renderStatusText}
                    </button>
                    <div className="grid grid-cols-4 gap-2">
                         {[
                           { id: 'FB', icon: <Facebook size={14}/>, color: 'hover:bg-blue-600' },
                           { id: 'IG', icon: <Instagram size={14}/>, color: 'hover:bg-pink-600' },
                           { id: 'TT', icon: <TikTokIcon size={14}/>, color: 'hover:bg-zinc-200 hover:text-black' },
                           { id: 'YT', icon: <Youtube size={14}/>, color: 'hover:bg-red-600' }
                         ].map((p) => (
                            <button key={p.id} onClick={() => handlePublish(p.id)} className={`aspect-square bg-white/5 rounded-lg flex items-center justify-center text-zinc-500 transition-all ${p.color} hover:text-white`}>
                                {p.icon}
                            </button>
                         ))}
                    </div>
                </div>
            </div>

            {aiVariations && (
                <div className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 overflow-y-auto">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Variation Stack</h3>
                    <div className="space-y-2">
                        {Object.values(aiVariations).map((hook, idx) => (
                            <button key={idx} onClick={() => { setActiveHook(hook); playVoice(hook); }} 
                                    className={`w-full text-left p-3 rounded-xl border text-[10px] transition-all ${activeHook === hook ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                                <div className="text-zinc-500 font-bold mb-1 italic">#{idx + 1} Variation</div>
                                <p className="line-clamp-2 leading-relaxed">{hook}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>
      </div>

      {/* MODALS & NOTIFICATIONS */}
      {isLangOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLangOpen(false)} />
              <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Select Language Engine</h2>
                  <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                      {languages.map((lang) => (
                          <button key={lang.code} onClick={() => { setSelectedLanguage(lang.code); setIsLangOpen(false); }} 
                                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${selectedLanguage === lang.code ? 'bg-blue-600' : 'bg-white/5 hover:bg-white/10'}`}>
                              <span className="text-lg">{lang.flag}</span>
                              <span className="text-[10px] font-bold uppercase">{lang.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {publishStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                <CheckIcon className="w-4 h-4" /> {publishStatus}
            </div>
        </div>
      )}
    </main>
  );
}