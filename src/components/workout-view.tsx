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
  CheckCircle2,
  X,
  Check,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Medal,
  Timer,
  Zap,
  AlertTriangle
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
  differenceInDays,
  parseISO
} from "date-fns";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

type WeeklySplit = Record<string, Exercise[]>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getExerciseType = (name: string): 'strength' | 'time' => {
  const n = name.toLowerCase();
  if (n.includes('running') || n.includes('cycling') || n.includes('plank')) return 'time';
  return 'strength';
};

const formatExerciseTime = (seconds: any) => {
  const total = parseInt(seconds) || 0;
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

export function WorkoutView() {
  const [activeSubView, setActiveSubView] = useState<'main' | 'library' | 'split' | 'history' | 'pr' | 'pr-detail'>('main');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedPR, setSelectedPR] = useState<any | null>(null);
  
  const [split, setSplit] = useState<WeeklySplit>({});
  const [extraMoves, setExtraMoves] = useState<Exercise[]>([]);
  const [loggingExercise, setLoggingExercise] = useState<Exercise | null>(null);
  const [loggedSets, setLoggedSets] = useState<Record<string, any[]>>({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<string>("ALL");
  const [subMuscleFilter, setSubMuscleFilter] = useState<string>("ALL");
  const [isLoaded, setIsLoaded] = useState(false);

  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [minInput, setMinInput] = useState("");
  const [secInput, setSecInput] = useState("");

  const todayName = format(new Date(), 'EEEE');

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
      try {
        const parsed = JSON.parse(savedExtra);
        if (parsed.date === todayStr) setExtraMoves(parsed.moves);
      } catch (e) {
        console.error("Failed to load extra moves", e);
      }
    }

    const savedLogs = localStorage.getItem('pulseflow_workout_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        if (parsed.date === todayStr) setLoggedSets(parsed.data);
      } catch (e) {
        console.error("Failed to load workout logs", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && Object.keys(split).length > 0) {
      localStorage.setItem('pulseflow_workout_split', JSON.stringify(split));
    }
  }, [split, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      localStorage.setItem('pulseflow_extra_moves', JSON.stringify({ date: todayStr, moves: extraMoves }));
    }
  }, [extraMoves, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      localStorage.setItem('pulseflow_workout_logs', JSON.stringify({ date: todayStr, data: loggedSets }));
      
      const savedHistory = localStorage.getItem('pulseflow_workout_history');
      const historyObj = savedHistory ? JSON.parse(savedHistory) : {};
      historyObj[todayStr] = loggedSets;
      localStorage.setItem('pulseflow_workout_history', JSON.stringify(historyObj));
    }
  }, [loggedSets, isLoaded]);

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

  const filteredLibrary = useMemo(() => {
    return EXERCISES_DATA.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = muscleFilter === "ALL" || ex.muscle === muscleFilter;
      return matchesSearch && matchesMuscle;
    });
  }, [searchQuery, muscleFilter]);

  const todaysExercises = useMemo(() => {
    const fromSplit = split[todayName] || [];
    return [...fromSplit, ...extraMoves];
  }, [split, todayName, extraMoves]);

  const handleLogSet = (exerciseName: string, setData: any) => {
    setLoggedSets(prev => {
      const current = prev[exerciseName] || [];
      if (current.length >= 20) return prev;
      return { ...prev, [exerciseName]: [...current, setData] };
    });
  };

  const handleAddExtraMoves = (exercises: Exercise[]) => {
    const currentTotal = todaysExercises.length;
    const capacity = 50 - currentTotal;
    const newMoves = exercises
      .filter(ex => !todaysExercises.some(e => e.name === ex.name))
      .slice(0, capacity);
    setExtraMoves(prev => [...prev, ...newMoves]);
  };

  const removeSet = (exerciseName: string, index: number) => {
    setLoggedSets(prev => {
      const current = [...(prev[exerciseName] || [])];
      current.splice(index, 1);
      return { ...prev, [exerciseName]: current };
    });
  };

  const splitImage = PlaceHolderImages.find(img => img.id === 'training-split-tool');
  const prImage = PlaceHolderImages.find(img => img.id === 'personal-records-illustration');

  if (selectedExercise) {
    return (
      <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedExercise(null)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-headline truncate">{selectedExercise.name}</h1>
        </div>

        <Card className="border-none shadow-lg bg-card overflow-hidden rounded-3xl border border-muted/20">
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
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</h4>
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

            <div className="pt-6 border-t border-muted/10">
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex gap-3 items-start shadow-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Safety Disclaimer</p>
                  <p className="text-[10px] leading-relaxed text-amber-700/80 font-medium italic">
                    Instructions provided are for informational purposes only. To ensure safety and prevent injury, we strongly recommend consulting a certified fitness professional or using a spotter for heavy lifts. By utilizing these guides, you acknowledge that you are performing activities at your own risk and are solely accountable for your physical safety and technique.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSubView === 'library') {
    return (
      <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
              className="w-full h-12 pl-10 pr-4 bg-background border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-1">
            {muscleGroups.map(m => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  muscleFilter === m 
                    ? "bg-primary text-white border-primary shadow-md" 
                    : "bg-card text-muted-foreground border-muted/20"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <Select value={subMuscleFilter} onValueChange={setSubMuscleFilter}>
            <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-card h-11 text-[10px] font-black uppercase tracking-tighter">
              <SelectValue placeholder="Select Sub-Muscle" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {subMuscleGroups.map(sm => (
                <SelectItem key={sm} value={sm} className="text-[10px] font-bold uppercase">{sm}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                className="flex items-center justify-between p-4 bg-card rounded-2xl border border-muted/20 hover:border-primary/20 hover:bg-primary/5 transition-all text-left group active:scale-[0.98]"
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

  if (activeSubView === 'pr') {
    return (
      <PersonalRecordsView 
        onBack={() => setActiveSubView('main')} 
        onViewDetail={(pr) => {
          setSelectedPR(pr);
          setActiveSubView('pr-detail');
        }}
      />
    );
  }

  if (activeSubView === 'pr-detail') {
    return (
      <PRDetailView 
        viewingPRs={selectedPR} 
        onBack={() => setActiveSubView('pr')}
      />
    );
  }

  return (
    <div className="space-y-4 pb-20 pt-4">
      <div className="px-1">
        <h1 className="text-2xl font-bold font-headline">Workouts</h1>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card rounded-2xl">
        <div className="relative h-24 w-full">
          <Image 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"
            alt="Workout Banner"
            fill
            className="object-cover"
            data-ai-hint="gym weights"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground">Today's Session</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                {todayName.toUpperCase()}: <span className="text-primary font-black">{todaysExercises.length} EXERCISES</span>
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setSearchQuery("");
                setMuscleFilter("ALL");
                document.dispatchEvent(new CustomEvent('open-extra-moves'));
              }}
              className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-primary transition-colors border border-white/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <ScrollArea className="h-[200px] pr-2">
            <div className="space-y-2.5 pb-2">
              {todaysExercises.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-muted/20 rounded-xl opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No moves planned for today</p>
                </div>
              ) : (
                todaysExercises.map((ex, idx) => {
                  const logs = loggedSets[ex.name] || [];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setLoggingExercise(ex);
                        setWeightInput("");
                        setRepsInput("");
                        setMinInput("");
                        setSecInput("");
                      }}
                      className="w-full text-left bg-muted/20 p-3 rounded-xl border border-muted/10 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all hover:border-primary/20"
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
                              {set.type === 'time' ? formatExerciseTime(set.time) : `${set.weight}kg x ${set.reps}`}
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
        </CardContent>
      </Card>

      <Card 
        onClick={() => setActiveSubView('split')}
        className="border-none shadow-sm bg-card overflow-hidden group cursor-pointer active:scale-[0.99] transition-all border-l-4 border-l-purple-400 rounded-lg flex items-center h-20 mx-1"
      >
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
      </Card>

      <Card 
        onClick={() => setActiveSubView('pr')} 
        className="border-none shadow-sm bg-card border-l-4 border-l-primary overflow-hidden group cursor-pointer active:scale-[0.99] transition-all rounded-lg flex items-center h-20 mx-1"
      >
        <div className="shrink-0 w-20 h-full relative">
          <Image 
            src={prImage?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"} 
            alt="Personal Records"
            fill
            className="object-cover"
            data-ai-hint="gym weights"
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
      </Card>

      <div className="grid grid-cols-2 gap-4 pb-6 mx-1">
        <Card 
          onClick={() => setActiveSubView('history')}
          className="border-none shadow-sm bg-card border border-muted/20 cursor-pointer hover:bg-muted/5 transition-all p-5 flex flex-col items-start gap-3 rounded-2xl active:scale-[0.99]"
        >
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-sky-600" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">History</p>
            <p className="text-xs font-bold text-foreground/80">Logs</p>
          </div>
        </Card>
        
        <Card 
          onClick={() => setActiveSubView('library')}
          className="border-none shadow-sm bg-card hover:bg-indigo-50 transition-all cursor-pointer border border-muted/20 p-5 flex flex-col items-start gap-3 rounded-2xl active:scale-[0.99]"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Library className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Library</p>
            <p className="text-xs font-bold text-foreground/80">350+ Moves</p>
          </div>
        </Card>
      </div>

      <ExtraMovesModal 
        muscleGroups={muscleGroups} 
        filteredLibrary={filteredLibrary} 
        onAdd={handleAddExtraMoves} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        muscleFilter={muscleFilter} 
        setMuscleFilter={setMuscleFilter}
        todaysCount={todaysExercises.length}
      />

      {loggingExercise && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full max-w-lg mx-auto bg-card rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom duration-500 overflow-hidden flex flex-col h-[70vh]">
            <div className="flex items-center justify-between mb-6 pt-2">
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
                    {getExerciseType(loggingExercise.name) === 'time' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log Duration</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">MINUTES</label>
                            <Input 
                              value={minInput}
                              onChange={(e) => setMinInput(e.target.value === "" ? "" : Math.min(1440, parseInt(e.target.value) || 0).toString())}
                              type="number" 
                              placeholder="0" 
                              className="h-12 text-lg font-bold rounded-xl" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">SECONDS</label>
                            <Input 
                              value={secInput}
                              onChange={(e) => setSecInput(e.target.value === "" ? "" : Math.min(59, parseInt(e.target.value) || 0).toString())}
                              type="number" 
                              placeholder="0" 
                              className="h-12 text-lg font-bold rounded-xl" 
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            const total = (parseInt(minInput) || 0) * 60 + (parseInt(secInput) || 0);
                            if (total > 0) {
                              handleLogSet(loggingExercise.name, { type: 'time', time: total });
                              setMinInput("");
                              setSecInput("");
                            }
                          }}
                          disabled={(loggedSets[loggingExercise.name] || []).length >= 20}
                          className="w-full h-12 rounded-xl bg-primary mt-2 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                          {(loggedSets[loggingExercise.name] || []).length >= 20 ? "Limit Reached (20 Sets)" : "Log Duration"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add New Set</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">WEIGHT (KG)</label>
                            <Input 
                              value={weightInput}
                              onChange={(e) => setWeightInput(e.target.value === "" ? "" : Math.min(1000, parseInt(e.target.value) || 0).toString())}
                              type="number" 
                              placeholder="0.0" 
                              className="h-12 text-lg font-bold rounded-xl" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-muted-foreground pl-1">REPS</label>
                            <Input 
                              value={repsInput}
                              onChange={(e) => setRepsInput(e.target.value === "" ? "" : Math.min(1000, parseInt(e.target.value) || 0).toString())}
                              type="number" 
                              placeholder="0" 
                              className="h-12 text-lg font-bold rounded-xl" 
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            if (weightInput && repsInput) {
                              handleLogSet(loggingExercise.name, { type: 'strength', weight: weightInput, reps: repsInput });
                              setWeightInput("");
                              setRepsInput("");
                            }
                          }}
                          disabled={(loggedSets[loggingExercise.name] || []).length >= 20}
                          className="w-full h-12 rounded-xl bg-primary mt-2 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                          {(loggedSets[loggingExercise.name] || []).length >= 20 ? "Limit Reached (20 Sets)" : "Log Set"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="w-3.5 h-3.5" /> Today's Sets
                  </h4>
                  <div className="grid gap-2">
                    {(loggedSets[loggingExercise.name] || []).length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground py-4">No sets logged yet</p>
                    ) : (
                      (loggedSets[loggingExercise.name] || []).map((set, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-card border rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 font-bold">
                              {i + 1}
                            </Badge>
                            <p className="text-sm font-bold">
                              {set.type === 'time' ? formatExerciseTime(set.time) : `${set.weight} kg x ${set.reps} reps`}
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
    </div>
  );
}

function ExtraMovesModal({ muscleGroups, filteredLibrary, onAdd, searchQuery, setSearchQuery, muscleFilter, setMuscleFilter, todaysCount }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Exercise[]>([]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setSelectedItems([]);
    };
    document.addEventListener('open-extra-moves', handleOpen);
    return () => document.removeEventListener('open-extra-moves', handleOpen);
  }, []);

  if (!isOpen) return null;

  const toggleSelection = (ex: Exercise) => {
    const isSelected = selectedItems.some(i => i.name === ex.name);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(i => i.name !== ex.name));
    } else {
      if (todaysCount + selectedItems.length < 50) {
        setSelectedItems(prev => [...prev, ex]);
      }
    }
  };

  const handleConfirm = () => {
    onAdd(selectedItems);
    setIsOpen(false);
    setSelectedItems([]);
  };

  const isAtLimit = todaysCount + selectedItems.length >= 50;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
      <div className="w-full max-w-lg mx-auto bg-card rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom duration-500 flex flex-col h-[80vh]">
        <div className="flex items-center justify-between mb-2 pt-2">
          <div className="space-y-0.5">
            <h3 className="text-xl font-black uppercase tracking-tighter">Add Extra Exercise</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {isAtLimit ? "Daily Limit of 50 Exercises Reached" : "Added moves are temporary for today"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative mb-4 mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            autoFocus
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..." 
            className="w-full h-12 pl-10 pr-4 bg-muted/10 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-4 mb-2">
          {muscleGroups.map((m: any) => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                muscleFilter === m 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-card text-muted-foreground border-muted/20"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="grid gap-2 pb-24">
            {filteredLibrary.slice(0, 50).map((ex: any, idx: number) => {
              const isSelected = selectedItems.some(i => i.name === ex.name);
              return (
                <button 
                  key={idx} 
                  onClick={() => toggleSelection(ex)}
                  disabled={!isSelected && isAtLimit}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl text-left transition-all border",
                    isSelected ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-transparent",
                    (!isSelected && isAtLimit) && "opacity-50"
                  )}
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase">{ex.muscle} • {ex.subMuscle}</p>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                    isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/20"
                  )}>
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-muted-foreground/40" />}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            onClick={handleConfirm}
            disabled={selectedItems.length === 0}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 text-xs"
          >
            Add {selectedItems.length} Exercises <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PersonalRecordsView({ onBack, onViewDetail }: { onBack: () => void, onViewDetail: (pr: any) => void }) {
  const [history, setHistory] = useState<Record<string, Record<string, any[]>>>({});
  const [activeType, setActiveType] = useState<'strength' | 'time'>('strength');
  const [activeMuscle, setActiveMuscle] = useState<string>("CHEST");

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

  const filteredMuscles = useMemo(() => {
    const muscles = new Set<string>();
    EXERCISES_DATA.forEach(ex => {
      const type = getExerciseType(ex.name);
      if (type === activeType) {
        muscles.add(ex.muscle);
      }
    });
    return Array.from(muscles).sort();
  }, [activeType]);

  useEffect(() => {
    if (filteredMuscles.length > 0 && !filteredMuscles.includes(activeMuscle)) {
      setActiveMuscle(filteredMuscles[0]);
    }
  }, [activeType, filteredMuscles, activeMuscle]);

  const topLiftsForSelectedMuscle = useMemo(() => {
    if (!activeMuscle) return [];
    
    const recordsMap: Record<string, any[]> = {};
    
    Object.entries(history).forEach(([dateStr, dayLogs]) => {
      Object.entries(dayLogs).forEach(([exName, sets]) => {
        const exData = EXERCISES_DATA.find(e => e.name === exName);
        if (exData && exData.muscle === activeMuscle) {
          if (!recordsMap[exName]) recordsMap[exName] = [];
          sets.forEach(s => {
            if (s.type === activeType) {
              if (activeType === 'strength') {
                recordsMap[exName].push({
                  weight: parseFloat(s.weight),
                  reps: parseFloat(s.reps),
                  date: dateStr
                });
              } else {
                recordsMap[exName].push({
                  time: parseFloat(s.time),
                  date: dateStr
                });
              }
            }
          });
        }
      });
    });

    return Object.entries(recordsMap).map(([name, allSets]) => {
      let sortedSets;
      if (activeType === 'strength') {
        sortedSets = allSets.sort((a, b) => b.weight - a.weight || b.reps - a.reps || new Date(b.date).getTime() - new Date(a.date).getTime());
      } else {
        sortedSets = allSets.sort((a, b) => b.time - a.time || new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      
      return {
        name,
        records: sortedSets.slice(0, 10)
      };
    }).filter(ex => ex.records.length > 0);
  }, [history, activeMuscle, activeType]);

  return (
    <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Personal Records</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-card p-2 rounded-2xl shadow-sm border border-muted/20 mx-1">
          <button 
            onClick={() => setActiveType('strength')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeType === 'strength' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted/5"
            )}
          >
            Rep Based
          </button>
          <button 
            onClick={() => setActiveType('time')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeType === 'time' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-muted/5"
            )}
          >
            Time Based
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto whitespace-nowrap swipe-container pb-2 px-1">
          {filteredMuscles.map(muscle => (
            <button
              key={muscle}
              onClick={() => setActiveMuscle(muscle)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
                activeMuscle === muscle ? "bg-primary text-white border-primary shadow-lg" : "bg-card text-muted-foreground border-muted/20"
              )}
            >
              {muscle}
            </button>
          ))}
        </div>

        <div className="grid gap-2 px-1">
          {topLiftsForSelectedMuscle.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">No {activeType === 'time' ? 'time' : 'rep'} records for this muscle</p>
            </div>
          ) : (
            topLiftsForSelectedMuscle.map((ex, idx) => (
              <button 
                key={idx} 
                onClick={() => onViewDetail(ex)}
                className="flex items-center justify-between p-3 bg-card rounded-2xl border border-muted/20 hover:border-primary/20 hover:bg-primary/5 transition-all text-left group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                    {activeType === 'strength' ? (
                      <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                    ) : (
                      <Timer className="w-5 h-5 text-sky-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[14px] text-foreground/90 truncate block">{ex.name}</span>
                    <span className="text-[11px] font-black text-muted-foreground/60 uppercase">
                      {activeType === 'strength' ? `${ex.records[0].weight}KG` : formatExerciseTime(ex.records[0].time).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PRDetailView({ viewingPRs, onBack }: { viewingPRs: any, onBack: () => void }) {
  if (!viewingPRs) return null;

  const isTimeBased = !viewingPRs.records[0].weight;
  const bestRecord = viewingPRs.records[0];
  const daysAgo = differenceInDays(new Date(), parseISO(bestRecord.date));
  const daysText = daysAgo === 0 ? "Achieved Today" : `${daysAgo} Day${daysAgo === 1 ? '' : 's'} Ago`;

  return (
    <div className="space-y-6 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black uppercase tracking-tighter truncate leading-tight">{viewingPRs.name}</h1>
          <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">PERFORMANCE DASHBOARD</p>
        </div>
      </div>

      <Card className={cn(
        "border-none shadow-xl p-5 rounded-[1.5rem] relative overflow-hidden mx-1 flex flex-col items-center justify-center min-h-[120px]",
        isTimeBased ? "bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white" : "bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-white"
      )}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">PERSONAL RECORD</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
              <Trophy className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <p className="text-3xl font-black tracking-tighter">
            {isTimeBased 
              ? formatExerciseTime(bestRecord.time).toUpperCase()
              : `${bestRecord.weight}KG * ${bestRecord.reps} REPS`
            }
          </p>
          
          <p className="text-[9px] font-black uppercase tracking-widest text-white/60">
            {daysText}
          </p>
        </div>
      </Card>

      <div className="px-1 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-primary" /> TOP 10 RANKING HISTORY
          </h4>
          <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">PERFORMANCE TIMELINE</span>
        </div>
        
        <div className="grid gap-2.5">
          {viewingPRs.records.map((record: any, idx: number) => {
            const isTop3 = idx < 3;
            const rankColors = ['#f59e0b', '#94a3b8', '#92400e'];
            
            return (
              <Card key={idx} className="border-none shadow-sm bg-card hover:bg-muted/5 group transition-all rounded-2xl overflow-hidden border border-muted/10">
                <CardContent className="p-0 flex items-stretch">
                  <div className={cn("w-1.5 shrink-0", !isTop3 && "bg-muted/20")} style={{ backgroundColor: isTop3 ? rankColors[idx] : undefined }} />
                  
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black transition-all",
                        isTop3 ? "bg-primary/5 text-primary border border-primary/10" : "bg-muted/30 text-muted-foreground/40 border border-muted/10"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-1">
                          <p className="text-xl font-black text-foreground/80 leading-none">
                            {isTimeBased ? formatExerciseTime(record.time) : record.weight}
                          </p>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {isTimeBased ? '' : 'KG'}
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase">
                          {format(parseISO(record.date), 'MMMM do, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {!isTop3 && !isTimeBased && (
                        <div className="text-right">
                          <p className="text-[12px] font-black text-foreground/60">{record.reps}</p>
                          <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">REPS</p>
                        </div>
                      )}
                      {idx === 0 && (
                        <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100/50 shadow-sm">
                          <Medal className="w-5 h-5 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SplitBuilderView({ split, setSplit, onBack }: { split: WeeklySplit, setSplit: React.Dispatch<React.SetStateAction<WeeklySplit>>, onBack: () => void }) {
  const [activeDay, setActiveDay] = useState(DAYS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("ALL");
  const [activeMuscleReport, setActiveMuscleReport] = useState("CHEST");

  const toggleSelection = (ex: Exercise) => {
    const isSelected = selectedItems.some(i => i.name === ex.name);
    const dayExercisesCount = (split[activeDay] || []).length;
    
    if (isSelected) {
      setSelectedItems(prev => prev.filter(i => i.name !== ex.name));
    } else {
      if (dayExercisesCount + selectedItems.length < 50) {
        setSelectedItems(prev => [...prev, ex]);
      }
    }
  };

  const handleConfirmAdd = () => {
    setSplit(prev => {
      const dayExercises = prev[activeDay] || [];
      const currentCount = dayExercises.length;
      const capacity = 50 - currentCount;
      const newItems = selectedItems
        .filter(s => !dayExercises.some(e => e.name === s.name))
        .slice(0, capacity);
      return {
        ...prev,
        [activeDay]: [...dayExercises, ...newItems]
      };
    });
    setIsAdding(false);
    setSelectedItems([]);
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
          zonesDone[z] = matchingDirect.map(ex => ({ name: ex.name, day: ex.day }));
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
    <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
              activeDay === day ? "bg-primary text-white border-primary shadow-lg" : "bg-card text-muted-foreground border-muted/20"
            )}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      <Card className="border-none shadow-md bg-card overflow-hidden rounded-3xl mx-1">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-tighter text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> {activeDay} Routine
            </h3>
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

          <Button 
            onClick={() => { setIsAdding(true); setSelectedItems([]); }} 
            disabled={(split[activeDay] || []).length >= 50}
            className="w-full h-12 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <Plus className="w-4 h-4" /> Add Exercises
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-6 pt-4">
        <div className="px-2">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">WORKOUT SPLIT ANALYSIS</h2>
          </div>
          <div className="flex justify-between items-baseline mb-2">
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
                  activeMuscleReport === muscle ? "bg-primary text-white border-primary shadow-lg" : "bg-card text-muted-foreground border-muted/20"
                )}
              >
                {muscle}
              </button>
            ))}
          </div>

          {currentMuscleReport && (
            <div className="px-1">
              <Card className="border-none bg-card rounded-3xl shadow-sm p-6 space-y-6">
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
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 bg-primary rounded-full" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DIRECTLY GETTING TRAINED BY</h4>
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
                      <div className="w-1 h-3 bg-primary rounded-full" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">INDIRECTLY GETTING TRAINED BY</h4>
                    </div>
                    {currentMuscleReport.secondary.length === 0 ? (
                      <p className="text-[10px] italic text-muted-foreground pl-3">No secondary stimulation found.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {currentMuscleReport.secondary.map((ex: any, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary text-[8px] font-bold uppercase">
                            {ex.name} ({ex.day.substring(0, 3)})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 bg-primary rounded-full" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MUSCLE STATUS</h4>
                    </div>
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
          <div className="w-full max-w-lg mx-auto bg-card rounded-t-[2.5rem] shadow-2xl p-6 h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-4 pt-2">
              <h3 className="text-xl font-black uppercase tracking-tighter">Choose Moves</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-full">
                <X className="w-6 h-6" />
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
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0", 
                    muscleFilter === m ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-muted/20"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="grid gap-2 pb-24">
                {filteredLibrary.map((ex, idx) => {
                  const isSelected = selectedItems.some(i => i.name === ex.name);
                  const dayExercisesCount = (split[activeDay] || []).length;
                  const isDayAtLimit = dayExercisesCount + selectedItems.length >= 50;

                  return (
                    <button 
                      key={idx} 
                      onClick={() => toggleSelection(ex)} 
                      disabled={!isSelected && isDayAtLimit}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl text-left border transition-all",
                        isSelected ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-transparent",
                        (!isSelected && isDayAtLimit) && "opacity-50"
                      )}
                    >
                      <div>
                        <p className="text-xs font-bold text-foreground">{ex.name}</p>
                        <p className="text-[8px] font-black text-muted-foreground uppercase">{ex.muscle} • {ex.subMuscle}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border",
                        isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/20"
                      )}>
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-muted-foreground/40" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="absolute bottom-6 left-6 right-6">
              <Button 
                onClick={handleConfirmAdd}
                disabled={selectedItems.length === 0}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 text-xs"
              >
                Save {selectedItems.length} Moves <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
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

  const growthStats = useMemo(() => {
    const getWeekMuscleVolume = (start: Date) => {
      const muscleVolume: Record<string, number> = {};
      
      for (let i = 0; i < 7; i++) {
        const day = addDays(start, i);
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayLogs = history[dateStr] || {};
        Object.keys(dayLogs).forEach(exName => {
          const exercise = EXERCISES_DATA.find(e => e.name === exName);
          if (!exercise) return;
          const muscle = exercise.muscle;
          
          dayLogs[exName].forEach(s => {
            if (s.type === 'strength') {
              const vol = (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
              muscleVolume[muscle] = (muscleVolume[muscle] || 0) + vol;
            }
          });
        });
      }
      return muscleVolume;
    };

    const currentVolMap = getWeekMuscleVolume(weekInterval.start);
    const previousVolMap = getWeekMuscleVolume(subWeeks(weekInterval.start, 1));

    const muscles = Array.from(new Set([...Object.keys(currentVolMap), ...Object.keys(previousVolMap)]));
    
    return muscles.map(muscle => {
      const current = currentVolMap[muscle] || 0;
      const previous = previousVolMap[muscle] || 0;
      const change = previous > 0 ? ((current - previous) / previous) * 100 : (current > 0 ? 100 : 0);
      return { muscle, current, previous, change };
    }).filter(m => m.current > 0 || m.previous > 0);
  }, [history, weekInterval]);

  const handlePrevWeek = () => setRefDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setRefDate(prev => addWeeks(prev, 1));

  return (
    <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Workout History</h1>
      </div>

      <div className="flex items-center justify-between bg-card p-3 rounded-2xl shadow-sm border border-muted/20 mx-1">
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

      <Card className="border-none shadow-md bg-card rounded-[1.5rem] p-4 space-y-3 mx-1">
        <div className="flex items-center gap-2 border-b pb-2 border-muted/10">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">STRENGTH GROWTH FROM LAST WEEK</h3>
        </div>
        
        {growthStats.length === 0 ? (
          <p className="text-center py-4 text-[9px] font-bold text-muted-foreground uppercase opacity-40">No growth data for this week</p>
        ) : (
          <div className="grid gap-3">
            {growthStats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/5 p-2.5 rounded-xl border border-muted/10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-foreground uppercase">{stat.muscle}</p>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-primary uppercase">THIS WEEK: {stat.current.toLocaleString()} kg</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">LAST WEEK: {stat.previous.toLocaleString()} kg</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1", stat.change >= 0 ? "text-green-600" : "text-destructive")}>
                  <span className="text-[10px] font-black">{stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%</span>
                  {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-3 px-1">
        {weekDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLogs = history[dateStr] || {};
          const exerciseNames = Object.keys(dayLogs);
          
          let dailyVolume = 0;
          let primaryMusclesSet = new Set<string>();
          
          if (exerciseNames.length > 0) {
            exerciseNames.forEach(exName => {
              const sets = dayLogs[exName];
              sets.forEach(s => {
                if (s.type === 'strength') {
                  dailyVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                }
              });
              const ex = EXERCISES_DATA.find(e => e.name === exName);
              if (ex) primaryMusclesSet.add(ex.muscle);
            });
          }

          const primaryMuscles = Array.from(primaryMusclesSet).join(", ");

          return (
            <Accordion key={dateStr} type="single" collapsible className="w-full">
              <AccordionItem value={dateStr} className="border-none">
                <Card className={cn(
                  "border-none shadow-sm overflow-hidden bg-card rounded-[1.25rem] transition-all",
                  exerciseNames.length === 0 ? "opacity-40" : ""
                )}>
                  <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]]:bg-muted/5 group [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full py-3 px-6">
                      <div className="text-left">
                        <h3 className="text-[13px] font-black text-foreground leading-tight">
                          {format(day, 'EEEE, MMM d')}
                        </h3>
                        <p className={cn(
                          "text-[9px] font-black uppercase mt-0.5",
                          exerciseNames.length > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {exerciseNames.length > 0 ? primaryMuscles : "NO DATA"}
                        </p>
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase mt-0.5">
                          TOTAL VOLUME: {dailyVolume.toLocaleString()} KG
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="p-3 space-y-3 bg-muted/5 border-t border-muted/10">
                      {exerciseNames.length === 0 ? (
                        <p className="text-center py-4 text-[9px] font-bold text-muted-foreground uppercase">No logs recorded</p>
                      ) : (
                        exerciseNames.map(exName => {
                          const sets = dayLogs[exName];
                          const isTimeType = getExerciseType(exName) === 'time';
                          return (
                            <Card key={exName} className="border border-muted/20 bg-card rounded-xl overflow-hidden shadow-sm">
                              <CardContent className="p-0">
                                <div className="p-2.5 bg-muted/10 border-b border-muted/10 flex items-center gap-2">
                                  <RefreshCw className="w-3 h-3 text-primary" />
                                  <h4 className="text-[11px] font-black uppercase text-foreground/80 truncate">{exName}</h4>
                                </div>
                                <div className="p-2.5">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="border-b border-muted/10">
                                        <th className="text-[7px] font-black text-muted-foreground uppercase pb-1.5">Set</th>
                                        {isTimeType ? (
                                          <th className="text-[7px] font-black text-muted-foreground uppercase pb-1.5 text-right">Duration</th>
                                        ) : (
                                          <>
                                            <th className="text-[7px] font-black text-muted-foreground uppercase pb-1.5 text-center">Reps</th>
                                            <th className="text-[7px] font-black text-muted-foreground uppercase pb-1.5 text-right">WGT</th>
                                          </>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted/5">
                                      {sets.map((s, idx) => (
                                        <tr key={idx}>
                                          <td className="py-1.5 text-[9px] font-black text-foreground/40">{idx + 1}</td>
                                          {isTimeType ? (
                                            <td className="py-1.5 text-[9px] font-bold text-right">{formatExerciseTime(s.time)}</td>
                                          ) : (
                                            <>
                                              <td className="py-1.5 text-[9px] font-bold text-center">{s.reps}</td>
                                              <td className="py-1.5 text-[9px] font-bold text-right">{s.weight}kg</td>
                                            </>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
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
