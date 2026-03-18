"use client";
import React, { useState } from "react";
import { ShadowIcon, ChevronDownIcon, GlobeIcon, PlusIcon } from "@radix-ui/react-icons";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function StoreSelector() {
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
        className="w-full bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/[0.05] p-4 rounded-2xl flex items-center justify-between transition-all group backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-xl group-hover:bg-blue-500/20 transition-colors">
            <ShadowIcon className="text-blue-500 w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Connected Stores</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              {stores.length > 0 ? `${stores.length} Domains` : "None"}
            </p>
          </div>
        </div>
        <ChevronDownIcon className={`text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-3">
            {stores.map((store) => (
              <div key={store._id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="text-blue-500 w-3 h-3" />
                  <span className="text-[11px] font-medium text-zinc-300">{store.storeUrl}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              </div>
            ))}
            <div className="pt-2 border-t border-white/5 mt-2 flex gap-2">
              <input 
                type="text" 
                placeholder="store.myshopify.com" 
                value={newStoreUrl} 
                onChange={(e) => setNewStoreUrl(e.target.value)} 
                className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] outline-none text-white focus:border-blue-500 transition-all" 
              />
              <button onClick={handleAddStore} className="bg-white hover:bg-zinc-200 p-2 rounded-xl transition-colors">
                <PlusIcon className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}