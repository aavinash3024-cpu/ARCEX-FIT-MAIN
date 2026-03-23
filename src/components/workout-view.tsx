
'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Trophy, 
  Library, 
  History, 
  Layout, 
  Plus, 
  RefreshCw,
  ChevronRight,
  Target
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
      {/* Header Section */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold font-headline">Workout</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
          <History className="w-4 h-4" />
        </Button>
      </div>

      {/* 1. Personal Records Card (Hero Position) */}
      <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
        <CardContent className="p-0 flex h-32 items-center">
          <div className="shrink-0 w-32 h-full relative">
            <Image 
              src={prImage?.imageUrl || "https://images.unsplash.com/photo-1634157703702-3c124b455499?q=80&w=600&auto=format&fit=crop"} 
              alt="Personal Records"
              fill
              className="object-cover"
              data-ai-hint="illustration"
            />
          </div>
          <div className="flex-1 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-tight flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                Personal Records
              </h3>
              <p className="text-[10px] font-bold text-blue-600/60 uppercase">8 New this month</p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Today's Protocol Card */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/50 rounded-full shrink-0">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Today's Protocol</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                COMPLETION: <span className="text-emerald-600 font-black">0/2 DONE</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="space-y-2.5">
            {protocolExercises.map((ex, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-50/30 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-200/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Targeted</p>
                    <h4 className="font-bold text-[13px] text-emerald-900">{ex.name}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{ex.category}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-black text-emerald-600/30 uppercase tracking-[0.2em]">{ex.status}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] gap-2">
            <Plus className="w-4 h-4" /> Add Extra Movement
          </Button>
        </CardContent>
      </Card>

      {/* 3. Mid Grid: History & Exercise Library */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-50 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="font-bold text-[11px] tracking-tight uppercase text-purple-900">History</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5 opacity-60">Past Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 group-hover:scale-110 transition-transform">
              <Library className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-[11px] tracking-tight uppercase text-amber-900">Library</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5 opacity-60">Exercises</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. My Split (Full Width at bottom) */}
      <Card className="border-none shadow-md bg-gradient-to-br from-indigo-50 to-white overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl group-hover:scale-110 transition-transform">
              <Layout className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-tight">My Workout Split</h3>
              <p className="text-[10px] font-bold text-indigo-600/60 uppercase">Currently: Push/Pull/Legs</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-300" />
        </CardContent>
      </Card>
    </div>
  );
}
