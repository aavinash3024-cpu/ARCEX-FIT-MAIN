"use client";

import React from 'react';
import { AnimatedBackground } from './animated-background';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95 duration-1000">
          <div className="flex items-center gap-2">
            <span className="font-black text-5xl tracking-tighter text-white">arcex</span>
            <span className="font-black text-5xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 pl-[0.6em]">Intelligent Wellness</p>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="relative w-16 h-24 flex items-end justify-center">
            {/* Bouncing Ball */}
            <div className="w-8 h-8 bg-primary rounded-full animate-bounce shadow-[0_0_20px_rgba(74,222,128,0.6)]" />
            {/* Shadow beneath ball */}
            <div className="absolute bottom-0 w-10 h-1.5 bg-white/10 rounded-[100%] scale-x-125" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse pl-[0.4em]">Loading</p>
            <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden mt-2">
              <div className="absolute inset-0 bg-primary/40 animate-shimmer" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
