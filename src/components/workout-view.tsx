
'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Search,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { EXERCISES_DATA, type Exercise } from "@/lib/exercises-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function WorkoutView() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Library Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string>("ALL");
  const [subMuscleFilter, setSubMuscleFilter] = useState<string>("ALL");

  const muscleGroups = useMemo(() => {
    const groups = Array.from(new Set(EXERCISES_DATA.map(e => e.muscle)));
    return ["ALL", ...groups];
  }, []);

  const subMuscleGroups = useMemo(() => {
    const data = muscleFilter === "ALL" 
      ? EXERCISES_DATA 
      : EXERCISES_DATA.filter(e => e.muscle === muscleFilter);
    const groups = Array.from(new Set(data.map(e => e.subMuscle)));
    return ["ALL", ...groups];
  }, [muscleFilter]);

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = muscleFilter === "ALL" || ex.muscle === muscleFilter;
      const matchesSubMuscle = subMuscleFilter === "ALL" || ex.subMuscle === subMuscleFilter;
      return matchesSearch && matchesMuscle && matchesSubMuscle;
    });
  }, [searchQuery, muscleFilter, subMuscleFilter]);

  const handleMuscleChange = (val: string) => {
    setMuscleFilter(val);
    setSubMuscleFilter("ALL"); 
  };

  const protocolExercises = [
    { name: "Incline Guillotine Press", category: "CHEST • UPPER CHEST", status: "AWAITING DATA" },
    { name: "Cable Kickback (Triceps)", category: "TRICEPS • LATERAL HEAD", status: "AWAITING DATA" },
  ];

  const prImage = PlaceHolderImages.find(img => img.id === 'personal-records-illustration');
  const splitImage = PlaceHolderImages.find(img => img.id === 'training-split-tool');

  if (selectedExercise) {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedExercise(null)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-headline truncate">{selectedExercise.name}</h1>
        </div>

        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl border border-muted/20">
          <CardContent className="p-6 space-y-8">
            {/* Main Muscle Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-4 py-0.5">
                <Dumbbell className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Main Muscle getting trained</h4>
              </div>
              <div className="pl-5">
                <p className="text-sm font-bold text-foreground/80 uppercase">
                  {selectedExercise.muscle} • {selectedExercise.subMuscle}
                </p>
              </div>
            </div>

            {/* Secondary Muscles Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-accent pl-4 py-0.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secondary Muscles getting trained</h4>
              </div>
              <div className="pl-5">
                <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">
                  {selectedExercise.secondaryMuscles}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showLibrary) {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowLibrary(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Exercise Library</h1>
        </div>

        <div className="space-y-3 px-1">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise..." 
              className="w-full h-12 pl-10 pr-4 bg-white border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
            />
          </div>

          {/* Selectors Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest pl-1">MUSCLE</label>
              <Select value={muscleFilter} onValueChange={handleMuscleChange}>
                <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-white h-11 text-[10px] font-black uppercase tracking-tighter">
                  <SelectValue placeholder="Muscle Group" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {muscleGroups.map(m => (
                    <SelectItem key={m} value={m} className="text-[10px] font-bold uppercase">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest pl-1">SUB-MUSCLE</label>
              <Select value={subMuscleFilter} onValueChange={setSubMuscleFilter}>
                <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-white h-11 text-[10px] font-black uppercase tracking-tighter">
                  <SelectValue placeholder="Sub Muscle" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {subMuscleGroups.map(sm => (
                    <SelectItem key={sm} value={sm} className="text-[10px] font-bold uppercase">{sm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-320px)] mt-4">
          <div className="grid gap-2 px-1">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-12 opacity-30">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">No moves found</p>
              </div>
            ) : (
              filteredExercises.map((ex, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedExercise(ex)}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-muted/20 hover:border-primary/20 hover:bg-primary/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-[13px] text-foreground/90 truncate">{ex.name}</h4>
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-tight mt-0.5">
                      {ex.muscle} • {ex.subMuscle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Page Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold font-headline">Workouts</h1>
      </div>

      {/* 1. Personal Records Card (Wide) */}
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
              <h3 className="text-[10px] font-black text-primary uppercase tracking-tight flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Personal Records
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">8 New milestones reached</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tight">Pushing limits</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Today's Workout Card (Wide) */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-tight text-foreground/80">Today's Workout</h2>
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

      {/* 3. My Split Card (Wide - Promoted here) */}
      <Card 
        className="border-none shadow-sm bg-white overflow-hidden group cursor-pointer active:scale-[0.99] transition-all border-l-4 border-l-purple-400"
      >
        <CardContent className="p-0 flex items-center h-20">
          <div className="shrink-0 w-20 h-full relative">
            <Image 
              src={splitImage?.imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop"} 
              alt="My Split"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint="gym weights"
            />
            <div className="absolute inset-0 bg-purple-900/10" />
          </div>
          <div className="flex-1 px-4 flex items-center justify-between min-w-0">
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-tight flex items-center gap-1.5">
                <Layout className="w-3 h-3" /> My Split
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">Active Training Routine</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tight">Structured Progress</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-300/40" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Grid: Workout History & Exercise Library (Library shifted here) */}
      <div className="grid grid-cols-2 gap-4 pb-6">
        <Card className="border-none shadow-sm bg-white hover:bg-sky-50 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">History</p>
              <p className="text-xs font-bold text-foreground/80">14 sessions</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-sky-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => setShowLibrary(true)}
          className="border-none shadow-sm bg-white hover:bg-indigo-50 transition-all cursor-pointer active:scale-95 group border border-muted/20"
        >
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Library className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Library</p>
              <p className="text-xs font-bold text-foreground/80">350+ Moves</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Open <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
