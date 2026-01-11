"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  PlusIcon, 
  CheckCircledIcon, 
  ChevronDownIcon,
  GlobeIcon 
} from "@radix-ui/react-icons";

export default function AdConnector() {
  const [isOpen, setIsOpen] = useState(false);
  const connectedAccounts = useQuery(api.adAccounts.get) || [];
  const linkAccount = useMutation(api.adAccounts.link);

  // قائمة المنصات التي يحتاجها أي Dropshipper
  const platforms = [
    { id: "facebook", name: "Facebook Ads", icon: "💙" },
    { id: "tiktok", name: "TikTok Ads", icon: "🖤" },
    { id: "instagram", name: "Instagram Ads", icon: "💜" },
    { id: "snapchat", name: "Snapchat Ads", icon: "💛" },
    { id: "google", name: "Google Ads", icon: "💙" },
  ];

  const handleConnect = async (platform) => {
    const isAlreadyLinked = connectedAccounts.some(a => a.platform === platform.id);
    if (isAlreadyLinked) return;

    try {
      await linkAccount({ 
        platform: platform.id, 
        platformName: `${platform.name} (Active)` 
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="relative">
      {/* الزر الرئيسي الموحد */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg group-hover:bg-blue-600/30 transition-colors">
            <PlusIcon className="text-blue-500 w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Connect Ad Accounts</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {connectedAccounts.length} Platforms Linked
            </p>
          </div>
        </div>
        <ChevronDownIcon className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* القائمة المنسدلة للمنصات */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl">
          <div className="p-2 grid grid-cols-1 gap-1">
            {platforms.map((p) => {
              const linked = connectedAccounts.find(a => a.platform === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => handleConnect(p)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    linked ? "bg-green-500/10 cursor-default" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.icon}</span>
                    <span className={`text-xs font-medium ${linked ? 'text-green-500' : 'text-zinc-300'}`}>
                      {p.name}
                    </span>
                  </div>
                  {linked ? (
                    <CheckCircledIcon className="text-green-500 w-4 h-4" />
                  ) : (
                    <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-500 font-bold uppercase">Connect</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}