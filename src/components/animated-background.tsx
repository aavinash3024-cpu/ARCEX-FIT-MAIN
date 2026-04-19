"use client";

import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#065A54]/70 via-[#065A54]/30 to-slate-950/95" />

      {/* Central Pulsating Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      
      {/* CENTRAL CONCENTRIC RINGS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-primary/5 rounded-full animate-[spin_60s_linear_infinite] opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-primary/10 border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] border-2 border-primary/5 rounded-full animate-[spin_30s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-t-primary/20 border-r-transparent border-b-primary/20 border-l-transparent rounded-full animate-[spin_15s_linear_infinite]" />

      {/* Peripheral Rings - Bottom Right Only */}
      <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-b-2 border-primary/5 rounded-full animate-[spin_35s_linear_infinite_reverse]" />
      
      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
      `}</style>
    </div>
  );
}
