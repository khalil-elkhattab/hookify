import { PlayIcon, UpdateIcon } from "@radix-ui/react-icons";

export default function VideoPreview({ isGenerating, style }) {
  return (
    <div className="flex justify-center h-full">
      <div className="bg-black border-[10px] border-zinc-900 rounded-[3rem] aspect-[9/16] w-full max-w-[320px] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <UpdateIcon className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-[10px] font-bold tracking-widest animate-pulse">ANALYZING PRODUCT...</p>
            </div>
          ) : (
            <div className="bg-blue-600 p-5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.6)] group-hover:scale-110 transition-transform cursor-pointer">
              <PlayIcon className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="absolute bottom-12 left-6 right-6">
          <span className="bg-blue-600 text-[8px] font-black px-2 py-1 rounded mb-2 inline-block">STYLE: {style}</span>
          <p className="text-xl font-black italic uppercase leading-tight">Winning Ad <br/>In Progress...</p>
        </div>
      </div>
    </div>
  );
}