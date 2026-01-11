// app/(main)/dashboard/_components/StoreManager.jsx
"use client";
import { Store, Plus } from "lucide-react";

export default function StoreManager({ stores = [] }) {
  return (
    <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
          <Store className="text-blue-500 w-4 h-4" /> My Stores
        </h3>
        <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {stores.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-white/10 rounded-3xl text-zinc-600 text-[10px] font-black uppercase">
            No Stores Connected
          </div>
        ) : (
          stores.map(s => (
            <div key={s._id} className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold">{s.storeName}</span>
              <span className="text-[8px] bg-blue-600 px-2 py-1 rounded uppercase">Active</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}