"use client";

import React from 'react';
import { AnimatedBackground } from './animated-background';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-5xl tracking-tighter text-white">arcex</span>
            <span className="font-black text-5xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 pl-[0.6em]">Intelligent Wellness</p>
        </div>

        {/* Loading Text Section */}
        <div className="flex flex-col items-center mt-12">
          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 pl-[0.4em]">PLEASE WAIT...</p>
        </div>
      </div>
    </div>
  );
}
