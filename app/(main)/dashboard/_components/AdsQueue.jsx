"use client";
import React from "react";
import { 
  CopyIcon, 
  CheckIcon, 
  EyeOpenIcon, 
  VideoIcon,
  Share2Icon,
  RocketIcon
} from "@radix-ui/react-icons";

export default function AdsQueue({ hooks, isLoading, onPreviewClick }) {
  // تم تعديل المفاتيح هنا لتطابق ما يرسله الـ AI
  const placeholderHooks = {
    problem_hook: "Tired of slow results? AI will identify the core problem...",
    benefit_hook: "Showcase the ultimate value of your product here...",
    curiosity_hook: "A hook so intriguing they can't help but click...",
    social_proof: "Leverage trust and numbers to convert viewers..." // تم تعديل الاسم هنا
  };

  const displayData = hooks || placeholderHooks;

  return (
    <div className="bg-zinc-900/60 border border-white/5 p-6 md:p-8 rounded-[2.5rem] h-full flex flex-col shadow-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold flex items-center gap-2 text-blue-500 uppercase text-[10px] tracking-[0.2em] italic">
          <VideoIcon className="w-4 h-4"/> 4 AI Video Variations
        </h3>
        {isLoading && (
          <span className="flex items-center gap-2 text-[10px] text-blue-400 animate-pulse font-bold">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            GENERATING...
          </span>
        )}
      </div>

      <div className={`space-y-5 flex-1 transition-all duration-700 ${isLoading ? 'opacity-30 blur-sm scale-95' : 'opacity-100'}`}>
        <AdDraftItem 
          index="01"
          title="Viral Problem Hook" 
          content={displayData.problem_hook} 
          onPreview={onPreviewClick}
        />
        <AdDraftItem 
          index="02"
          title="Benefit Focus Video" 
          content={displayData.benefit_hook} 
          onPreview={onPreviewClick} 
        />
        <AdDraftItem 
          index="03"
          title="Curiosity Engine" 
          content={displayData.curiosity_hook} 
          onPreview={onPreviewClick} 
        />
        <AdDraftItem 
          index="04"
          title="Social Proof Master" 
          content={displayData.social_proof}  // تم تعديل المفتاح هنا من social_proof_hook إلى social_proof
          onPreview={onPreviewClick} 
        />
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <RocketIcon className="w-4 h-4" /> Publish All To Platforms
        </button>
      </div>
    </div>
  );
}

// ... باقي كود AdDraftItem يبقى كما هو دون تغيير
function AdDraftItem({ index, title, content, onPreview }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-black/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-blue-600 bg-blue-600/10 px-2 py-1 rounded-md">{index}</span>
            <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{title}</h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPreview(content)} 
            title="Preview" 
            className="p-2 bg-zinc-800/50 hover:bg-blue-600 text-zinc-400 hover:text-white rounded-lg transition-all"
          >
            <EyeOpenIcon className="w-3.5 h-3.5" />
          </button>
          
          <button title="Post to TikTok" className="p-2 bg-zinc-800/50 hover:bg-pink-600 text-zinc-400 hover:text-white rounded-lg transition-all">
            <Share2Icon className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={handleCopy}
            className="p-2 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-all"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      <p className="text-[13px] text-zinc-400 leading-relaxed font-medium bg-zinc-900/30 p-3 rounded-xl border border-white/5">
        {content}
      </p>
    </div>
  );
}