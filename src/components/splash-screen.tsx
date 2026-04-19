"use client";

import React from 'react';
import { AnimatedBackground } from './animated-background';
import { Loader2 } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-3xl tracking-tighter text-white">arcex</span>
            <span className="font-black text-3xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
          </div>
        </div>

        {/* Loading Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 pl-[0.3em]">PLEASE WAIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
