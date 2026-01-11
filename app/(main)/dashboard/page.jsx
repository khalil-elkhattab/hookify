"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  Link2Icon, MixerHorizontalIcon, 
  PlayIcon, ChevronDownIcon, 
  ImageIcon, RocketIcon, UpdateIcon,
  ShadowIcon, PlusIcon, GlobeIcon,
  StarFilledIcon, SpeakerLoudIcon,
  LightningBoltIcon,
  ComponentInstanceIcon,
  HeartIcon,
  MagicWandIcon,
  LaptopIcon,
  SpeakerModerateIcon,
  Cross2Icon 
} from "@radix-ui/react-icons";

// --- Sub-components ---
import Header from "./_components/Header";
import AdsQueue from "./_components/AdsQueue";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// --- New Component: AdConnector (Integrated & Updated) ---
function AdConnector({ userId }) {
  const accounts = useQuery(api.platforms.getConnectedAccounts, { userId }) || [];

  const platforms = [
    { id: 'tiktok', name: 'TikTok Ads', color: 'bg-[#FE2C55]', authUrl: '/api/auth/tiktok' },
    { id: 'meta', name: 'Meta / FB / IG', color: 'bg-[#0668E1]', authUrl: '/api/auth/meta' },
    { id: 'google', name: 'Google / YouTube', color: 'bg-[#4285F4]', authUrl: '/api/auth/google' }
  ];

  return (
    <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-3xl space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ad Channels</h3>
        <span className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
          {accounts.length} Active
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {platforms.map((p) => {
          const isConnected = accounts.some(acc => acc.platform === p.id);
          return (
            <div key={p.id} className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${p.color} shadow-lg`} />
                <span className="text-[11px] font-bold text-zinc-300">{p.name}</span>
              </div>
              
              {isConnected ? (
                <span className="text-[9px] text-green-500 font-black uppercase tracking-tighter flex items-center gap-1 animate-pulse">
                    ● Connected
                </span>
              ) : (
                <button 
                  onClick={() => window.location.href = p.authUrl}
                  className="text-[9px] font-black text-blue-500 hover:text-white transition-colors border border-blue-500/10 px-2 py-1 rounded-md hover:bg-blue-600"
                >
                  CONNECT API
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Product Source Selector ---
function ProductSourceSelector({ onSelect, selected }) {
  const sources = [
    { id: 'aliexpress', name: 'AliExpress', color: 'bg-orange-600' },
    { id: 'cj', name: 'CJ Drop', color: 'bg-red-500' },
    { id: 'zendrop', name: 'Zendrop', color: 'bg-blue-400' },
    { id: 'shopify', name: 'Shopify', color: 'bg-green-600' }
  ];

  return (
    <div className="space-y-2 mb-6">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Source</label>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sources.map((src) => (
          <button
            key={src.id}
            onClick={() => onSelect(src.id)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border shrink-0
              ${selected === src.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/10'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${src.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
            {src.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function StoreSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const stores = useQuery(api.stores.get) || [];
  const addStore = useMutation(api.stores.add);
  const [newStoreUrl, setNewStoreUrl] = useState("");

  const handleAddStore = async () => {
    if (!newStoreUrl.includes(".")) return alert("Please enter a valid store URL");
    try {
      await addStore({ 
        storeName: newStoreUrl.split(".")[0], 
        storeUrl: newStoreUrl,
        platform: "shopify",
        userId: "current_user" 
      });
      setNewStoreUrl("");
      alert("✅ Store linked successfully!");
    } catch (e) { alert("Error adding store"); }
  };

  return (
    <div className="relative w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between transition-all group shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg group-hover:bg-blue-600/30 transition-colors">
            <ShadowIcon className="text-blue-500 w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">My Stores</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {stores.length > 0 ? `${stores.length} Active Domains` : "No stores connected"}
            </p>
          </div>
        </div>
        <ChevronDownIcon className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl p-4 z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-3">
            {stores.map((store) => (
              <div key={store._id} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="text-blue-500 w-3 h-3" />
                  <span className="text-[11px] font-medium text-zinc-300">{store.storeUrl}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
            <div className="pt-2 border-t border-white/5 mt-2 flex gap-2">
              <input type="text" placeholder="store-name.myshopify.com" value={newStoreUrl} onChange={(e) => setNewStoreUrl(e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-[10px] outline-none text-white" />
              <button onClick={handleAddStore} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg"><PlusIcon className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const backgroundTracks = [
  { id: "none", label: "No Music", url: "", icon: <SpeakerLoudIcon/> },
  { id: "hype", label: "🔥 Viral Hype", url: "/music/hype.mp3", icon: <LightningBoltIcon/> },
  { id: "fast", label: "⚡ Fast Ads", url: "/music/fast.mp3", icon: <RocketIcon/> },
  { id: "luxury", label: "💎 Luxury Style", url: "/music/luxury.mp3", icon: <MagicWandIcon/> },
  { id: "minimal", label: "✨ Clean Minimal", url: "/music/minimal.mp3", icon: <ComponentInstanceIcon/> },
  { id: "story", label: "🤳 UGC Story", url: "/music/story.mp3", icon: <HeartIcon/> },
  { id: "tech", label: "💻 Tech Modern", url: "/music/tech.mp3", icon: <LaptopIcon/> },
  { id: "arabic", label: "🎵 Arabic Beats", url: "/music/arabic.mp3", icon: <GlobeIcon/> },
];

export default function HookifyDashboard() {
  const languages = ["Arabic (Modern)", "English (US)", "French", "Spanish", "German"];
  const videoStyles = ["Viral Hormozi", "MrBeast Style", "Luxury", "UGC"];

  const [productUrl, setProductUrl] = useState("");
  const [selectedSource, setSelectedSource] = useState("aliexpress"); 
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedStyle, setSelectedStyle] = useState(videoStyles[0]);
  const [selectedMusic, setSelectedMusic] = useState("none");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [generatedHooks, setGeneratedHooks] = useState(null);
  const [activeHook, setActiveHook] = useState("AI Ad Engine Ready...");
  const [allProductImages, setAllProductImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.1);

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    tiktok: true,
    meta: false,
    google: false,
  });

  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { 
    setIsMounted(true); 
    return () => {
      if (voiceRef.current) voiceRef.current.pause();
      if (musicRef.current) musicRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVolume;
    if (voiceRef.current) voiceRef.current.volume = voiceVolume;
  }, [musicVolume, voiceVolume]);

  useEffect(() => {
    if (isPlaying && activeHook) {
      const words = activeHook.split(" ");
      let i = 0;
      const wordInterval = setInterval(() => {
        setVisibleWords(words.slice(0, i + 1));
        i++;
        if (i >= words.length) clearInterval(wordInterval);
      }, 220); 
      return () => clearInterval(wordInterval);
    } else if (!isPlaying) { setVisibleWords([]); }
  }, [activeHook, isPlaying]);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAllProductImages(prev => [imageUrl, ...prev]);
      setCurrentImageIndex(0);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setAllProductImages((prev) => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      if (currentImageIndex >= updated.length) {
        setCurrentImageIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const startAnalyzing = (audioElement) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const context = audioContextRef.current;
      if (context.state === 'suspended') context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64; 
      if (!audioSourceRef.current) {
        audioSourceRef.current = context.createMediaElementSource(audioElement);
      }
      audioSourceRef.current.connect(analyser);
      analyser.connect(context.destination);
      const update = () => {
        if (!isPlaying) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        requestAnimationFrame(update);
      };
      update();
    } catch (e) { console.warn("Visualizer blocked"); }
  };

  const playVoice = async (text) => {
    try {
      if (voiceRef.current) { voiceRef.current.pause(); voiceRef.current.src = ""; }
      if (musicRef.current) { musicRef.current.pause(); musicRef.current.src = ""; }
      setIsPlaying(true);
      setAudioProgress(0);
      const track = backgroundTracks.find(t => t.id === selectedMusic);
      if (selectedMusic !== "none" && track?.url) {
        const bgMusic = new Audio(track.url);
        bgMusic.volume = musicVolume;
        bgMusic.loop = true;
        bgMusic.play().catch(() => {});
        musicRef.current = bgMusic;
      }
      const response = await fetch("/api/generate/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: selectedLanguage }),
      });
      if (!response.ok) throw new Error("API Connection Failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const voiceAudio = new Audio(url);
      voiceAudio.volume = voiceVolume;
      voiceRef.current = voiceAudio;
      voiceAudio.ontimeupdate = () => {
        const prog = (voiceAudio.currentTime / voiceAudio.duration) * 100;
        setAudioProgress(prog || 0);
        const rotateIndex = Math.floor(voiceAudio.currentTime / 3) % (allProductImages.length || 1);
        setCurrentImageIndex(rotateIndex);
      };
      voiceAudio.onplay = () => startAnalyzing(voiceAudio);
      voiceAudio.onended = () => { 
        setIsPlaying(false); 
        setAudioLevel(0); 
        if (musicRef.current) musicRef.current.pause();
      };
      await voiceAudio.play();
    } catch (err) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = voiceVolume;
      utterance.onstart = () => {
        const duration = text.length * 80;
        const start = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - start;
          const prog = (elapsed / duration) * 100;
          setAudioProgress(Math.min(prog, 100));
          if (prog >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            if (musicRef.current) musicRef.current.pause();
          }
        }, 100);
      };
      synth.speak(utterance);
    }
  };

  const handleGenerate = async () => {
    if (!productUrl) return alert("Please paste a link!");
    setLoading(true);
    setLoadingStatus(`🔍 Analyzing ${selectedSource} Product...`);
    try {
      const scrapeRes = await fetch("/api/generate/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl, source: selectedSource })
      });
      const scrapeData = await scrapeRes.json();
      
      let finalTitle = "";
      if (scrapeData.success) {
        setLoadingStatus("🖼️ Media Assets Loaded...");
        setAllProductImages(scrapeData.allImages || [scrapeData.mainImage]);
        finalTitle = scrapeData.title;
      }

      setLoadingStatus("✍️ Writing 30s Viral Scripts...");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productUrl, 
          language: selectedLanguage, 
          style: selectedStyle, 
          productTitle: finalTitle || "", 
          scriptMode: "full_30s"
        }),
      });
      const data = await response.json();

      setLoadingStatus("🎙️ Tuning AI Voice Engine...");
      setGeneratedHooks(data); 
      const scriptToPlay = data.script_1 || data.problem_hook;
      setActiveHook(scriptToPlay); 

      setLoadingStatus("✨ Finalizing Ad Assets...");
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("");
        playVoice(scriptToPlay);
      }, 1000);

    } catch (error) { 
      setLoading(false);
      setLoadingStatus("");
      alert("Something went wrong. Please try again.");
    }
  };

  // --- NEW INTEGRATED PUBLISH FUNCTION ---
  const handlePublish = async () => {
    const activePlats = Object.values(selectedPlatforms).filter(Boolean).length;
    if (activePlats === 0) return alert("Select at least one platform!");
    if (allProductImages.length === 0) return alert("No product images found to create video!");

    setIsPublishing(true);
    try {
        // 1. Create the actual MP4 file on the server
        const videoGenRes = await fetch("/api/generate/video-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: activeHook,
                images: allProductImages,
                music: selectedMusic,
                language: selectedLanguage
            })
        });
        const videoData = await videoGenRes.json();

        if (!videoData.success) throw new Error("Video generation failed");

        // 2. Upload to selected platforms (Example: Google/YouTube)
        if (selectedPlatforms.google) {
            await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "AI Ad: " + activeHook.substring(0, 30),
                    videoPath: videoData.path,
                })
            });
        }

        alert(`🚀 Campaign Successfully Launched on ${activePlats} Platforms!`);
    } catch (err) {
        alert("Publishing Error: " + err.message);
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1700px] mx-auto text-white space-y-10 min-h-screen bg-[#020202]">
      <Header />
      <div className="grid grid-cols-12 gap-8 items-stretch">
        
        {/* العمود الأيسر: محرك الإبداع */}
        <div className="col-span-12 lg:col-span-4 order-2 lg:order-1 flex flex-col gap-6">
          <div className="space-y-4">
            <StoreSelector />
            <AdConnector userId="current_user" /> 
          </div>
          
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-2 backdrop-blur-xl h-full flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10" />
            <h3 className="font-bold flex items-center gap-2 text-blue-500 uppercase text-xs tracking-[0.2em] italic mb-6"><MixerHorizontalIcon/> Creative Engine</h3>
            
            <div className="space-y-6 flex-1">
              <ProductSourceSelector selected={selectedSource} onSelect={setSelectedSource} />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Paste Product Link</label>
                <div className="relative group">
                   <input 
                    type="text" 
                    value={productUrl} 
                    onChange={(e) => setProductUrl(e.target.value)} 
                    placeholder={`Paste ${selectedSource} link here...`} 
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none text-white transition-all pl-12" 
                   />
                   <Link2Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Double Hook Assets</label>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-bold text-blue-500 hover:text-white transition-colors flex items-center gap-1">
                    <PlusIcon className="w-3 h-3"/> UPLOAD FROM PC
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide min-h-[70px]">
                  {allProductImages.map((img, i) => (
                    <div key={i} className="relative group shrink-0">
                      <img 
                        src={img} 
                        onClick={() => setCurrentImageIndex(i)} 
                        className={`w-14 h-14 rounded-xl object-cover border-2 transition-all cursor-pointer ${currentImageIndex === i ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow-xl z-30 opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                      >
                        <Cross2Icon className="w-3 h-3" />
                      </button>
                      {i === 0 && <span className="absolute -top-1 -left-1 bg-blue-600 text-[8px] font-black px-1.5 rounded-md shadow-lg pointer-events-none z-10">HOOK</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Voice Dialect</label>
                   <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl p-3 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Video Style</label>
                   <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl p-3 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    {videoStyles.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><SpeakerLoudIcon className="w-3 h-3 text-blue-500"/> Background Mood</label>
                <div className="flex flex-wrap gap-2">
                  {backgroundTracks.map((track) => (
                    <button key={track.id} onClick={() => setSelectedMusic(track.id)} className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all flex items-center gap-1.5 ${selectedMusic === track.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105' : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/20'}`}>{track.icon}{track.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className={`relative overflow-hidden w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] transition-all shadow-xl mt-6 ${loading ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-blue-600 hover:bg-white hover:text-black shadow-blue-600/20 active:scale-95"}`}>
              <span className="relative z-10">{loading ? loadingStatus : "GENERATE 30s ADS"}</span>
              {loading && <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />}
            </button>
          </div>
        </div>

        {/* فيديو العرض (الوسط) */}
        <div className="col-span-12 lg:col-span-4 order-1 lg:order-2 flex flex-col justify-center items-center gap-6">
          <div className="bg-[#050505] border-[12px] border-[#1a1a1a] rounded-[3.5rem] aspect-[9/16] w-full max-w-[320px] relative shadow-2xl overflow-hidden ring-1 ring-white/10 group">
            <div className="absolute top-4 inset-x-8 h-1 bg-white/10 rounded-full overflow-hidden z-50">
                <div className="h-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_10px_#3b82f6]" style={{ width: `${audioProgress}%` }} />
            </div>
            <div className="absolute top-0 inset-x-0 h-[65%] z-0 flex items-center justify-center bg-[#080808] overflow-hidden">
                {allProductImages.length > 0 ? (
                  allProductImages.map((img, idx) => (
                    <img key={idx} src={img} style={{ 
                        display: idx === currentImageIndex ? 'block' : 'none',
                        transform: isMounted ? `scale(${1.15 + (audioLevel / 220)}) rotate(${idx === 0 ? 0 : (idx % 2 === 0 ? 0.3 : -0.3)}deg)` : 'scale(1.15)',
                        filter: `brightness(${1 + audioLevel / 150}) contrast(1.05)`,
                        transition: 'transform 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                      }} className={`w-[85%] h-[80%] object-contain z-10 drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]`} 
                    />
                  ))
                ) : <div className="flex flex-col items-center gap-4 text-zinc-800"><PlayIcon className="w-12 h-12 animate-pulse" /><p className="text-[10px] font-black uppercase tracking-widest">Ready to Build</p></div>}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black via-black/95 to-transparent z-30 flex flex-col justify-center items-center pb-10 px-8">
                <div 
                  contentEditable={!isPlaying}
                  onBlur={(e) => setActiveHook(e.currentTarget.innerText)}
                  dangerouslySetInnerHTML={{ __html: isPlaying ? 
                    visibleWords.map((word, idx) => `<span style="color: ${idx === visibleWords.length - 1 ? '#3b82f6' : 'white'};" class="text-[18px] font-[1000] italic uppercase tracking-tighter">${word}</span>`).join(' ') 
                    : `<span class="text-[11px] text-zinc-400 italic font-bold leading-relaxed text-center">${activeHook}</span>` 
                  }}
                  className={`flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-center outline-none cursor-text transition-all ${!isPlaying ? 'border border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-3 bg-white/5' : ''}`}
                />
            </div>
          </div>
          
          <div className="w-full max-w-[320px] bg-zinc-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-4">
              <SpeakerLoudIcon className="text-zinc-500 w-4 h-4" />
              <input type="range" min="0" max="1" step="0.05" value={voiceVolume} onChange={(e) => setVoiceVolume(parseFloat(e.target.value))} className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              <span className="text-[10px] font-black text-blue-500 w-8">AI</span>
            </div>
            <div className="flex items-center gap-4">
              <SpeakerModerateIcon className="text-zinc-500 w-4 h-4" />
              <input type="range" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" />
              <span className="text-[10px] font-black text-zinc-400 w-8">BGM</span>
            </div>
          </div>

          {/* New: Multi-Platform Selection UI */}
          <div className="w-full max-w-[320px] space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Publish To</label>
            <div className="flex gap-2">
              {['tiktok', 'meta', 'google'].map((plt) => (
                <button 
                  key={plt}
                  onClick={() => togglePlatform(plt)}
                  className={`flex-1 py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                    selectedPlatforms[plt] 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                    : 'bg-black/40 border-white/5 text-zinc-600 opacity-50'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter">
                    {plt === 'meta' ? 'Instagram' : plt === 'google' ? 'YouTube' : 'TikTok'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handlePublish} 
            disabled={isPublishing} 
            className="w-full max-w-[320px] py-6 rounded-[2.2rem] bg-white text-black font-[1000] text-[10px] tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
          >
              {isPublishing ? <UpdateIcon className="animate-spin w-5 h-5" /> : <RocketIcon className="w-5 h-5" />}
              <span>{isPublishing ? "LAUNCHING..." : "PUBLISH 30s CAMPAIGN"}</span>
          </button>
        </div>

        {/* Ads Queue (العمود الأيمن) */}
        <div className="col-span-12 lg:col-span-4 order-3 h-full sticky top-10">
          <AdsQueue hooks={generatedHooks} isLoading={loading} onPreviewClick={(txt) => { setActiveHook(txt); playVoice(txt); }} />
        </div>
      </div>
    </div>
  );
}