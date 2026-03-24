'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Utensils, 
  History, 
  PieChart, 
  Sparkles,
  Bookmark,
  Clock,
  Mic,
  Camera,
  ChevronRight,
  Loader2,
  Trash2,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { parseMeal } from '@/ai/flows/parse-meal-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LoggedMeal {
  id: string;
  type: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  time: string;
  timestamp: number;
}

export function NutritionView() {
  const [logTab, setLogTab] = useState("log");
  const [mealInput, setMealInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [credits, setCredits] = useState(25);
  
  const [recentMeals, setRecentMeals] = useState<LoggedMeal[]>([]);
  const [savedMeals, setSavedMeals] = useState<LoggedMeal[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem('pulseflow_recent_meals');
    const savedFavorites = localStorage.getItem('pulseflow_saved_meals');
    const savedLogged = localStorage.getItem('pulseflow_today_logged_meals');
    const savedCredits = localStorage.getItem('pulseflow_meal_credits');
    
    if (savedRecent) setRecentMeals(JSON.parse(savedRecent));
    if (savedFavorites) setSavedMeals(JSON.parse(savedFavorites));
    if (savedLogged) setLoggedMeals(JSON.parse(savedLogged));
    if (savedCredits !== null) setCredits(Number(savedCredits));
    
    setIsLoaded(true);
  }, []);

  // Persist to localStorage only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_recent_meals', JSON.stringify(recentMeals));
    }
  }, [recentMeals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_saved_meals', JSON.stringify(savedMeals));
    }
  }, [savedMeals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_today_logged_meals', JSON.stringify(loggedMeals));
    }
  }, [loggedMeals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_meal_credits', credits.toString());
    }
  }, [credits, isLoaded]);

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseMeal({ description: mealInput });
      const newMeal: LoggedMeal = {
        id: Math.random().toString(36).substr(2, 9),
        type: getMealTypeByTime(),
        name: result.name,
        calories: Math.round(result.calories),
        carbs: Math.round(result.carbs),
        protein: Math.round(result.protein),
        fat: Math.round(result.fat),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      
      setLoggedMeals(prev => [newMeal, ...prev]);
      setCredits(prev => Math.max(0, prev - 1));
      setRecentMeals(prev => {
        const filtered = prev.filter(m => m.name.toLowerCase() !== newMeal.name.toLowerCase());
        return [newMeal, ...filtered].slice(0, 10);
      });
      setMealInput("");
    } catch (error) {
      console.error("Failed to parse meal", error);
    } finally {
      setIsParsing(false);
    }
  };

  const logExistingMeal = (meal: LoggedMeal) => {
    const newEntry: LoggedMeal = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    setLoggedMeals(prev => [newEntry, ...prev]);
    setCredits(prev => Math.max(0, prev - 1));
  };

  const saveMeal = (meal: LoggedMeal) => {
    if (savedMeals.find(m => m.name.toLowerCase() === meal.name.toLowerCase())) {
      setSavedMeals(prev => prev.filter(m => m.name.toLowerCase() !== meal.name.toLowerCase()));
      return;
    }
    setSavedMeals(prev => [meal, ...prev].slice(0, 50));
  };

  const deleteLoggedMeal = (id: string) => {
    setLoggedMeals(prev => prev.filter(m => m.id !== id));
  };

  const deleteSavedMeal = (id: string) => {
    setSavedMeals(prev => prev.filter(m => m.id !== id));
  };

  const getMealTypeByTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Breakfast";
    if (hour < 16) return "Lunch";
    if (hour < 21) return "Dinner";
    return "Snack";
  };

  const handleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMealInput(prev => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  const isAlreadySaved = (mealName: string) => {
    return savedMeals.some(s => s.name.toLowerCase() === mealName.toLowerCase());
  };

  const analysisImage = PlaceHolderImages.find(img => img.id === 'ai-analysis-meal');

  return (
    <div className="space-y-4 pb-24 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Nutrition</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary overflow-hidden">
        <CardContent className="p-0 flex items-center">
          <div className="shrink-0 w-20 h-20 relative">
            <Image 
              src={analysisImage?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"} 
              alt="AI Analysis"
              fill
              className="object-cover"
              data-ai-hint="noodle bowl"
            />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <h3 className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Sparkles className="w-3 h-3" /> AI Insight
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5 line-clamp-2">
              Fiber is lower today. Try adding broccoli or chia seeds to dinner to reach your goal.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <Utensils className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Meal Logging</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                TODAY'S CREDITS: <span className={cn("font-black", credits <= 5 ? "text-destructive" : "text-primary")}>{credits}/25</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={logTab} onValueChange={setLogTab} className="w-full">
            <div className="px-4 py-2">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="log" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Log
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="log" className="p-4 mt-0 space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Sparkles className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={mealInput}
                  onChange={(e) => setMealInput(e.target.value)}
                  placeholder="What did you eat?" 
                  className="w-full h-12 pl-10 pr-20 bg-white border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <Button 
                    onClick={handleSpeech}
                    size="icon" 
                    variant="ghost" 
                    className={`w-8 h-8 rounded-full transition-colors ${isListening ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-muted-foreground">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogMeal}
                disabled={isParsing || !mealInput.trim() || credits <= 0}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : credits <= 0 ? "No Credits Remaining" : "Log This Meal Now"}
              </Button>
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <ScrollArea className="h-[180px] px-4 py-2">
                <div className="space-y-2">
                  {recentMeals.length === 0 ? (
                    <p className="text-center py-8 text-[10px] font-bold text-muted-foreground uppercase opacity-40">No recent logs</p>
                  ) : (
                    recentMeals.map((meal) => {
                      const saved = isAlreadySaved(meal.name);
                      return (
                        <div key={meal.id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-muted/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <Utensils className="w-4 h-4 text-muted-foreground/60" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{meal.name}</p>
                              <p className="text-[8px] font-bold text-muted-foreground uppercase">{meal.calories} kcal</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              onClick={() => saveMeal(meal)}
                              size="icon" 
                              variant="ghost" 
                              className={cn("w-7 h-7 rounded-full transition-colors", saved ? "text-primary bg-primary/5" : "text-muted-foreground")}
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
                            </Button>
                            <Button 
                              onClick={() => logExistingMeal(meal)}
                              disabled={credits <= 0}
                              size="icon" 
                              variant="ghost" 
                              className="w-7 h-7 rounded-full bg-primary/10 text-primary"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <ScrollArea className="h-[180px] px-4 py-2">
                <div className="space-y-2">
                  {savedMeals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bookmark className="w-10 h-10 mx-auto opacity-10 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-wider">No saved meals yet</p>
                    </div>
                  ) : (
                    savedMeals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Utensils className="w-4 h-4 text-muted-foreground/60" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{meal.name}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">{meal.calories} kcal</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            onClick={() => deleteSavedMeal(meal.id)}
                            size="icon" 
                            variant="ghost" 
                            className="w-7 h-7 rounded-full text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            onClick={() => logExistingMeal(meal)}
                            disabled={credits <= 0}
                            size="icon" 
                            variant="ghost" 
                            className="w-7 h-7 rounded-full bg-primary/10 text-primary"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Today's Log</h2>
          <span className="text-[9px] font-bold text-primary uppercase flex items-center">View Summary <ChevronRight className="w-3 h-3 ml-0.5" /></span>
        </div>
        
        <ScrollArea className="h-[240px] pr-2">
          <div className="grid gap-3">
            {!isLoaded || loggedMeals.length === 0 ? (
              <p className="text-center py-8 text-[10px] font-bold text-muted-foreground uppercase opacity-30">No meals logged today</p>
            ) : (
              loggedMeals.map((meal) => (
                <Card key={meal.id} className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow group relative">
                  <CardContent className="p-0 flex h-[72px]">
                    <div className="w-14 bg-muted/20 shrink-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-muted/10">
                        <Utensils className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    </div>
                    <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0 pr-10">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">{meal.type}</p>
                          <h4 className="font-bold text-[13px] text-foreground/90 truncate leading-tight">{meal.name}</h4>
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground/30 shrink-0">{meal.time}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex gap-2.5 text-[10px] font-black text-muted-foreground/80 uppercase">
                          <span className="flex items-center gap-0.5"><span className="opacity-40">P:</span>{meal.protein}</span>
                          <span className="flex items-center gap-0.5"><span className="opacity-40">C:</span>{meal.carbs}</span>
                          <span className="flex items-center gap-0.5"><span className="opacity-40">F:</span>{meal.fat}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-primary/10 text-primary font-black border-none shadow-none">
                          {meal.calories} KCAL
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => deleteLoggedMeal(meal.id)}
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-2 top-2 w-7 h-7 rounded-full text-muted-foreground/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </section>

      <div className="grid grid-cols-2 gap-4 pb-6">
        <Card className="border-none shadow-sm bg-white hover:bg-primary/5 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Meal History</p>
              <p className="text-xs font-bold text-foreground/80">Review logs</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white hover:bg-primary/5 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Trends Analysis</p>
              <p className="text-xs font-bold text-foreground/80">Analyze intake</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
