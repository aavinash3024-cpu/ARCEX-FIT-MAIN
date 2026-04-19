"use client";

import React from 'react';
import { AnimatedBackground } from './animated-background';
import { Loader2 } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center bg-slate-950 overflow-hidden">
      <AnimatedBackground />

      {/* Centered Logo Section */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-3xl tracking-tighter text-white">arcex</span>
          <span className="font-black text-3xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
        </div>
      </div>

      {/* Bottom Loading Section - No Box */}
      <div className="pb-16 relative z-10 flex flex-col items-center gap-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary/80" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 pl-[0.4em]">PLEASE WAIT</p>
      </div>
    </div>
  );
}
