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
  const splitImage = PlaceHolderImages.find(img => img.id === 'training-split-tool');

  return (
    <div className="space-y-6 pb-24">
      {/* Page Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold font-headline">Workouts</h1>
      </div>

      {/* 1. Sleek Personal Records Card */}
      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
        <CardContent className="p-0 flex items-center h-20">
          <div className="shrink-0 w-20 h-full relative">
            <Image 
              src={prImage?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"} 
              alt="Personal Records"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="barbell illustration"
            />
          </div>
          <div className="flex-1 px-4 flex items-center justify-between min-w-0">
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Personal Records
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">8 New milestones reached</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tight">Pushing limits</p>
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

      {/* 3. Compact Training Split Card */}
      <Card className="border-none shadow-sm bg-white overflow-hidden group cursor-pointer active:scale-[0.99] transition-all border-l-4 border-l-indigo-400">
        <CardContent className="p-0 flex items-center h-20">
          <div className="shrink-0 w-20 h-full relative">
            <Image 
              src={splitImage?.imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop"} 
              alt="My Workout Split"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="gym weights"
            />
            <div className="absolute inset-0 bg-indigo-900/10" />
          </div>
          <div className="flex-1 px-4 flex items-center justify-between min-w-0">
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Layout className="w-3 h-3" /> My Workout Split
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">Create Your Gym Split</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tight">Active Phase</p>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-300/40" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Grid: Workout History & Workout Library */}
      <div className="grid grid-cols-2 gap-4 pb-6">
        <Card className="border-none shadow-sm bg-white hover:bg-sky-50 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Workout History</p>
              <p className="text-xs font-bold text-foreground/80">14 sessions</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-sky-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white hover:bg-purple-50 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Library className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Workout Library</p>
              <p className="text-xs font-bold text-foreground/80">850+ Moves</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-purple-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
