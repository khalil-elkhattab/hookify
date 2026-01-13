"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { 
  User, Save, Loader2, Zap, Sparkles, Video, Volume2, Music 
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs"; // تم استبدال Firebase بـ Clerk

export default function SettingsPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // الإعدادات الشاملة
  const [settings, setSettings] = useState({
    defaultLanguage: "Arabic",
    defaultVisualStyle: "Viral Hormozi",
    autoScrapeMetadata: true,
    autoRemoveBg: true,
    musicVolume: 0.1,
    aiVoiceVolume: 0.8,
  });

  // جلب بيانات المستخدم من Convex باستخدام إيميل Clerk
  const userData = useQuery(api.user.getUser, clerkUser?.primaryEmailAddress?.emailAddress ? { 
    email: clerkUser.primaryEmailAddress.emailAddress 
  } : "skip");

  const updateSettings = useMutation(api.user.updateUserSettings);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      if (userData.settings) setSettings((prev) => ({ ...prev, ...userData.settings }));
    }
  }, [userData]);

  const handleSave = async () => {
    if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
    setIsSaving(true);
    try {
      await updateSettings({
        email: clerkUser.primaryEmailAddress.emailAddress,
        name: name,
        settings: settings
      });
      alert("✅ System Core Synchronized!");
    } catch (e) {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isClerkLoaded) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen p-4 md:p-10 text-white bg-[#020202]">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic">System <span className="text-blue-600">Core</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em]">MODERNIZED WITH CLERK & CONVEX</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-lg">{userData?.credits || 0}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "general", label: "Account", icon: User },
            { id: "creative", label: "Creative AI", icon: Sparkles },
            { id: "audio", label: "Audio Core", icon: Volume2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-white text-black" : "bg-zinc-900/50 text-zinc-500"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
             <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Profile Name</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 p-4 rounded-xl outline-none border border-white/5 focus:border-blue-600"
                />
             </div>
          )}

          {/* ... باقي التبويبات التي كانت لديك ... */}
          
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