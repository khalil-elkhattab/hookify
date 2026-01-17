"use client";
import { MessageSquare, Mail, LifeBuoy, ArrowRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-black uppercase italic">
            System <span className="text-blue-600">Support</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] mt-2">
            WE ARE HERE TO HELP YOU SCALE
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all">
            <Mail className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-zinc-500 text-sm mb-6">Response time: within 24 hours.</p>
            <button className="flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest">
              Open Ticket <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all">
            <MessageSquare className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Live Community</h3>
            <p className="text-zinc-500 text-sm mb-6">Join our Discord for instant tips.</p>
            <button className="flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest">
              Join Discord <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* FAQ Section Placeholder */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.2em]">Quick FAQ</h4>
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-4">
              <p className="font-bold text-sm">How do I increase my credits?</p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <p className="font-bold text-sm">Can I cancel my subscription anytime?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}