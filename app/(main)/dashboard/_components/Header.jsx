import { RocketIcon, PlusIcon, LaptopIcon } from "@radix-ui/react-icons";

export default function Header() {
  const handleConnect = () => alert("Connecting to Meta/TikTok API...");

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center bg-zinc-900/40 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
          <RocketIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tighter italic">HOOKIFY <span className="text-blue-500 italic">OS</span></h2>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
        <button 
          onClick={handleConnect}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all active:scale-95"
        >
          <PlusIcon /> Connect Ad Accounts
        </button>
        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl text-xs font-bold transition-all border border-white/5 active:scale-95">
          <LaptopIcon /> My Stores
        </button>
      </div>
    </div>
  );
}