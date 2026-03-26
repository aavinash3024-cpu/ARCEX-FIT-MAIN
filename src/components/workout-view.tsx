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
  Info,
  Clock,
  Weight,
  CheckCircle2,
  X,
  Target,
  BarChart3,
  Check
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
import { Input } from "@/components/ui/input";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  isSameDay, 
  addDays,
  isWithinInterval
} from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type WeeklySplit = Record<string, Exercise[]>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WorkoutView() {
  const [activeSubView, setActiveSubView] = useState<'main' | 'library' | 'split' | 'history'>('main');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Lifted State for consistent persistence
  const [split, setSplit] = useState<WeeklySplit>({});
  const [extraMoves, setExtraMoves] = useState<Exercise[]>([]);
  const [loggingExercise, setLoggingExercise] = useState<Exercise | null>(null);
  const [loggedSets, setLoggedSets] = useState<Record<string, any[]>>({});
  const [isAddingExtra, setIsAddingExtra] = useState(false);
  
  // Library Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string>("ALL");
  const [subMuscleFilter, setSubMuscleFilter] = useState<string>("ALL");

  const todayName = format(new Date(), 'EEEE');

  // Persistence Logic
  useEffect(() => {
    const savedSplit = localStorage.getItem('pulseflow_workout_split');
    if (savedSplit) {
      try {
        setSplit(JSON.parse(savedSplit));
      } catch (e) {
        console.error("Failed to load split", e);
      }
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const savedExtra = localStorage.getItem('pulseflow_extra_moves');
    if (savedExtra) {
      const parsed = JSON.parse(savedExtra);
      if (parsed.date === todayStr) setExtraMoves(parsed.moves);
    }

    const savedLogs = localStorage.getItem('pulseflow_workout_logs');
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      if (parsed.date === todayStr) setLoggedSets(parsed.data);
    }
  }, []);

  // Save Split whenever it changes
  useEffect(() => {
    if (Object.keys(split).length > 0) {
      localStorage.setItem('pulseflow_workout_split', JSON.stringify(split));
    }
  }, [split]);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem('pulseflow_extra_moves', JSON.stringify({ date: todayStr, moves: extraMoves }));
  }, [extraMoves]);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem('pulseflow_workout_logs', JSON.stringify({ date: todayStr, data: loggedSets }));
    
    // Sync to persistent history
    const savedHistory = localStorage.getItem('pulseflow_workout_history');
    const historyObj = savedHistory ? JSON.parse(savedHistory) : {};
    historyObj[todayStr] = loggedSets;
    localStorage.setItem('pulseflow_workout_history', JSON.stringify(historyObj));
  }, [loggedSets]);

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

  const todaysExercises = useMemo(() => {
    const fromSplit = split[todayName] || [];
    return [...fromSplit, ...extraMoves];
  }, [split, todayName, extraMoves]);

  const handleLogSet = (exerciseName: string, setData: any) => {
    setLoggedSets(prev => {
      const current = prev[exerciseName] || [];
      return { ...prev, [exerciseName]: [...current, setData] };
    });
  };

  const handleAddExtraMove = (ex: Exercise) => {
    if (todaysExercises.some(e => e.name === ex.name)) return;
    setExtraMoves(prev => [...prev, ex]);
    setIsAddingExtra(false);
  };

  const removeSet = (exerciseName: string, index: number) => {
    setLoggedSets(prev => {
      const current = [...(prev[exerciseName] || [])];
      current.splice(index, 1);
      return { ...prev, [exerciseName]: current };
    });
  };

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

            <div className="pt-4 border-t border-muted/10">
              <p className="text-[10px] font-black uppercase text-muted-foreground text-center tracking-widest opacity-60">
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
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-1">
              {muscleGroups.map(m => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
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

          <div className="grid grid-cols-1 gap-2">
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
    return <SplitBuilderView split={split} setSplit={setSplit} onBack={() => setActiveSubView('main')} />;
  }

  if (activeSubView === 'history') {
    return <WorkoutHistoryView onBack={() => setActiveSubView('main')} />;
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="pt-2">
        <h1 className="text-2xl font-bold font-headline">Workouts</h1>
      </div>

      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary overflow-hidden group">
        <CardContent className="p-0 flex items-center h-20">
          <div className="shrink-0 w-20 h-full relative">
            <Image 
              src={prImage?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"} 
              alt="Personal Records"
              fill
              className="object-cover"
              data-ai-hint="barbell illustration"
            />
          </div>
          <div className="flex-1 px-4 flex items-center justify-between min-w-0">
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-tight flex items-center gap-1.5">
                <Trophy className="w-3 h-3" /> Personal Records
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">Your recent milestones</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Workout Agenda with ScrollArea */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-tight text-foreground/80">Today's Workout</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                {todayName.toUpperCase()}: <span className="text-primary font-black">{todaysExercises.length} EXERCISES</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <ScrollArea className="h-[160px] pr-2">
            <div className="space-y-2.5 pb-2">
              {todaysExercises.length === 0 ? (
                <div className="text-center py-8 opacity-30 border-2 border-dashed rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest">No moves planned for today</p>
                </div>
              ) : (
                todaysExercises.map((ex, idx) => {
                  const logs = loggedSets[ex.name] || [];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setLoggingExercise(ex)}
                      className="bg-white p-3 rounded-xl border border-muted/20 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all hover:border-primary/20"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-bold text-[13px] text-foreground/90">{ex.name}</h4>
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{ex.muscle} • {ex.subMuscle}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] h-5 px-2">
                          {logs.length} SETS
                        </Badge>
                      </div>
                      {logs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {logs.map((set, i) => (
                            <div key={i} className="text-[8px] font-black bg-muted/30 px-1.5 py-0.5 rounded uppercase">
                              {set.type === 'time' ? `${set.time}s` : `${set.weight}kg x ${set.reps}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <Button 
            onClick={() => setIsAddingExtra(true)}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
          >
            <Plus className="w-4 h-4" /> ADD EXTRA MOVEMENT
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
              className="object-cover"
              data-ai-hint="gym weights"
            />
          </div>
          <div className="flex-1 px-4 flex items-center justify-between min-w-0">
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-tight flex items-center gap-1.5">
                <Layout className="w-3 h-3" /> My Workout Split
              </h3>
              <p className="text-xs font-bold text-foreground/90 leading-tight">Create Routine</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-300/40" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 pb-6">
        <Card 
          onClick={() => setActiveSubView('history')}
          className="border-none shadow-sm bg-white border border-muted/20 cursor-pointer hover:bg-muted/5 transition-all"
        >
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">History</p>
              <p className="text-xs font-bold text-foreground/80">Logs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => setActiveSubView('library')}
          className="border-none shadow-sm bg-white hover:bg-indigo-50 transition-all cursor-pointer border border-muted/20"
        >
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Library className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Library</p>
              <p className="text-xs font-bold text-foreground/80">350+ Moves</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logging Dialog Overlay */}
      {loggingExercise && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full max-w-lg mx-auto bg-white rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom duration-500 overflow-hidden flex flex-col h-[70vh]">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" onClick={() => setLoggingExercise(null)} />
            
            <div className="flex items-center justify-between mb-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black uppercase tracking-tighter truncate">{loggingExercise.name}</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{loggingExercise.muscle} • {loggingExercise.subMuscle}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setLoggingExercise(null)} className="rounded-full shrink-0">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-6 pb-12">
                <Card className="border-none shadow-sm bg-muted/10 p-4">
                  <div className="space-y-4">
                    {loggingExercise.type === 'time' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log Duration</label>
                        <div className="flex gap-2">
                          <Input id="time-input" type="number" placeholder="Seconds" className="h-12 text-lg font-bold rounded-xl" />
                          <Button 
                            onClick={() => {
                              const input = document.getElementById('time-input') as HTMLInputElement;
                              if (input.value) {
                                handleLogSet(loggingExercise.name, { type: 'time', time: input.value });
                                input.value = "";
                              }
                            }}
                            className="h-12 w-12 rounded-xl bg-primary"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add New Set</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">WEIGHT (KG)</label>
                            <Input id="weight-input" type="number" placeholder="0.0" className="h-12 text-lg font-bold rounded-xl" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">REPS</label>
                            <Input id="reps-input" type="number" placeholder="0" className="h-12 text-lg font-bold rounded-xl" />
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            const wInput = document.getElementById('weight-input') as HTMLInputElement;
                            const rInput = document.getElementById('reps-input') as HTMLInputElement;
                            if (wInput.value && rInput.value) {
                              handleLogSet(loggingExercise.name, { type: 'strength', weight: wInput.value, reps: rInput.value });
                              wInput.value = "";
                              rInput.value = "";
                            }
                          }}
                          className="w-full h-12 rounded-xl bg-primary mt-2 font-black uppercase tracking-widest"
                        >
                          Log Set
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="w-3 h-3" /> Today's Sets
                  </h4>
                  <div className="grid gap-2">
                    {(loggedSets[loggingExercise.name] || []).length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground py-4">No sets logged yet</p>
                    ) : (
                      (loggedSets[loggingExercise.name] || []).map((set, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 font-bold">
                              {i + 1}
                            </Badge>
                            <p className="text-sm font-bold">
                              {set.type === 'time' ? `${set.time} Seconds` : `${set.weight} kg x ${set.reps} reps`}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeSet(loggingExercise.name, i)} className="h-8 w-8 text-destructive/40 hover:text-destructive rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Add Extra Movement Overlay */}
      {isAddingExtra && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full max-w-lg mx-auto bg-white rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom duration-500 flex flex-col h-[80vh]">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" onClick={() => setIsAddingExtra(false)} />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black uppercase tracking-tighter">Add Extra Move</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddingExtra(false)} className="rounded-full">
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

            <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-4 mb-2">
              {muscleGroups.map(m => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
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

            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="grid gap-2 pb-8">
                {filteredExercises.slice(0, 50).map((ex, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleAddExtraMove(ex)}
                    className="flex items-center justify-between p-4 bg-muted/5 hover:bg-primary/5 rounded-2xl text-left transition-all"
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

function SplitBuilderView({ split, setSplit, onBack }: { split: WeeklySplit, setSplit: React.Dispatch<React.SetStateAction<WeeklySplit>>, onBack: () => void }) {
  const [activeDay, setActiveDay] = useState(DAYS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("ALL");
  const [activeMuscleReport, setActiveMuscleReport] = useState("CHEST");

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
    const muscles = Array.from(new Set(EXERCISES_DATA.map(e => e.muscle)));
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
        gaps,
        allZones: allSubMusclesForMuscle
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
              activeDay === day ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-muted-foreground border-muted/20"
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

          <ScrollArea className="h-[160px] pr-2">
            <div className="space-y-2 pb-2">
              {(split[activeDay] || []).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-muted/20 rounded-2xl opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No moves planned</p>
                </div>
              ) : (
                (split[activeDay] || []).map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/5 rounded-xl border border-muted/10">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase">{ex.muscle} • {ex.subMuscle}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeExercise(activeDay, ex.name)} className="h-8 w-8 text-destructive/40 hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <Button onClick={() => setIsAdding(true)} className="w-full h-12 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest gap-2">
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
                  activeMuscleReport === muscle ? "bg-primary text-white border-primary shadow-md" : "bg-white text-muted-foreground border-muted/20"
                )}
              >
                {muscle}
              </button>
            ))}
          </div>

          {currentMuscleReport && (
            <div className="px-1">
              <Card className="border-none bg-white rounded-3xl shadow-sm p-6 space-y-6">
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

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DIRECTLY GETTING TRAINED BY</h4>
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
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">INDIRECTLY GETTING TRAINED BY</h4>
                    {currentMuscleReport.secondary.length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground pl-3">No secondary stimulation found.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {currentMuscleReport.secondary.map((ex: any, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-600 text-[8px] font-bold uppercase">
                            {ex.name} ({ex.day.substring(0, 3)})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MUSCLE STATUS</h4>
                    <div className="grid gap-2 pl-3">
                      {currentMuscleReport.allZones.map((zone: string, i: number) => {
                        const isTrained = !!currentMuscleReport.zones[zone];
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <Badge className={cn(
                              "text-[8px] font-black uppercase h-6 px-2 flex items-center gap-1.5",
                              isTrained ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-destructive/10 text-destructive hover:bg-destructive/10"
                            )}>
                              {isTrained ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                              {zone}
                            </Badge>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest",
                              isTrained ? "text-green-600" : "text-destructive/40"
                            )}>
                              {isTrained ? "OPTIMIZED" : "NEGLECTED"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
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
              <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full h-12 pl-10 pr-4 bg-muted/10 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-4 mb-2">
              {muscleGroups.map(m => (
                <button 
                  key={m} 
                  onClick={() => setMuscleFilter(m)} 
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", 
                    muscleFilter === m ? "bg-primary text-white border-primary" : "bg-muted/5 text-muted-foreground border-muted/20"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="grid gap-2 pb-8">
                {filteredLibrary.map((ex, idx) => (
                  <button key={idx} onClick={() => addExercise(ex)} className="flex items-center justify-between p-4 bg-muted/5 hover:bg-primary/5 rounded-2xl text-left border border-transparent hover:border-primary/10 transition-all">
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

function WorkoutHistoryView({ onBack }: { onBack: () => void }) {
  const [refDate, setRefDate] = useState(new Date());
  const [history, setHistory] = useState<Record<string, Record<string, any[]>>>({});

  useEffect(() => {
    const saved = localStorage.getItem('pulseflow_workout_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const weekInterval = useMemo(() => {
    const start = startOfWeek(refDate, { weekStartsOn: 1 });
    const end = endOfWeek(refDate, { weekStartsOn: 1 });
    return { start, end };
  }, [refDate]);

  const weekDays = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map(i => addDays(weekInterval.start, i));
  }, [weekInterval]);

  const handlePrevWeek = () => setRefDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setRefDate(prev => addWeeks(prev, 1));

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Workout History</h1>
      </div>

      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-muted/20">
        <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="rounded-full hover:bg-muted">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-foreground uppercase tracking-tight">
            {format(weekInterval.start, 'MMM d')} - {format(weekInterval.end, 'MMM d, yyyy')}
          </span>
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">
            WEEKLY TIMELINE
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextWeek} className="rounded-full hover:bg-muted">
          <ChevronRight className="w-5 h-5 text-primary" />
        </Button>
      </div>

      <div className="space-y-4">
        {weekDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLogs = history[dateStr] || {};
          const exerciseNames = Object.keys(dayLogs);
          
          let dailyVolume = 0;
          let primaryMuscle = "No Data";
          
          if (exerciseNames.length > 0) {
            exerciseNames.forEach(name => {
              const sets = dayLogs[name];
              sets.forEach(s => {
                if (s.type === 'strength') {
                  dailyVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                }
              });
            });
            
            const firstEx = EXERCISES_DATA.find(e => e.name === exerciseNames[0]);
            if (firstEx) primaryMuscle = firstEx.muscle;
          }

          return (
            <Accordion key={dateStr} type="single" collapsible className="w-full">
              <AccordionItem value={dateStr} className="border-none">
                <Card className={cn(
                  "border-none shadow-md overflow-hidden bg-white rounded-3xl transition-all",
                  exerciseNames.length === 0 ? "opacity-40" : ""
                )}>
                  <AccordionTrigger className="p-0 hover:no-underline">
                    <div className="flex-1 text-left p-5">
                      <h3 className="text-sm font-black text-foreground">
                        {format(day, 'EEEE, MMM d')}
                      </h3>
                      <p className={cn(
                        "text-[10px] font-black uppercase mt-0.5",
                        exerciseNames.length > 0 ? "text-primary" : "text-muted-foreground"
                      )}>
                        {primaryMuscle}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase mt-1">
                        Total Volume: {dailyVolume.toLocaleString()} kg
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="p-4 space-y-4 bg-muted/5 border-t border-muted/10">
                      {exerciseNames.length === 0 ? (
                        <p className="text-center py-4 text-[10px] font-bold text-muted-foreground uppercase">No logs recorded</p>
                      ) : (
                        exerciseNames.map(name => {
                          const sets = dayLogs[name];
                          let exVolume = 0;
                          let exReps = 0;
                          sets.forEach(s => {
                            if (s.type === 'strength') {
                              exVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                              exReps += (parseFloat(s.reps) || 0);
                            } else {
                              exReps += (parseFloat(s.time) || 0);
                            }
                          });

                          return (
                            <Card key={name} className="border border-muted/20 bg-white rounded-2xl overflow-hidden shadow-sm">
                              <CardContent className="p-0">
                                <div className="p-3 bg-muted/10 border-b border-muted/10 flex items-center gap-2">
                                  <RefreshCw className="w-3.5 h-3.5 text-primary" />
                                  <h4 className="text-xs font-black uppercase text-foreground/80 truncate">{name}</h4>
                                </div>
                                <div className="flex">
                                  <div className="flex-1 p-3">
                                    <table className="w-full text-left">
                                      <thead>
                                        <tr className="border-b border-muted/10">
                                          <th className="text-[8px] font-black text-muted-foreground uppercase pb-2">Set</th>
                                          <th className="text-[8px] font-black text-muted-foreground uppercase pb-2 text-center">Reps</th>
                                          <th className="text-[8px] font-black text-muted-foreground uppercase pb-2 text-right">WGT</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-muted/5">
                                        {sets.map((s, idx) => (
                                          <tr key={idx}>
                                            <td className="py-2 text-[10px] font-black text-foreground/40">{idx + 1}</td>
                                            <td className="py-2 text-[10px] font-bold text-center">{s.type === 'time' ? s.time : s.reps}</td>
                                            <td className="py-2 text-[10px] font-bold text-right">{s.type === 'time' ? '---' : `${s.weight}kg`}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="w-24 bg-muted/5 border-l border-muted/10 p-3 flex flex-col justify-between items-center text-center gap-4">
                                    <div>
                                      <p className="text-[7px] font-black text-muted-foreground uppercase">Sets</p>
                                      <p className="text-xs font-black">{sets.length}</p>
                                    </div>
                                    <div>
                                      <p className="text-[7px] font-black text-muted-foreground uppercase">Reps</p>
                                      <p className="text-xs font-black">{exReps}</p>
                                    </div>
                                    <div>
                                      <p className="text-[7px] font-black text-muted-foreground uppercase">Vol</p>
                                      <p className="text-xs font-black">{exVolume.toLocaleString()} <span className="text-[7px]">kg</span></p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
