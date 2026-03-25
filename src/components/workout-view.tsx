'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  Trash2,
  Calendar,
  ChevronDown,
  Info
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type WeeklySplit = Record<string, Exercise[]>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WorkoutView() {
  const [activeSubView, setActiveSubView] = useState<'main' | 'library' | 'split'>('main');
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
    { name: "Incline Barbell Press", category: "CHEST • UPPER CHEST", status: "AWAITING DATA" },
    { name: "Skull Crushers", category: "TRICEPS • LONG HEAD", status: "AWAITING DATA" },
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

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-accent pl-4 py-0.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secondary Muscles getting trained</h4>
              </div>
              <div className="pl-5">
                <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">
                  {selectedExercise.secondaryMuscles || "None"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-muted pl-4 py-0.5">
                <Info className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Instructions</h4>
              </div>
              <div className="pl-5 space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase text-primary mb-1">Setup</p>
                  <p className="text-xs font-medium text-foreground/70 leading-relaxed">{selectedExercise.setup}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-primary mb-1">Execution</p>
                  <p className="text-xs font-medium text-foreground/70 leading-relaxed">{selectedExercise.execution}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-muted/10 text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                PREFER A COACH OR TRAINER FOR ACCURATE FORM AND RESULTS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSubView === 'library') {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setActiveSubView('main')} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Exercise Library</h1>
        </div>

        <div className="space-y-4 px-1">
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

          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest pl-1">MUSCLE GROUPS</p>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-1">
              {muscleGroups.map(m => (
                <button
                  key={m}
                  onClick={() => handleMuscleChange(m)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                    muscleFilter === m 
                      ? "bg-primary text-white border-primary shadow-md" 
                      : "bg-white text-muted-foreground border-muted/20"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest pl-1">SUB-MUSCLE FOCUS</label>
            <Select value={subMuscleFilter} onValueChange={setSubMuscleFilter}>
              <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-white h-11 text-[10px] font-black uppercase tracking-tighter">
                <SelectValue placeholder="Select Sub-Muscle" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {subMuscleGroups.map(sm => (
                  <SelectItem key={sm} value={sm} className="text-[10px] font-bold uppercase">{sm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2 px-1 mt-2">
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
      </div>
    );
  }

  if (activeSubView === 'split') {
    return <SplitBuilderView onBack={() => setActiveSubView('main')} />;
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="pt-2">
        <h1 className="text-2xl font-bold font-headline">Workouts</h1>
      </div>

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

      <Card 
        onClick={() => setActiveSubView('split')}
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
                <Layout className="w-3 h-3" /> My Workout Split
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">Create Routine</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tight">Structured Progress</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-300/40" />
          </div>
        </CardContent>
      </Card>

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
          onClick={() => setActiveSubView('library')}
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

function SplitBuilderView({ onBack }: { onBack: () => void }) {
  const [split, setSplit] = useState<WeeklySplit>({});
  const [activeDay, setActiveDay] = useState(DAYS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("ALL");
  const [activeMuscleReport, setActiveMuscleReport] = useState("CHEST");

  useEffect(() => {
    const saved = localStorage.getItem('pulseflow_workout_split');
    if (saved) {
      try {
        setSplit(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load split", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pulseflow_workout_split', JSON.stringify(split));
  }, [split]);

  const handleMuscleChange = (m: string) => {
    setMuscleFilter(m);
  };

  const addExercise = (ex: Exercise) => {
    setSplit(prev => {
      const dayExercises = prev[activeDay] || [];
      if (dayExercises.find(e => e.name === ex.name)) return prev;
      return {
        ...prev,
        [activeDay]: [...dayExercises, ex]
      };
    });
    setIsAdding(false);
    setSearchQuery("");
    setMuscleFilter("ALL");
  };

  const removeExercise = (day: string, name: string) => {
    setSplit(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(e => e.name !== name)
    }));
  };

  const muscleGroups = useMemo(() => {
    const groups = Array.from(new Set(EXERCISES_DATA.map(e => e.muscle)));
    return ["ALL", ...groups];
  }, []);

  const filteredLibrary = useMemo(() => {
    return EXERCISES_DATA.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = muscleFilter === "ALL" || ex.muscle === muscleFilter;
      return matchesSearch && matchesMuscle;
    }).slice(0, 50);
  }, [searchQuery, muscleFilter]);

  const report = useMemo(() => {
    const flatSplit = Object.entries(split).flatMap(([day, exs]) => exs.map(e => ({ ...e, day })));
    
    // Muscle groups
    const muscles = Array.from(new Set(EXERCISES_DATA.map(e => e.muscle)));
    
    // Total unique zones across library
    const totalZonesAcrossLibrary = Array.from(new Set(EXERCISES_DATA.map(e => `${e.muscle}-${e.subMuscle}`)));
    const coveredZonesAcrossSplit = new Set(flatSplit.map(e => `${e.muscle}-${e.subMuscle}`));
    const globalCoverage = Math.round((coveredZonesAcrossSplit.size / totalZonesAcrossLibrary.length) * 100);

    const muscleStats: Record<string, any> = {};
    
    muscles.forEach(m => {
      const allSubMusclesForMuscle = Array.from(new Set(EXERCISES_DATA.filter(e => e.muscle === m).map(e => e.subMuscle)));
      const directExercisesInSplit = flatSplit.filter(e => e.muscle === m);
      
      const zonesDone: Record<string, { name: string, day: string }[]> = {};
      const secondaryDone: { name: string, day: string }[] = [];
      
      allSubMusclesForMuscle.forEach(z => {
        const matchingDirect = directExercisesInSplit.filter(e => e.subMuscle === z);
        if (matchingDirect.length > 0) {
          zonesDone[z] = matchingDirect.map(e => ({ name: e.name, day: e.day }));
        }
      });

      // Find exercises where this muscle group is listed as secondary
      flatSplit.forEach(ex => {
        const isSecondaryMovers = (ex.secondaryMuscles || "").toUpperCase().includes(m.toUpperCase());
        if (isSecondaryMovers && ex.muscle !== m) {
          secondaryDone.push({ name: ex.name, day: ex.day });
        }
      });

      const coverage = Math.round((Object.keys(zonesDone).length / allSubMusclesForMuscle.length) * 100);
      const gaps = allSubMusclesForMuscle.filter(z => !zonesDone[z]);

      muscleStats[m] = {
        zones: zonesDone,
        secondary: Array.from(new Set(secondaryDone.map(s => JSON.stringify(s)))).map(s => JSON.parse(s)),
        volume: directExercisesInSplit.length,
        coverage,
        gaps
      };
    });

    return { globalCoverage, muscleStats, muscles };
  }, [split]);

  const currentMuscleReport = report.muscleStats[activeMuscleReport] || null;

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Weekly Split</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-2 px-1">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
              activeDay === day 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white text-muted-foreground border-muted/20 hover:border-primary/40"
            )}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      <Card className="border-none shadow-md bg-white overflow-hidden rounded-3xl mx-1">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-tighter text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> {activeDay} Routine
            </h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] h-5 px-2">
              {(split[activeDay] || []).length} MOVES
            </Badge>
          </div>

          <div className="space-y-2">
            {(split[activeDay] || []).length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-muted/20 rounded-2xl opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest">No moves planned</p>
              </div>
            ) : (
              (split[activeDay] || []).map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/5 rounded-xl border border-muted/10 group">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase">{ex.muscle} • {ex.subMuscle}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeExercise(activeDay, ex.name)}
                    className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-full"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <Button 
            onClick={() => setIsAdding(true)}
            className="w-full h-12 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest gap-2 shadow-none"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-6 pt-4">
        <div className="px-2">
          <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">WORKOUT SPLIT ANALYSIS</h2>
          <div className="flex justify-between items-baseline mt-4 mb-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">MUSCLE COVERAGE</p>
            <span className="text-xs font-black text-primary">{report.globalCoverage}%</span>
          </div>
          <Progress value={report.globalCoverage} className="h-2 bg-muted rounded-full" />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-2 px-2">
            {report.muscles.map(muscle => (
              <button
                key={muscle}
                onClick={() => setActiveMuscleReport(muscle)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  activeMuscleReport === muscle 
                    ? "bg-primary text-white border-primary shadow-md" 
                    : "bg-white text-muted-foreground border-muted/20"
                )}
              >
                {muscle}
              </button>
            ))}
          </div>

          {currentMuscleReport && (
            <div className="space-y-4 animate-in fade-in duration-300 px-1">
              <Card className="border-none bg-white rounded-3xl shadow-sm overflow-hidden p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-muted/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{activeMuscleReport}</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Status Analysis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">{currentMuscleReport.coverage}%</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase">Zones Hit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/5 p-3 rounded-2xl border border-muted/10 text-center">
                    <p className="text-sm font-black">{currentMuscleReport.volume}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Exercises</p>
                  </div>
                  <div className="bg-muted/5 p-3 rounded-2xl border border-muted/10 text-center">
                    <p className="text-sm font-black">{currentMuscleReport.gaps.length}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Gaps Found</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DIRECTLY GETTING TRAINED</h4>
                    </div>
                    {Object.keys(currentMuscleReport.zones).length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground pl-3">No direct movements assigned.</p>
                    ) : (
                      <div className="space-y-3 pl-3">
                        {Object.entries(currentMuscleReport.zones).map(([zone, data]: [string, any]) => (
                          <div key={zone}>
                            <p className="text-[9px] font-black uppercase text-foreground/80 mb-1">{zone}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {data.map((ex: any, i: number) => (
                                <Badge key={i} variant="outline" className="text-[8px] font-bold uppercase border-muted/30">
                                  {ex.name} ({ex.day.substring(0, 3)})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">INDIRECTLY GETTING TRAINED</h4>
                    </div>
                    {currentMuscleReport.secondary.length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground pl-3">No secondary stimulation found.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {currentMuscleReport.secondary.map((ex: any, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-600 text-[8px] font-bold uppercase hover:bg-orange-50">
                            {ex.name} ({ex.day.substring(0, 3)})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {currentMuscleReport.gaps.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive">MUSCLE STATUS</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {currentMuscleReport.gaps.map((gap: string, i: number) => (
                          <Badge key={i} className="bg-destructive/10 text-destructive text-[8px] font-black uppercase hover:bg-destructive/10">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        <p className="text-[9px] text-muted-foreground leading-relaxed text-center px-4 pt-4 opacity-60">
          Growth requires direct training. Maintenance can be achieved through secondary involvement. Analysis based on refined anatomical maps.
        </p>
      </section>

      {isAdding && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in flex items-end">
          <div className="w-full max-w-lg mx-auto bg-white rounded-t-[2.5rem] shadow-2xl p-6 h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" onClick={() => setIsAdding(false)} />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black uppercase tracking-tighter">Choose Move</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-full">
                <ChevronDown className="w-6 h-6" />
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="w-full h-12 pl-10 pr-4 bg-muted/10 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-4">
              {muscleGroups.map(m => (
                <button
                  key={m}
                  onClick={() => handleMuscleChange(m)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                    muscleFilter === m 
                      ? "bg-primary text-white border-primary" 
                      : "bg-muted/5 text-muted-foreground border-muted/20"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="grid gap-2 pb-8">
                {filteredLibrary.map((ex, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => addExercise(ex)}
                    className="flex items-center justify-between p-4 bg-muted/5 hover:bg-primary/5 rounded-2xl text-left transition-all border border-transparent hover:border-primary/10"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">{ex.name}</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase">{ex.muscle} • {ex.subMuscle}</p>
                    </div>
                    <Plus className="w-4 h-4 text-primary/40" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
