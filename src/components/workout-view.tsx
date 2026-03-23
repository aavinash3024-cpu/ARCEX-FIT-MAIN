'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Trophy, 
  Library, 
  History, 
  Layout, 
  Plus, 
  RefreshCw,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function WorkoutView() {
  const protocolExercises = [
    { name: "Incline Guillotine Press", category: "CHEST • UPPER CHEST", status: "AWAITING DATA" },
    { name: "Cable Kickback (Triceps)", category: "TRICEPS • LATERAL HEAD", status: "AWAITING DATA" },
  ];

  const prImage = PlaceHolderImages.find(img => img.id === 'personal-records-illustration');

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Personal Records Card (Hero Top) */}
      <Card className="border-none shadow-md bg-primary/5 border-l-4 border-l-primary overflow-hidden group cursor-pointer active:scale-[0.99] transition-all mt-2">
        <CardContent className="p-0 flex items-center">
          <div className="shrink-0 w-28 h-28 relative">
            <Image 
              src={prImage?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"} 
              alt="Personal Records"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="barbell illustration"
            />
          </div>
          <div className="flex-1 p-4 flex items-center justify-between min-w-0">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Personal Records
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">8 New milestones reached this month</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Pushing limits</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Today's Protocol Card */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Today's Protocol</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                COMPLETION: <span className="text-primary font-black">0/2 DONE</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="space-y-2.5">
            {protocolExercises.map((ex, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-muted/20 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all hover:border-primary/20">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Targeted</p>
                    <h4 className="font-bold text-[13px] text-foreground/90">{ex.name}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{ex.category}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-primary/5 text-primary">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">{ex.status}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2">
            <Plus className="w-4 h-4" /> Add Extra Movement
          </Button>
        </CardContent>
      </Card>

      {/* 3. My Split (Shifted Up) */}
      <Card className="border-none shadow-md bg-gradient-to-br from-indigo-50 to-white hover:translate-y-[-2px] transition-all cursor-pointer active:scale-[0.99] group border-l-4 border-l-indigo-400">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl group-hover:scale-110 transition-transform">
              <Layout className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Training Split</h3>
              <p className="text-sm font-bold text-indigo-900/90">Push / Pull / Legs</p>
              <p className="text-[9px] font-bold text-indigo-600/60 uppercase mt-0.5 tracking-tight">Hypertrophy Phase</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-300" />
        </CardContent>
      </Card>

      {/* 4. Grid: History & Library (Shifted to Last) */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-sky-50 to-white hover:translate-y-[-2px] transition-all cursor-pointer active:scale-95 group">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-900/40">History</p>
              <p className="text-xs font-bold text-sky-900/70">14 sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white hover:translate-y-[-2px] transition-all cursor-pointer active:scale-95 group">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Library className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-900/40">Library</p>
              <p className="text-xs font-bold text-purple-900/70">850+ Moves</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
