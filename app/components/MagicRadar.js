"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cross2Icon, 
  LightningBoltIcon, 
  GlobeIcon, 
  ExternalLinkIcon, 
  PieChartIcon, 
  TargetIcon, 
  BarChartIcon 
} from "@radix-ui/react-icons";
import { performDeepScan } from '../intelligence/oracle';

export default function MagicRadar({ keyword }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async () => {
    if (!keyword) return alert("Please enter a keyword first!");
    setLoading(true);
    setResults(null);
    
    const steps = [
      "Establishing Neural Link...", 
      "Scraping 100+ Global Listings...", 
      "Analyzing Shopify & Amazon Spying Data...", 
      "Calculating Competitor Revenue...",
      "Generating Final Intelligence..."
    ];
    
    let i = 0;
    const interval = setInterval(() => { 
      if (i < steps.length) setStep(steps[i++]); 
    }, 1200); // زيادة الوقت قليلاً ليعطي شعوراً بعمق البحث

    try {
      const data = await performDeepScan(keyword);
      setResults(data);
      setShowModal(true);
    } catch (error) {
      console.error("Scan failed:", error);
      alert("Intelligence gathering interrupted. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Search Button */}
      <button 
        onClick={handleScan}
        disabled={loading}
        className="group relative w-full py-4 bg-[#111] border border-white/10 rounded-xl overflow-hidden transition-all hover:border-blue-500/50 active:scale-[0.98] shadow-2xl"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
            {loading ? step : "Initialize Deep Market Scan"}
          </span>
        </div>
        {loading && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
          />
        )}
      </button>

      <AnimatePresence>
        {showModal && results && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-[#090909] border border-white/[0.08] w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-30 flex justify-between items-center px-8 py-5 border-b border-white/[0.05] bg-[#090909]/95 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <GlobeIcon className="text-blue-500 w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest block">Market Intelligence</span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">Real-time Data Stream // 2026.4.1</span>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                {/* Product Hero */}
                <div className="mb-10">
                  <h2 className="text-3xl font-light text-white tracking-tight mb-2">
                    Analysis for <span className="font-medium text-blue-500 italic">"{keyword}"</span>
                  </h2>
                  <div className="flex items-center gap-4 text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                    <span>100+ Nodes Scanned</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span>Global Database Match</span>
                  </div>
                </div>

                {/* Main Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.05] rounded-2xl overflow-hidden mb-8">
                  <MetricBox label="Market Saturation" value={`${results.saturation}%`} sub="High Competition" color="text-zinc-200" />
                  <MetricBox label="Viral Potential" value={`${results.viralScore}/10`} sub="Trending" color="text-blue-400" />
                  <MetricBox label="Shopify Avg" value={results.shopifyAvg || results.avgPrice} sub="Selling Price" color="text-zinc-200" />
                  <MetricBox label="Supplier Cost" value={results.supplierPrice} sub="AliExpress Base" color="text-zinc-200" />
                </div>

                {/* Financial Deep Dive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 bg-green-500/[0.03] border border-green-500/20 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BarChartIcon className="w-12 h-12 text-green-500" />
                    </div>
                    <p className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em] mb-3">Estimated Net Profit</p>
                    <p className="text-3xl font-mono text-white tracking-tighter mb-2">{results.netProfit}</p>
                    <p className="text-[10px] text-zinc-500 leading-tight">After subtracting $10.00 marketing acquisition cost & COGS.</p>
                  </div>
                  
                  <div className="p-6 bg-blue-600/[0.03] border border-blue-500/20 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TargetIcon className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mb-3">Opportunity Score</p>
                    <p className="text-3xl font-mono text-white tracking-tighter mb-2">{results.opportunityScore}/100</p>
                    <p className="text-[10px] text-zinc-500 leading-tight">Success probability based on current market gaps.</p>
                  </div>
                </div>

                {/* Spy Table - The $30 Feature */}
                <div className="mb-10 bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <LightningBoltIcon className="text-yellow-500" /> Top Competitor Analysis
                    </span>
                    <span className="text-[8px] text-zinc-600 font-mono">LIVE SPYING FEED</span>
                  </div>
                  <div className="divide-y divide-white/[0.05]">
                    {results.competitorAnalysis?.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-white font-medium mb-1">{comp.name}</span>
                          <span className="text-[9px] text-green-500/80 font-mono">EST. REV: {comp.estMonthlySales}</span>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-zinc-400 font-mono">{comp.price}</span>
                            <span className="text-[8px] text-zinc-600 uppercase">List Price</span>
                          </div>
                          <a href={comp.link} target="_blank" className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-600 transition-all">
                            <ExternalLinkIcon className="w-3 h-3 text-white" />
                          </a>
                        </div>
                      </div>
                    ))}
                    {(!results.competitorAnalysis || results.competitorAnalysis.length === 0) && (
                       <p className="p-6 text-center text-xs text-zinc-600 italic">No direct Shopify competitors detected in top 100.</p>
                    )}
                  </div>
                </div>

                {/* Verdict Box */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 mb-8">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4">Strategic Verdict</p>
                  <p className="text-zinc-300 text-sm leading-relaxed font-light italic">
                    "{results.verdict}"
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                  <a 
                    href={results.bestSupplier} 
                    target="_blank" 
                    className="flex-1 py-4 bg-zinc-100 hover:bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    🚀 Source on AliExpress
                  </a>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
                  >
                    Confirm & Save Strategy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBox({ label, value, sub, color }) {
  return (
    <div className="bg-[#090909] p-6 hover:bg-white/[0.02] transition-colors">
      <p className="text-[8px] text-zinc-500 uppercase font-black mb-2 tracking-[0.15em]">{label}</p>
      <p className={`text-xl font-mono ${color} tracking-tighter mb-1`}>{value}</p>
      <p className="text-[8px] text-zinc-600 uppercase font-medium">{sub}</p>
    </div>
  );
}