// _components/AdDraftItem.jsx
import { EyeOpenIcon, Share2Icon } from "@radix-ui/react-icons";

export default function AdDraftItem({ id, status, type }) {
  return (
    <div className="bg-black/40 border border-zinc-800 p-4 rounded-2xl group hover:border-blue-500/50 transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-[10px] font-black group-hover:text-blue-500">{id}</div>
        <div>
          <h4 className="text-[11px] font-bold">{type}</h4>
          <p className="text-[9px] text-green-500 font-bold uppercase">{status}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="bg-zinc-800 p-2 rounded-lg hover:bg-blue-600"><EyeOpenIcon className="w-3.5 h-3.5" /></button>
        <button className="bg-zinc-800 p-2 rounded-lg hover:bg-blue-600"><Share2Icon className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}