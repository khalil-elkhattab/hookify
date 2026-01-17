"use client";
import React, { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { 
  Link2Icon, MixerHorizontalIcon, 
  PlayIcon, ChevronDownIcon, 
  RocketIcon, UpdateIcon,
  ShadowIcon, PlusIcon, GlobeIcon,
  SpeakerLoudIcon,
  LightningBoltIcon,
  ComponentInstanceIcon,
  HeartIcon,
  MagicWandIcon,
  LaptopIcon,
  SpeakerModerateIcon,
  Cross2Icon 
} from "@radix-ui/react-icons";

// --- Components ---
import Header from "./_components/Header";
import AdsQueue from "./_components/AdsQueue";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

// --- Sub-Components ---
function AdConnector({ userId }) {
  const accounts = useQuery(api.social?.getConnectedAccounts, { userId: userId }) || [];
  const platforms = [
    { id: 'tiktok', name: 'TikTok Ads', color: 'bg-[#FE2C55]', authUrl: '/api/auth/tiktok' },
    { id: 'meta', name: 'Meta / FB / IG', color: 'bg-[#0668E1]', authUrl: '/api/auth/meta' },
    { id: 'google', name: 'Google / YouTube', color: 'bg-[#4285F4]', authUrl: '/api/auth/google' }
  ];

  return (
    <section className="bg-zinc-900/40 border border-white/5 p-5 rounded-3xl space-y-3 shadow-inner">
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
                <div className={`w-2 h-2 rounded-full ${p.color} shadow-lg`} aria-hidden="true" />
                <span className="text-[11px] font-bold text-zinc-300">{p.name}</span>
              </div>
              {isConnected ? (
                <span className="text-[9px] text-green-500 font-black uppercase tracking-tighter flex items-center gap-1 animate-pulse">● Connected</span>
              ) : (
                <button 
                  onClick={() => window.location.href = p.authUrl} 
                  title={`Connect to ${p.name}`}
                  className="text-[9px] font-black text-blue-500 hover:text-white transition-colors border border-blue-500/10 px-2 py-1 rounded-md hover:bg-blue-600"
                >
                  CONNECT API
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProductSourceSelector({ onSelect, selected }) {
  const sources = [
    { id: 'aliexpress', name: 'AliExpress', color: 'bg-orange-600' }, 
    { id: 'cj', name: 'CJ Drop', color: 'bg-red-500' }, 
    { id: 'zendrop', name: 'Zendrop', color: 'bg-blue-400' }, 
    { id: 'shopify', name: 'Shopify', color: 'bg-green-600' }
  ];
  return (
    <div className="space-y-2 mb-6">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Source</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="radiogroup" aria-label="Select product source">
        {sources.map((src) => (
          <button 
            key={src.id} 
            role="radio"
            aria-checked={selected === src.id}
            onClick={() => onSelect(src.id)} 
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border shrink-0 ${selected === src.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/10'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${src.color}`} aria-hidden="true" />
            {src.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function StoreSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const stores = useQuery(api.stores?.get) || [];
  const addStore = useMutation(api.stores?.add);
  const [newStoreUrl, setNewStoreUrl] = useState("");

  const handleAddStore = async () => {
    if (!newStoreUrl.includes(".")) return alert("Please enter a valid store URL");
    try {
      await addStore({ storeName: newStoreUrl.split(".")[0], storeUrl: newStoreUrl, platform: "shopify", userId: "user_1" });
      setNewStoreUrl("");
    } catch (e) { alert("Error adding store"); }
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        title="Toggle Store Selection"
        className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between transition-all group shadow-sm"
      >
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
        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl p-4 z-50 shadow-2xl backdrop-blur-xl" style={{ WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="space-y-3">
            {stores.map((store) => (
              <div key={store._id} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="text-blue-500 w-3 h-3" />
                  <span className="text-[11px] font-medium text-zinc-300">{store.storeUrl}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
            <div className="pt-2 border-t border-white/5 mt-2 flex gap-2">
              <input 
                type="text" 
                title="Store URL"
                placeholder="store-name.myshopify.com" 
                value={newStoreUrl} 
                onChange={(e) => setNewStoreUrl(e.target.value)} 
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-[10px] outline-none text-white focus:border-blue-500" 
              />
              <button onClick={handleAddStore} title="Add Store" className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <PlusIcon className="w-4 h-4 text-white" />
              </button>
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
  const { user } = useUser();
  const languages = ["Arabic (Modern)", "English (US)", "French", "Spanish", "German"];
  const videoStyles = ["Viral Hormozi", "MrBeast Style", "Luxury", "UGC"];

  const [productUrl, setProductUrl] = useState("");
  const [selectedSource, setSelectedSource] = useState("aliexpress"); 
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedStyle, setSelectedStyle] = useState(videoStyles[0]);
  const [selectedMusic, setSelectedMusic] = useState("none");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
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
  const [selectedPlatforms, setSelectedPlatforms] = useState({ tiktok: true, meta: false, google: false });

  const deductCredits = useMutation(api.users.deductCredits); 
  const logCampaignMutation = useMutation(api.users.logCampaign);
  const storeUser = useMutation(api.users.storeUser);
  const userData = useQuery(api.users.currentUser);

  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { 
    setIsMounted(true);
    if (user) storeUser(); 
  }, [user, storeUser]);

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

  const initPaddle = () => {
    if (typeof window !== "undefined" && window.Paddle) {
      window.Paddle.Environment.set('sandbox'); 
      window.Paddle.Initialize({ 
        token: "test_805908696789f553316f7347913", // تأكد من أنه التوكن الطويل
      });
    }
  };

  const handleCheckout = () => {
    if (typeof window !== "undefined" && window.Paddle) {
      window.Paddle.Environment.set('sandbox'); // تأكيد البيئة
      window.Paddle.Checkout.open({
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "en",
          frameTarget: "paddle_checkout", // يساعد في استقرار الـ Frame
        },
        items: [
          { 
            priceId: "pri_01kf61n4baz0tc38zzfbswxabw", 
            quantity: 1 
          }
        ],
        customer: { 
          email: user?.emailAddresses[0]?.emailAddress || "" 
        }
      });
    }
  };

  const togglePlatform = (id) => setSelectedPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
  
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
      if (currentImageIndex >= updated.length) setCurrentImageIndex(Math.max(0, updated.length - 1));
      return updated;
    });
  };

  const startAnalyzing = (audioElement) => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const context = audioContextRef.current;
      if (context.state === 'suspended') context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64; 
      if (!audioSourceRef.current) audioSourceRef.current = context.createMediaElementSource(audioElement);
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
      const response = await fetch("/api/generate/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, language: selectedLanguage }) });
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
      voiceAudio.onended = () => { setIsPlaying(false); setAudioLevel(0); if (musicRef.current) musicRef.current.pause(); };
      await voiceAudio.play();
    } catch (err) { setIsPlaying(false); }
  };

  const handleGenerate = async () => {
    if (!productUrl) return alert("Please paste a link!");
    if (!userData || (userData?.credits || 0) < 1) return alert("❌ No credits!");
    setLoading(true);
    setLoadingStatus(`🔍 Analyzing Product...`);
    try {
      await deductCredits({ amount: 1 });
      const scrapeRes = await fetch("/api/generate/scrape", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productUrl, source: selectedSource }) });
      const scrapeData = await scrapeRes.json();
      if (scrapeData.success) { setAllProductImages(scrapeData.allImages || [scrapeData.mainImage]); }
      setLoadingStatus("✍️ Writing Scripts...");
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productUrl, language: selectedLanguage, style: selectedStyle, scriptMode: "full_30s" }) });
      const data = await response.json();
      const scriptToPlay = data.script_1 || data.problem_hook;
      setActiveHook(scriptToPlay); 
      setLoading(false);
      setLoadingStatus("");
      playVoice(scriptToPlay);
    } catch (error) { setLoading(false); alert("Error generating."); }
  };

  const handlePublish = async () => {
    const activePlats = Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]);
    if (activePlats.length === 0) return alert("Select platform!");
    setIsPublishing(true);
    try {
        const videoGenRes = await fetch("/api/generate/video-file", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: activeHook, images: allProductImages, music: selectedMusic, language: selectedLanguage }) });
        const videoData = await videoGenRes.json();
        for (const plt of activePlats) {
            await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: activeHook.substring(0, 30), videoPath: videoData.path, platform: plt }) });
            await logCampaignMutation({ productUrl, videoUrl: videoData.path, platform: plt });
        }
        alert(`🚀 Campaign Launched!`);
    } catch (err) { alert("Publishing Error."); } finally { setIsPublishing(false); }
  };

  if (!isMounted) return null;

  return (
    <main className="p-4 md:p-8 lg:p-10 max-w-[1700px] mx-auto text-white space-y-10 min-h-screen bg-[#020202]">
      <title>Dashboard - Hookify Ad AI</title>
      <Script 
        src="https://cdn.paddle.com/paddle/v2/paddle.js" 
        onLoad={initPaddle} 
      />
      
      <Header />
      
      <div className="flex justify-end -mt-8 mb-4 gap-3">
          <div className="bg-zinc-900/60 border border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
            <LightningBoltIcon className="text-blue-500 w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Credits:</span>
            <span className="text-sm font-black text-white">{userData?.credits ?? 0}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            title="Recharge Credits"
            className="bg-blue-600 hover:bg-white hover:text-black text-white text-[10px] font-black px-4 py-2 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
          >
            RECHARGE
          </button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch">
        <div className="col-span-12 lg:col-span-4 order-2 lg:order-1 flex flex-col gap-6">
          <div className="space-y-4">
            <StoreSelector />
            <AdConnector userId={userData?._id || "user_1"} /> 
          </div>
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-2 backdrop-blur-xl h-full flex flex-col shadow-2xl relative overflow-hidden" style={{ WebkitBackdropFilter: 'blur(20px)' }}>
            <h3 className="font-bold flex items-center gap-2 text-blue-500 uppercase text-xs tracking-[0.2em] italic mb-6">
              <MixerHorizontalIcon aria-hidden="true" /> Creative Engine
            </h3>
            <div className="space-y-6 flex-1">
              <ProductSourceSelector selected={selectedSource} onSelect={setSelectedSource} />
              
              <div className="space-y-2">
                <label htmlFor="product-url" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Paste Product Link</label>
                <div className="relative group">
                   <input 
                     id="product-url"
                     type="text" 
                     title="Product URL"
                     value={productUrl} 
                     onChange={(e) => setProductUrl(e.target.value)} 
                     placeholder="Paste link..." 
                     className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none text-white transition-all pl-12" 
                   />
                   <Link2Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ad Assets</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    title="Upload Assets"
                    className="text-[9px] font-bold text-blue-500 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" /> UPLOAD
                  </button>
                  <input type="file" title="Upload Image" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide min-h-[70px]">
                  {allProductImages.map((img, i) => (
                    <div key={i} className="relative group shrink-0">
                      <img 
                        src={img} 
                        alt=""
                        onClick={() => setCurrentImageIndex(i)} 
                        className={`w-14 h-14 rounded-xl object-cover border-2 transition-all cursor-pointer ${currentImageIndex === i ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'}`} 
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }} 
                        title="Remove Image"
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Cross2Icon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                   <label htmlFor="voice-lang" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Voice</label>
                   <select 
                     id="voice-lang"
                     title="Voice Language"
                     value={selectedLanguage} 
                     onChange={(e) => setSelectedLanguage(e.target.value)} 
                     className="w-full bg-black border border-zinc-800 rounded-xl p-3 outline-none focus:border-blue-500"
                     style={{ WebkitAppearance: 'none', appearance: 'none' }}
                   >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label htmlFor="video-style" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Style</label>
                   <select 
                     id="video-style"
                     title="Video Style"
                     value={selectedStyle} 
                     onChange={(e) => setSelectedStyle(e.target.value)} 
                     className="w-full bg-black border border-zinc-800 rounded-xl p-3 outline-none focus:border-blue-500"
                     style={{ WebkitAppearance: 'none', appearance: 'none' }}
                   >
                    {videoStyles.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <SpeakerLoudIcon className="w-3 h-3 text-blue-500" /> Background
                </p>
                <div className="flex flex-wrap gap-2">
                  {backgroundTracks.map((track) => (
                    <button 
                      key={track.id} 
                      title={`Select ${track.label}`}
                      onClick={() => setSelectedMusic(track.id)} 
                      className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all flex items-center gap-1.5 ${selectedMusic === track.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-black/40 border-white/5 text-zinc-500'}`}
                    >
                      {track.icon}{track.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              title="Generate Ad"
              className={`relative overflow-hidden w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] transition-all shadow-xl mt-6 ${loading ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-blue-600 hover:bg-white hover:text-black"}`}
            >
              {loading ? loadingStatus : "GENERATE 30s ADS"}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 order-1 lg:order-2 flex flex-col justify-center items-center gap-6">
          <div className="bg-[#050505] border-[12px] border-[#1a1a1a] rounded-[3.5rem] aspect-[9/16] w-full max-w-[320px] relative shadow-2xl overflow-hidden ring-1 ring-white/10 group">
            <div className="absolute top-4 inset-x-8 h-1 bg-white/10 rounded-full overflow-hidden z-50">
                <div className="h-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_10px_#3b82f6]" style={{ width: `${audioProgress}%` }} />
            </div>

            <div className="absolute top-0 inset-x-0 h-[65%] z-0 flex items-center justify-center bg-[#080808] overflow-hidden">
                {allProductImages.length > 0 ? (
                  allProductImages.map((img, idx) => (
                    <img key={idx} src={img} alt="" style={{ 
                        display: idx === currentImageIndex ? 'block' : 'none',
                        transform: `scale(${1.15 + (audioLevel / 220)})`,
                        filter: `brightness(${1 + audioLevel / 150})`,
                        transition: 'transform 0.1s'
                    }} className="w-[85%] h-[80%] object-contain z-10" />
                  ))
                ) : <div className="flex flex-col items-center gap-4 text-zinc-800"><PlayIcon className="w-12 h-12" /></div>}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black via-black/95 to-transparent z-30 flex flex-col justify-center items-center pb-10 px-8">
                <div 
                  contentEditable={!isPlaying}
                  onBlur={(e) => setActiveHook(e.currentTarget.innerText)}
                  dangerouslySetInnerHTML={{ __html: isPlaying ? 
                    visibleWords.map((word, idx) => `<span style="color: ${idx === visibleWords.length - 1 ? '#3b82f6' : 'white'};" class="text-[18px] font-[1000] italic uppercase tracking-tighter">${word}</span>`).join(' ') 
                    : `<span class="text-[11px] text-zinc-400 italic font-bold text-center">${activeHook}</span>` 
                  }}
                  className={`flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-center outline-none ${!isPlaying ? 'border border-dashed border-white/10 rounded-xl p-3 bg-white/5' : ''}`}
                />
            </div>
          </div>
          
          <div className="w-full max-w-[320px] bg-zinc-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md space-y-4" style={{ WebkitBackdropFilter: 'blur(10px)' }}>
            <div className="flex items-center gap-4">
              <SpeakerLoudIcon className="text-zinc-500 w-4 h-4" />
              <input type="range" title="Voice Volume" min="0" max="1" step="0.05" value={voiceVolume} onChange={(e) => setVoiceVolume(parseFloat(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" style={{ WebkitAppearance: 'none' }} />
              <span className="text-[9px] font-bold text-zinc-600 w-8">VOICE</span>
            </div>
            <div className="flex items-center gap-4">
              <SpeakerModerateIcon className="text-zinc-500 w-4 h-4" />
              <input type="range" title="Music Volume" min="0" max="0.5" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" style={{ WebkitAppearance: 'none' }} />
              <span className="text-[9px] font-bold text-zinc-600 w-8">MUSIC</span>
            </div>
          </div>

          <div className="w-full max-w-[320px] space-y-2">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Publish To</p>
            <div className="flex gap-2">
              {['tiktok', 'meta', 'google'].map((plt) => (
                <button 
                  key={plt} 
                  title={`Select ${plt}`}
                  onClick={() => togglePlatform(plt)} 
                  className={`flex-1 py-3 rounded-2xl border transition-all ${selectedPlatforms[plt] ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' : 'bg-black/40 border-white/5 text-zinc-600 opacity-50'}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter">{plt}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={handlePublish} 
              disabled={isPublishing} 
              title="Launch Campaign"
              className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isPublishing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
            >
              {isPublishing ? <UpdateIcon className="animate-spin" /> : <RocketIcon />} {isPublishing ? "LAUNCHING..." : "START AD CAMPAIGN"}
            </button>
            <button 
              onClick={() => window.location.href = "mailto:support@hookify.ai?subject=Support Request"}
              title="Contact Support"
              className="w-full text-[9px] font-black text-zinc-600 hover:text-blue-400 transition-colors uppercase py-2"
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 order-3 flex flex-col gap-6">
            <AdsQueue />
        </div>
      </div>
    </main>
  );
}