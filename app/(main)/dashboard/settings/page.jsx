"use client";

import { useState, useEffect } from "react";
import { 
  User, Save, Loader2, Zap, ShieldCheck, Globe, 
  Music, Scissors, Sparkles, Layout, Video, 
  Languages, Eye, Volume2, HardDrive
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function SettingsPage() {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // الإعدادات الشاملة لكل الميزات
  const [settings, setSettings] = useState({
    // Creative Engine & Scraper
    defaultLanguage: "Arabic",
    defaultVisualStyle: "Viral Hormozi",
    autoScrapeMetadata: true,
    
    // AI Image Processing
    autoRemoveBg: true,
    imageQuality: "high",
    
    // Audio & Music
    defaultVoiceEmotion: "Excited",
    musicVolume: 0.1,
    aiVoiceVolume: 0.8,
    
    // Video Simulator
    defaultAspectRatio: "9:16",
    showDynamicCaptions: true,
    enableAudioVisualizer: true,
    
    // Pro Controls
    showWatermark: true, // تتغير حسب Premium
    autoSaveScripts: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => { if (u) setCurrentUserEmail(u.email); });
    return () => unsubscribe();
  }, []);

  const user = useQuery(api.user.getUser, currentUserEmail ? { email: currentUserEmail } : "skip");
  const updateSettings = useMutation(api.user.updateUserSettings);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.settings) setSettings((prev) => ({ ...prev, ...user.settings }));
    }
  }, [user]);

  const handleSave = async () => {
    if (!currentUserEmail) return;
    setIsSaving(true);
    try {
      await updateSettings({
        email: currentUserEmail,
        name: name,
        settings: settings
      });
      alert("✅ All features updated in your system core!");
    } catch (e) {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 text-white bg-[#020202]">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic">System <span className="text-blue-600">Core</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em]">VERSION 4.0.1 // PRO ENGINE</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-lg">{user?.credits || 0}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "general", label: "Account", icon: User },
            { id: "creative", label: "Creative AI", icon: Sparkles },
            { id: "video", label: "Video Tech", icon: Video },
            { id: "audio", label: "Audio Core", icon: Volume2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-white text-black translate-x-1" : "bg-zinc-900/50 text-zinc-500 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Creative AI Tab */}
          {activeTab === "creative" && (
            <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-lg font-black uppercase flex items-center gap-2"><Sparkles className="text-blue-500"/> Creative Engine</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Default AI Language</label>
                  <select 
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
                    className="w-full bg-transparent mt-2 font-bold outline-none"
                  >
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="English">English (US)</option>
                    <option value="French">French</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-5 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Auto-Background Removal</span>
                  <button 
                    onClick={() => setSettings({...settings, autoRemoveBg: !settings.autoRemoveBg})}
                    className={`w-10 h-5 rounded-full relative transition-all ${settings.autoRemoveBg ? 'bg-blue-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.autoRemoveBg ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio Core Tab */}
          {activeTab === "audio" && (
            <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-lg font-black uppercase flex items-center gap-2"><Music className="text-pink-500"/> Audio & Music Mixer</h3>
              
              <div className="space-y-4">
                <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <div className="flex justify-between mb-3 text-[10px] font-bold uppercase">
                    <span>Background Music Volume</span>
                    <span>{Math.round(settings.musicVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.5" step="0.01" 
                    value={settings.musicVolume}
                    onChange={(e) => setSettings({...settings, musicVolume: parseFloat(e.target.value)})}
                    className="w-full accent-blue-600 h-1 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Global Save Button */}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Sync System Core
          </button>
        </div>
      </div>
    </div>
  );
}