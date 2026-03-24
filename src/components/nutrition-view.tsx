'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  Loader2,
  Trash2,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { parseMeal } from '@/ai/flows/parse-meal-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, subDays, isWithinInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface LoggedMeal {
  id: string;
  type: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  time: string;
  timestamp: number;
  dateStr?: string; // YYYY-MM-DD
  items?: MealItem[];
}

export function NutritionView() {
  const [showSummary, setShowSummary] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [logTab, setLogTab] = useState("log");
  const [mealInput, setMealInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [credits, setCredits] = useState(25);
  
  const [recentMeals, setRecentMeals] = useState<LoggedMeal[]>([]);
  const [savedMeals, setSavedMeals] = useState<LoggedMeal[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [allHistory, setAllHistory] = useState<LoggedMeal[]>([]);
  const [goalData, setGoalData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem('pulseflow_recent_meals');
    const savedFavorites = localStorage.getItem('pulseflow_saved_meals');
    const savedLogged = localStorage.getItem('pulseflow_today_logged_meals');
    const savedHistory = localStorage.getItem('pulseflow_all_meals_history');
    const savedCredits = localStorage.getItem('pulseflow_meal_credits');
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    
    if (savedRecent) setRecentMeals(JSON.parse(savedRecent));
    if (savedFavorites) setSavedMeals(JSON.parse(savedFavorites));
    if (savedLogged) setLoggedMeals(JSON.parse(savedLogged));
    if (savedHistory) setAllHistory(JSON.parse(savedHistory));
    if (savedGoal) setGoalData(JSON.parse(savedGoal));
    if (savedCredits !== null) setCredits(Number(savedCredits));
    
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_recent_meals', JSON.stringify(recentMeals));
      localStorage.setItem('pulseflow_saved_meals', JSON.stringify(savedMeals));
      localStorage.setItem('pulseflow_today_logged_meals', JSON.stringify(loggedMeals));
      localStorage.setItem('pulseflow_all_meals_history', JSON.stringify(allHistory));
      localStorage.setItem('pulseflow_meal_credits', credits.toString());
    }
  }, [recentMeals, savedMeals, loggedMeals, allHistory, credits, isLoaded]);

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseMeal({ description: mealInput });
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');
      
      const newMeal: LoggedMeal = {
        id: Math.random().toString(36).substr(2, 9),
        type: getMealTypeByTime(),
        name: result.name,
        calories: Math.round(result.calories),
        carbs: Math.round(result.carbs),
        protein: Math.round(result.protein),
        fat: Math.round(result.fat),
        fiber: Math.round(result.fiber || 0),
        time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: today.getTime(),
        dateStr,
        items: result.items.map(i => ({
          ...i,
          calories: Math.round(i.calories),
          protein: Math.round(i.protein),
          carbs: Math.round(i.carbs),
          fat: Math.round(i.fat),
          fiber: Math.round(i.fiber)
        }))
      };
      
      setLoggedMeals(prev => [newMeal, ...prev]);
      setAllHistory(prev => [newMeal, ...prev]);
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
    const today = new Date();
    const dateStr = format(today, 'yyyy-MM-dd');
    const newEntry: LoggedMeal = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: today.getTime(),
      dateStr
    };
    setLoggedMeals(prev => [newEntry, ...prev]);
    setAllHistory(prev => [newEntry, ...prev]);
    setCredits(prev => Math.max(0, prev - 1));
  };

  const saveMeal = (meal: LoggedMeal) => {
    const isAlreadySaved = savedMeals.some(m => m.name.toLowerCase() === meal.name.toLowerCase());
    if (isAlreadySaved) {
      setSavedMeals(prev => prev.filter(m => m.name.toLowerCase() !== meal.name.toLowerCase()));
      return;
    }
    setSavedMeals(prev => [meal, ...prev].slice(0, 50));
  };

  const deleteLoggedMeal = (id: string) => {
    setLoggedMeals(prev => prev.filter(m => m.id !== id));
    setAllHistory(prev => prev.filter(m => m.id !== id));
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
    if (!SpeechRecognition) return;
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
  const logHeaderImage = PlaceHolderImages.find(img => img.id === 'meal-quinoa-bowl');

  // TRENDS ANALYSIS LOGIC
  const renderTrendsView = () => {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowTrends(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Trends Analysis</h1>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-muted/20">
            <TabsTrigger value="weekly" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Monthly</TabsTrigger>
          </TabsList>

          {['weekly', 'monthly'].map((period) => (
            <TabsContent key={period} value={period} className="space-y-4 mt-4">
              <TrendsContent period={period as 'weekly' | 'monthly'} history={allHistory} goalData={goalData} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  if (showTrends) return renderTrendsView();

  if (showSummary) {
    const totals = loggedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
      fiber: acc.fiber + meal.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const totalMainMacros = totals.protein + totals.carbs + totals.fat;
    const proteinPct = totalMainMacros > 0 ? (totals.protein / totalMainMacros) * 100 : 0;
    const carbsPct = totalMainMacros > 0 ? (totals.carbs / totalMainMacros) * 100 : 0;
    const fatPct = totalMainMacros > 0 ? (totals.fat / totalMainMacros) * 100 : 0;

    const allItems = loggedMeals.flatMap(m => m.items || []);

    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowSummary(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Daily Summary</h1>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[1.25rem]">
          <CardContent className="p-4 space-y-3">
            <div className="text-center">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Total Intake</p>
              <div className="flex items-baseline justify-center gap-0.5 mt-1">
                <p className="text-3xl font-black text-foreground">{Math.round(totals.calories)}</p>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kcal</span>
              </div>
            </div>

            <div className="space-y-1.5 px-2">
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/20">
                <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${proteinPct}%` }} />
                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${carbsPct}%` }} />
                <div className="bg-yellow-500 h-full transition-all duration-1000" style={{ width: `${fatPct}%` }} />
              </div>
              <div className="flex justify-between text-[7px] font-black text-muted-foreground uppercase tracking-widest px-0.5">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> PROTEIN</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> CARBS</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> FATS</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-muted/10">
              <div className="text-center">
                <p className="text-base font-black text-sky-600 leading-none">{Math.round(totals.protein)}g</p>
                <p className="text-[7px] font-bold text-muted-foreground uppercase mt-1">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black text-primary leading-none">{Math.round(totals.carbs)}g</p>
                <p className="text-[7px] font-bold text-muted-foreground uppercase mt-1">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black text-yellow-600 leading-none">{Math.round(totals.fat)}g</p>
                <p className="text-[7px] font-bold text-muted-foreground uppercase mt-1">Fats</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black text-green-600 leading-none">{Math.round(totals.fiber)}g</p>
                <p className="text-[7px] font-bold text-muted-foreground uppercase mt-1">Fiber</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-primary" /> Top Macro Sources
          </h3>
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <Tabs defaultValue="protein" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-9 bg-muted/30 p-1 rounded-none">
                  <TabsTrigger value="protein" className="text-[9px] font-black uppercase tracking-tight">P</TabsTrigger>
                  <TabsTrigger value="carbs" className="text-[9px] font-black uppercase tracking-tight">C</TabsTrigger>
                  <TabsTrigger value="fat" className="text-[9px] font-black uppercase tracking-tight">F</TabsTrigger>
                  <TabsTrigger value="fiber" className="text-[9px] font-black uppercase tracking-tight">FI</TabsTrigger>
                </TabsList>
                {(['protein', 'carbs', 'fat', 'fiber'] as const).map(macro => {
                  const sortedItems = [...allItems]
                    .sort((a, b) => b[macro] - a[macro])
                    .filter(item => item[macro] > 0)
                    .slice(0, 5);

                  return (
                    <TabsContent key={macro} value={macro} className="p-3 mt-0">
                      <div className="space-y-2">
                        {sortedItems.length === 0 ? (
                          <p className="text-[9px] text-center py-6 text-muted-foreground uppercase font-bold tracking-widest opacity-40">No items found</p>
                        ) : (
                          sortedItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-muted/5 p-2 rounded-lg border border-muted/10">
                              <span className="text-[10px] font-bold text-foreground/70 uppercase truncate max-w-[180px]">
                                {item.quantity} {item.name}
                              </span>
                              <span className="text-[10px] font-black text-primary uppercase whitespace-nowrap">
                                {item[macro]}g
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-2">
             <History className="w-3.5 h-3.5 text-primary" /> Meal Breakdown
          </h3>
          <div className="space-y-2">
            {loggedMeals.length === 0 ? (
              <p className="text-center py-16 opacity-30 text-[10px] font-black uppercase tracking-widest">No entries recorded</p>
            ) : (
              loggedMeals.map(meal => (
                <Card key={meal.id} className="border-none shadow-sm bg-white hover:bg-muted/5 transition-all">
                  <CardContent className="p-4 relative">
                    <div className="space-y-1.5 pr-12">
                      <h4 className="font-bold text-sm text-foreground">
                        <span className="text-primary uppercase text-[10px] mr-1">{meal.type}:</span> {meal.name}
                      </h4>
                      <p className="text-xs font-black text-foreground/60 leading-none mb-2">{Math.round(meal.calories)} KCAL</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-black text-muted-foreground uppercase tracking-tight pt-1">
                        <span className="text-sky-600">P {Math.round(meal.protein)}g</span>
                        <span className="text-primary">C {Math.round(meal.carbs)}g</span>
                        <span className="text-yellow-600">F {Math.round(meal.fat)}g</span>
                        <span className="text-green-600">FI {Math.round(meal.fiber)}g</span>
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-4 text-[8px] font-bold text-muted-foreground/30 uppercase">
                      {meal.time}
                    </span>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

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
              Stay focused! Logging consistently is the best way to hit your goals.
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
                  className="w-full h-12 pl-10 pr-20 bg-white border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <Button onClick={handleSpeech} size="icon" variant="ghost" className={`w-8 h-8 rounded-full transition-colors ${isListening ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
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
                            <Button onClick={() => logExistingMeal(meal)} disabled={credits <= 0} size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-primary/10 text-primary">
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
                    <div className="text-center py-8 opacity-20">
                      <Bookmark className="w-10 h-10 mx-auto opacity-10 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-wider">No saved meals</p>
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
                          <Button onClick={() => deleteSavedMeal(meal.id)} size="icon" variant="ghost" className="w-7 h-7 rounded-full text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button onClick={() => logExistingMeal(meal)} disabled={credits <= 0} size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-primary/10 text-primary">
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

      <Card className="border-none shadow-md overflow-hidden bg-white rounded-2xl">
        <div className="h-14 w-full relative">
          <Image 
            src={logHeaderImage?.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"} 
            alt="Log Header"
            fill
            className="object-cover"
            data-ai-hint="salad bowl"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-3 left-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">MEALS</h2>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">TRACKING</p>
            <span onClick={() => setShowSummary(true)} className="text-[9px] font-bold text-primary uppercase flex items-center cursor-pointer hover:opacity-70 transition-opacity">
              View Summary <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          
          <ScrollArea className="h-[216px] pr-2">
            <div className="grid gap-3">
              {!isLoaded || loggedMeals.length === 0 ? (
                <p className="text-center py-12 text-[10px] font-bold text-muted-foreground uppercase opacity-30">No entries today</p>
              ) : (
                loggedMeals.map((meal) => (
                  <Card key={meal.id} className="border-none shadow-sm overflow-hidden bg-muted/20 hover:bg-muted/30 transition-all group relative">
                    <CardContent className="p-0 flex min-h-[72px]">
                      <div className="w-1.5 bg-primary/40 shrink-0" />
                      <div className="w-12 bg-white/50 shrink-0 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-primary/30" />
                      </div>
                      <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0 pr-10">
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">{meal.type}</p>
                          <h4 className="font-bold text-[13px] text-foreground/90 truncate leading-tight">{meal.name}</h4>
                          <p className="text-[11px] font-bold text-foreground/60 tracking-tighter mt-0.5">
                            {meal.calories} kcal
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => deleteLoggedMeal(meal.id)} size="icon" variant="ghost" className="absolute right-2 top-2 w-7 h-7 rounded-full text-destructive/40 hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <span className="absolute bottom-2 right-2 text-[7px] font-bold text-muted-foreground/30">{meal.time}</span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 pb-6">
        <Card 
          onClick={() => setShowTrends(true)}
          className="border-none shadow-sm bg-white hover:bg-primary/5 transition-all cursor-pointer border border-muted/20 group rounded-2xl"
        >
          <CardContent className="p-4 flex flex-col items-start gap-2">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Trends Analysis</p>
              <p className="text-xs font-bold text-foreground/80">Analyze intake</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
              Go to Tool <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-component for Trends Content
function TrendsContent({ period, history, goalData }: { period: 'weekly' | 'monthly', history: LoggedMeal[], goalData: any }) {
  const stats = useMemo(() => {
    const today = new Date();
    const interval = period === 'weekly' 
      ? { start: startOfWeek(today), end: endOfWeek(today) }
      : { start: startOfMonth(today), end: endOfMonth(today) };

    const periodHistory = history.filter(m => {
      const d = new Date(m.timestamp);
      return isWithinInterval(d, interval);
    });

    const daysWithLogs = Array.from(new Set(periodHistory.map(m => m.dateStr)));
    if (daysWithLogs.length === 0) return null;

    const dailyTotals = daysWithLogs.map(date => {
      const dayMeals = periodHistory.filter(m => m.dateStr === date);
      return dayMeals.reduce((acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
        fiber: acc.fiber + m.fiber,
        date
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, date });
    });

    const avgCalories = Math.round(dailyTotals.reduce((a, b) => a + b.calories, 0) / daysWithLogs.length);
    const sortedByCal = [...dailyTotals].sort((a, b) => b.calories - a.calories);
    const highestCalDay = sortedByCal[0];
    const lowestCalDay = sortedByCal[sortedByCal.length - 1];

    const totalProtein = periodHistory.reduce((a, b) => a + b.protein, 0);
    const totalCarbs = periodHistory.reduce((a, b) => a + b.carbs, 0);
    const totalFat = periodHistory.reduce((a, b) => a + b.fat, 0);
    const totalFiber = periodHistory.reduce((a, b) => a + b.fiber, 0);
    const totalMacros = totalProtein + totalCarbs + totalFat;

    const targetCal = goalData?.finalCalories || 2200;
    const netSurplusDeficit = avgCalories - targetCal;

    const goalAchievements = {
      protein: Math.min(100, Math.round(((totalProtein / daysWithLogs.length) / (goalData?.protein || 150)) * 100)),
      carbs: Math.min(100, Math.round(((totalCarbs / daysWithLogs.length) / (goalData?.carbs || 250)) * 100)),
      fat: Math.min(100, Math.round(((totalFat / daysWithLogs.length) / (goalData?.fats || 70)) * 100)),
      fiber: Math.min(100, Math.round(((totalFiber / daysWithLogs.length) / (goalData?.fiber || 30)) * 100))
    };

    return {
      avgCalories,
      highestCalDay,
      lowestCalDay,
      macroRatios: {
        protein: Math.round((totalProtein / totalMacros) * 100),
        carbs: Math.round((totalCarbs / totalMacros) * 100),
        fat: Math.round((totalFat / totalMacros) * 100)
      },
      goalAchievements,
      netSurplusDeficit,
      daysTracked: daysWithLogs.length
    };
  }, [period, history, goalData]);

  if (!stats) {
    return (
      <Card className="border-none shadow-sm bg-white p-12 flex flex-col items-center justify-center opacity-30 gap-4">
        <Calendar className="w-12 h-12" />
        <p className="text-[10px] font-black uppercase tracking-widest text-center">No data logged for this {period}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-sm bg-white p-4 space-y-1">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Avg Calories</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black">{stats.avgCalories}</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Kcal</span>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white p-4 space-y-1">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Net {stats.netSurplusDeficit >= 0 ? 'Surplus' : 'Deficit'}</p>
          <div className={cn("flex items-center gap-1", stats.netSurplusDeficit >= 0 ? "text-orange-500" : "text-green-600")}>
            {stats.netSurplusDeficit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span className="text-sm font-black">{Math.abs(stats.netSurplusDeficit)} kcal</span>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-primary" /> Daily Extremes
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase">Highest Intake</p>
              <p className="text-sm font-black">{stats.highestCalDay.calories} kcal</p>
              <p className="text-[8px] font-bold text-primary uppercase">{format(new Date(stats.highestCalDay.date), 'MMM do')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase">Lowest Intake</p>
              <p className="text-sm font-black">{stats.lowestCalDay.calories} kcal</p>
              <p className="text-[8px] font-bold text-primary uppercase">{format(new Date(stats.lowestCalDay.date), 'MMM do')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <PieChart className="w-3.5 h-3.5 text-primary" /> Average Macro Ratio
          </h3>
          <div className="space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/20">
              <div className="bg-sky-500 h-full" style={{ width: `${stats.macroRatios.protein}%` }} />
              <div className="bg-primary h-full" style={{ width: `${stats.macroRatios.carbs}%` }} />
              <div className="bg-yellow-500 h-full" style={{ width: `${stats.macroRatios.fat}%` }} />
            </div>
            <div className="flex justify-between text-[7px] font-black text-muted-foreground uppercase tracking-widest">
              <span>{stats.macroRatios.protein}% Protein</span>
              <span>{stats.macroRatios.carbs}% Carbs</span>
              <span>{stats.macroRatios.fat}% Fats</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-primary" /> Goal Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(['protein', 'carbs', 'fat', 'fiber'] as const).map(macro => (
              <div key={macro} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <p className="text-[8px] font-black uppercase text-muted-foreground">{macro}</p>
                  <span className="text-[10px] font-black text-primary">{stats.goalAchievements[macro]}%</span>
                </div>
                <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${stats.goalAchievements[macro]}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
