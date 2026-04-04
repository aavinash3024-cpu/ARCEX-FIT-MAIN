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
  Target,
  Zap,
  Info,
  Check,
  Activity,
  Droplets,
  HeartPulse,
  Flame,
  Dumbbell,
  X,
  ShieldCheck,
  ZapOff
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  LineChart
} from 'recharts';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { parseMeal } from '@/ai/flows/parse-meal-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  subDays, 
  isWithinInterval, 
  startOfMonth, 
  endOfMonth, 
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addDays
} from 'date-fns';

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminA?: number;
  omega3?: number;
  vitaminC?: number;
  zinc?: number;
  selenium?: number;
  magnesium?: number;
  vitaminD?: number;
  potassium?: number;
  iron?: number;
  calcium?: number;
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
  vitaminA?: number;
  omega3?: number;
  vitaminC?: number;
  zinc?: number;
  selenium?: number;
  magnesium?: number;
  vitaminD?: number;
  potassium?: number;
  iron?: number;
  calcium?: number;
  time: string;
  timestamp: number;
  dateStr?: string; // YYYY-MM-DD
  items?: MealItem[];
  isCached?: boolean;
}

interface CachedFoodItem {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminA: number;
  omega3: number;
  vitaminC: number;
  zinc: number;
  selenium: number;
  magnesium: number;
  vitaminD: number;
  potassium: number;
  iron: number;
  calcium: number;
}

interface NutritionViewProps {
  loggedMeals: LoggedMeal[];
  setLoggedMeals: React.Dispatch<React.SetStateAction<LoggedMeal[]>>;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

export function NutritionView({ loggedMeals, setLoggedMeals }: NutritionViewProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showMealHistory, setShowMealHistory] = useState(false);
  const [showMicroAnalysis, setShowMicroAnalysis] = useState(false);
  const [logTab, setLogTab] = useState("log");
  const [mealInput, setMealInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [credits, setCredits] = useState(25);
  
  const [recentMeals, setRecentMeals] = useState<LoggedMeal[]>([]);
  const [savedMeals, setSavedMeals] = useState<LoggedMeal[]>([]);
  const [allHistory, setAllHistory] = useState<LoggedMeal[]>([]);
  const [goalData, setGoalData] = useState<any>(null);
  const [foodCache, setFoodCache] = useState<Record<string, CachedFoodItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRecent = localStorage.getItem('pulseflow_recent_meals');
    const savedFavorites = localStorage.getItem('pulseflow_saved_meals');
    const savedHistory = localStorage.getItem('pulseflow_all_meals_history');
    const savedCredits = localStorage.getItem('pulseflow_meal_credits');
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    const savedCache = localStorage.getItem('pulseflow_food_cache');
    
    if (savedRecent) setRecentMeals(JSON.parse(savedRecent));
    if (savedFavorites) setSavedMeals(JSON.parse(savedFavorites));
    if (savedHistory) setAllHistory(JSON.parse(savedHistory));
    if (savedGoal) setGoalData(JSON.parse(savedGoal));
    if (savedCache) setFoodCache(JSON.parse(savedCache));
    if (savedCredits !== null) setCredits(Number(savedCredits));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_recent_meals', JSON.stringify(recentMeals));
      localStorage.setItem('pulseflow_saved_meals', JSON.stringify(savedMeals));
      localStorage.setItem('pulseflow_all_meals_history', JSON.stringify(allHistory));
      localStorage.setItem('pulseflow_meal_credits', credits.toString());
      localStorage.setItem('pulseflow_food_cache', JSON.stringify(foodCache));
    }
  }, [recentMeals, savedMeals, allHistory, credits, foodCache, isLoaded]);

  const tryLocalParse = (input: string) => {
    const normalized = input.toLowerCase();
    const numMatch = normalized.match(/(\d+(?:\.\d+)?)/);
    const quantity = numMatch ? parseFloat(numMatch[0]) : 1;
    
    for (const [foodName, data] of Object.entries(foodCache)) {
      if (normalized.includes(foodName)) {
        const today = new Date();
        const dateStr = format(today, 'yyyy-MM-dd');
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          type: getMealTypeByTime(),
          name: `${quantity > 1 ? quantity + ' ' : ''}${foodName.charAt(0).toUpperCase() + foodName.slice(1)}`,
          calories: Math.round(data.calories * quantity),
          protein: Math.round(data.protein * quantity),
          carbs: Math.round(data.carbs * quantity),
          fat: Math.round(data.fat * quantity),
          fiber: Math.round(data.fiber * quantity),
          vitaminA: Math.round((data.vitaminA || 0) * quantity),
          omega3: (data.omega3 || 0) * quantity,
          vitaminC: Math.round((data.vitaminC || 0) * quantity),
          zinc: Math.round((data.zinc || 0) * quantity),
          selenium: Math.round((data.selenium || 0) * quantity),
          magnesium: Math.round((data.magnesium || 0) * quantity),
          vitaminD: Math.round((data.vitaminD || 0) * quantity),
          potassium: Math.round((data.potassium || 0) * quantity),
          iron: Math.round((data.iron || 0) * quantity),
          calcium: Math.round((data.calcium || 0) * quantity),
          time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: today.getTime(),
          dateStr,
          isCached: true,
          items: [{
            name: foodName,
            quantity: quantity.toString(),
            calories: Math.round(data.calories * quantity),
            protein: Math.round(data.protein * quantity),
            carbs: Math.round(data.carbs * quantity),
            fat: Math.round(data.fat * quantity),
            fiber: Math.round(data.fiber * quantity),
            vitaminA: Math.round((data.vitaminA || 0) * quantity),
            omega3: (data.omega3 || 0) * quantity,
            vitaminC: Math.round((data.vitaminC || 0) * quantity),
            zinc: Math.round((data.zinc || 0) * quantity),
            selenium: Math.round((data.selenium || 0) * quantity),
            magnesium: Math.round((data.magnesium || 0) * quantity),
            vitaminD: Math.round((data.vitaminD || 0) * quantity),
            potassium: Math.round((data.potassium || 0) * quantity),
            iron: Math.round((data.iron || 0) * quantity),
            calcium: Math.round((data.calcium || 0) * quantity),
          }]
        } as LoggedMeal;
      }
    }
    return null;
  };

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;

    const cachedMatch = tryLocalParse(mealInput);
    if (cachedMatch) {
      setLoggedMeals(prev => [cachedMatch, ...prev]);
      setAllHistory(prev => [cachedMatch, ...prev]);
      setRecentMeals(prev => {
        const filtered = prev.filter(m => m.name.toLowerCase() !== cachedMatch.name.toLowerCase());
        return [cachedMatch, ...filtered].slice(0, 10);
      });
      setMealInput("");
      return;
    }

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
        vitaminA: result.vitaminA,
        omega3: result.omega3,
        vitaminC: result.vitaminC,
        zinc: result.zinc,
        selenium: result.selenium,
        magnesium: result.magnesium,
        vitaminD: result.vitaminD,
        potassium: result.potassium,
        iron: result.iron,
        calcium: result.calcium,
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
      
      const newCacheItems: Record<string, CachedFoodItem> = {};
      result.items.forEach(item => {
        const qtyMatch = item.quantity.match(/(\d+(?:\.\d+)?)/);
        const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;
        if (qty > 0) {
          newCacheItems[item.name.toLowerCase()] = {
            calories: item.calories / qty,
            protein: item.protein / qty,
            carbs: item.carbs / qty,
            fat: item.fat / qty,
            fiber: item.fiber / qty,
            vitaminA: (item.vitaminA || 0) / qty,
            omega3: (item.omega3 || 0) / qty,
            vitaminC: (item.vitaminC || 0) / qty,
            zinc: (item.zinc || 0) / qty,
            selenium: (item.selenium || 0) / qty,
            magnesium: (item.magnesium || 0) / qty,
            vitaminD: (item.vitaminD || 0) / qty,
            potassium: (item.potassium || 0) / qty,
            iron: (item.iron || 0) / qty,
            calcium: (item.calcium || 0) / qty,
          };
        }
      });
      setFoodCache(prev => ({ ...prev, ...newCacheItems }));

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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
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

  const logHeaderImage = PlaceHolderImages.find(img => img.id === 'meal-quinoa-bowl');
  const loggingIconImage = PlaceHolderImages.find(img => img.id === 'ai-analysis-meal');

  if (showMicroAnalysis) return <MicroAnalysisView allHistory={allHistory} loggedMeals={loggedMeals} goalData={goalData} onBack={() => setShowMicroAnalysis(false)} />;
  if (showMealHistory) return <MealHistoryView allHistory={allHistory} goalData={goalData} onBack={() => setShowMealHistory(false)} />;

  if (showTrends) {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowTrends(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Trends Analysis</h1>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 bg-card/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-muted/20">
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
  }

  if (showSummary) {
    const totals = loggedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
      fiber: acc.fiber + meal.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const targetCal = goalData?.finalCalories || 2200;
    const targetP = goalData?.protein || 150;
    const targetC = goalData?.carbs || 250;
    const targetF = goalData?.fats || 70;
    const targetFI = goalData?.fiber || 30;

    const leftCal = targetCal - totals.calories;
    
    const pKcal = totals.protein * 4;
    const cKcal = totals.carbs * 4;
    const fKcal = totals.fat * 9;
    const totalMacroKcal = pKcal + cKcal + fKcal;

    const ratios = totalMacroKcal > 0 ? {
      p: Math.round((pKcal / totalMacroKcal) * 100),
      c: Math.round((cKcal / totalMacroKcal) * 100),
      f: Math.max(0, 100 - Math.round((pKcal / totalMacroKcal) * 100) - Math.round((cKcal / totalMacroKcal) * 100))
    } : { p: 0, c: 0, f: 0 };

    const macroStatuses = [
      { label: 'P', val: Math.round(targetP - totals.protein), color: MACRO_COLORS.protein },
      { label: 'C', val: Math.round(targetC - totals.carbs), color: MACRO_COLORS.carbs },
      { label: 'F', val: Math.round(targetF - totals.fat), color: MACRO_COLORS.fat },
      { label: 'FI', val: Math.round(targetFI - totals.fiber), color: MACRO_COLORS.fiber }
    ];

    const allItems = loggedMeals.flatMap(m => m.items || []);

    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowSummary(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Daily Summary</h1>
        </div>

        <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem] border border-muted/10">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">CALORIES LEFT</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground tracking-tighter">{Math.abs(Math.round(leftCal))}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">KCAL {leftCal >= 0 ? 'LEFT' : 'OVER'}</span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">INTAKE</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-foreground/80">{Math.round(totals.calories)}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">/ {targetCal}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Macro Ratio (P:C:F)</p>
                <p className="text-[10px] font-black text-primary">{ratios.p}:{ratios.c}:{ratios.f}</p>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/20">
                <div style={{ width: `${Math.min(100, (pKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.protein }} className="h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.min(100, (cKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.carbs }} className="h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.min(100, (fKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.fat }} className="h-full transition-all duration-1000 ease-out" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {macroStatuses.map((macro, idx) => (
                <div key={idx} className="bg-muted/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-muted/10 shadow-sm transition-all hover:bg-muted/10">
                  <span className="text-[9px] font-black text-muted-foreground/60 uppercase">{macro.label}</span>
                  <span className="text-xs font-black mt-0.5" style={{ color: macro.color }}>
                    {Math.abs(macro.val)}g
                  </span>
                  <span className="text-[7px] font-black text-muted-foreground uppercase tracking-tighter leading-none mt-0.5">
                    {macro.val >= 0 ? 'LEFT' : 'OVER'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-primary" /> Top Macro Sources
          </h3>
          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl">
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
                              <span className="text-[10px] font-black uppercase whitespace-nowrap" style={{ color: MACRO_COLORS[macro] }}>
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
                <Card key={meal.id} className="border-none shadow-sm bg-card hover:bg-muted/5 transition-all">
                  <CardContent className="p-4 relative">
                    <div className="space-y-2 pr-4">
                      <h4 className="font-bold text-sm text-foreground leading-tight">
                        <span className="text-primary uppercase text-[10px] mr-1">{meal.type}:</span> {meal.name}
                      </h4>
                      <div className="text-[10px] font-black text-foreground/60 leading-none uppercase tracking-tight">
                        {Math.round(meal.calories)} KCAL {meal.isCached && <Badge variant="secondary" className="h-3 py-0 px-1 bg-green-50 text-green-600 border-none font-bold uppercase text-[6px] ml-1">Cached</Badge>}
                      </div>
                      
                      {meal.items && meal.items.length > 0 && (
                        <div className="border-l-2 border-muted/20 pl-3 py-1 space-y-1.5 my-2">
                          {meal.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-tight truncate max-w-[200px]">
                                {item.quantity} {item.name}
                              </span>
                              <span className="text-[9px] font-black text-muted-foreground/40 uppercase whitespace-nowrap">
                                {Math.round(item.calories)} kcal
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-black uppercase tracking-tight pt-1">
                        <span style={{ color: MACRO_COLORS.protein }}>P {Math.round(meal.protein)}G</span>
                        <span style={{ color: MACRO_COLORS.carbs }}>C {Math.round(meal.carbs)}G</span>
                        <span style={{ color: MACRO_COLORS.fat }}>F {Math.round(meal.fat)}G</span>
                        <span style={{ color: MACRO_COLORS.fiber }}>FI {Math.round(meal.fiber)}G</span>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-4 text-[8px] font-bold text-muted-foreground/20 uppercase">
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
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative bg-muted shadow-sm">
              <Image 
                src={loggingIconImage?.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop"} 
                alt="Meal Logging"
                fill
                className="object-cover"
                data-ai-hint="gourmet salad"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Meal Logging</h2>
                {Object.keys(foodCache).length > 0 && (
                  <Badge variant="outline" className="h-4 border-primary/20 text-primary text-[7px] font-black uppercase gap-1 px-1.5">
                    <Zap className="w-2 h-2 fill-current" /> {Object.keys(foodCache).length} Learned
                  </Badge>
                )}
              </div>
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
                  className="w-full h-12 pl-10 pr-4 bg-background border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
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
                        <div key={meal.id} className="flex items-center justify-between p-3 bg-card/60 rounded-xl border border-muted/20">
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
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-card/60 rounded-xl border border-muted/20">
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

      <Card className="border-none shadow-sm overflow-hidden bg-card rounded-2xl">
        <div className="h-14 w-full relative">
          <Image 
            src={logHeaderImage?.imageUrl || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop"} 
            alt="Log Header"
            fill
            className="object-cover"
            data-ai-hint="premium salad"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-3 left-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">MEALS</h2>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">TRACKING</p>
            <button 
              onClick={() => setShowSummary(true)} 
              className="text-[9px] font-bold text-primary uppercase flex items-center hover:opacity-70 transition-opacity"
            >
              View Summary <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
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
                      <div className="w-12 bg-card/50 shrink-0 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-primary/30" />
                      </div>
                      <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0 pr-10">
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">{meal.type}</p>
                          <h4 className="font-bold text-[13px] text-foreground/90 truncate leading-tight">{meal.name}</h4>
                          <div className="text-[11px] font-bold text-foreground/60 tracking-tighter mt-0.5 flex items-center">
                            {meal.calories} kcal {meal.isCached && <Badge variant="secondary" className="h-3 py-0 px-1 bg-green-50 text-green-600 border-none font-bold uppercase text-[6px] ml-1">Local</Badge>}
                          </div>
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

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowMicroAnalysis(true)}
          className="w-full border-none shadow-sm bg-card border border-muted/20 rounded-2xl p-5 flex flex-col items-start gap-3 active:scale-[0.99] transition-all"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Micro Analysis</p>
            <p className="text-xs font-bold text-foreground/80">Skin & Performance</p>
          </div>
        </button>

        <button 
          onClick={() => setShowMealHistory(true)}
          className="w-full border-none shadow-sm bg-card border border-muted/20 rounded-2xl p-5 flex flex-col items-start gap-3 active:scale-[0.99] transition-all"
        >
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-sky-600" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Meal History</p>
            <p className="text-xs font-bold text-foreground/80">Logs</p>
          </div>
        </button>
      </div>

      <div className="pb-6">
        <button 
          onClick={() => setShowTrends(true)}
          className="w-full border-none shadow-sm bg-card border border-muted/20 rounded-2xl p-5 flex flex-col items-start gap-3 active:scale-[0.99] transition-all"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Trends</p>
            <p className="text-xs font-bold text-foreground/80">Intake</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function MicroAnalysisView({ allHistory, loggedMeals, goalData, onBack }: { allHistory: LoggedMeal[], loggedMeals: LoggedMeal[], goalData: any, onBack: () => void }) {
  const userWeight = parseFloat(goalData?.weight) || 75;
  const userGender = goalData?.gender || 'male';
  const userAge = parseInt(goalData?.age) || 25;

  const targets = useMemo(() => {
    return {
      vitaminA: userGender === 'male' ? 900 : 700,
      omega3: userGender === 'male' ? 1.6 : 1.1,
      vitaminC: userGender === 'male' ? 90 : 75,
      zinc: userGender === 'male' ? 11 : 8,
      selenium: 55,
      magnesium: userGender === 'male' ? 420 : 320,
      vitaminD: userAge > 70 ? 20 : 15,
      potassium: userGender === 'male' ? 3400 : 2600,
      iron: userGender === 'male' ? 8 : (userAge < 50 ? 18 : 8),
      calcium: userAge > 50 && userGender === 'female' ? 1200 : 1000,
    };
  }, [userWeight, userGender, userAge]);

  const totals = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => ({
      vitaminA: acc.vitaminA + (meal.vitaminA || 0),
      omega3: acc.omega3 + (meal.omega3 || 0),
      vitaminC: acc.vitaminC + (meal.vitaminC || 0),
      zinc: acc.zinc + (meal.zinc || 0),
      selenium: acc.selenium + (meal.selenium || 0),
      magnesium: acc.magnesium + (meal.magnesium || 0),
      vitaminD: acc.vitaminD + (meal.vitaminD || 0),
      potassium: acc.potassium + (meal.potassium || 0),
      iron: acc.iron + (meal.iron || 0),
      calcium: acc.calcium + (meal.calcium || 0),
    }), {
      vitaminA: 0, omega3: 0, vitaminC: 0, zinc: 0, selenium: 0,
      magnesium: 0, vitaminD: 0, potassium: 0, iron: 0, calcium: 0
    });
  }, [loggedMeals]);

  const aesthetics = [
    { key: 'vitaminA', label: "Vitamin A", sub: "Texture/Acne", val: totals.vitaminA, target: targets.vitaminA, unit: "mcg", color: "#f97316" },
    { key: 'omega3', label: "Omega-3", sub: "Hydration/Inflammation", val: totals.omega3, target: targets.omega3, unit: "g", color: "#0ea5e9" },
    { key: 'vitaminC', label: "Vitamin C", sub: "Collagen/Firmness", val: totals.vitaminC, target: targets.vitaminC, unit: "mg", color: "#eab308" },
    { key: 'zinc', label: "Zinc", sub: "Oil Control/Healing", val: totals.zinc, target: targets.zinc, unit: "mg", color: "#6366f1" },
    { key: 'selenium', label: "Selenium", sub: "UV Protection", val: totals.selenium, target: targets.selenium, unit: "mcg", color: "#f43f5e" },
  ];

  const performance = [
    { key: 'magnesium', label: "Magnesium", sub: "Repair/Relaxation", val: totals.magnesium, target: targets.magnesium, unit: "mg", color: "#a855f7" },
    { key: 'vitaminD', label: "Vitamin D", sub: "Power/Hormones", val: totals.vitaminD, target: targets.vitaminD, unit: "mcg", color: "#f59e0b" },
    { key: 'potassium', label: "Potassium", sub: "Signaling/Pump", val: totals.potassium, target: targets.potassium, unit: "mg", color: "#10b981" },
    { key: 'iron', label: "Iron", sub: "Stamina/Oxygen", val: totals.iron, target: targets.iron, unit: "mg", color: "#ef4444" },
    { key: 'calcium', label: "Calcium", sub: "Contraction/Firing", val: totals.calcium, target: targets.calcium, unit: "mg", color: "#64748b" },
  ];

  const historyTrendData = useMemo(() => {
    return [6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
      const date = subDays(new Date(), daysAgo);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayMeals = allHistory.filter(m => m.dateStr === dateStr);
      
      const dayData: any = {
        day: format(date, 'EEE'),
      };

      // Aesthetics breakdown
      let aesTotalPercent = 0;
      aesthetics.forEach(micro => {
        const dayVal = dayMeals.reduce((sum, meal) => sum + ((meal as any)[micro.key] || 0), 0);
        const p = Math.min(100, Math.round((dayVal / (targets as any)[micro.key]) * 100));
        dayData[`aes_${micro.key}`] = p;
        aesTotalPercent += p;
      });
      dayData.aesthetics_avg = Math.round(aesTotalPercent / aesthetics.length);

      // Performance breakdown
      let perfTotalPercent = 0;
      performance.forEach(micro => {
        const dayVal = dayMeals.reduce((sum, meal) => sum + ((meal as any)[micro.key] || 0), 0);
        const p = Math.min(100, Math.round((dayVal / (targets as any)[micro.key]) * 100));
        dayData[`perf_${micro.key}`] = p;
        perfTotalPercent += p;
      });
      dayData.performance_avg = Math.round(perfTotalPercent / performance.length);

      return dayData;
    });
  }, [allHistory, targets, aesthetics, performance]);

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold font-headline leading-none">Micro Analysis</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Precision Intelligence</p>
        </div>
      </div>

      <Tabs defaultValue="aesthetics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11 bg-card/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-muted/20">
          <TabsTrigger value="aesthetics" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Aesthetics (Skin)</TabsTrigger>
          <TabsTrigger value="performance" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Performance (Gym)</TabsTrigger>
        </TabsList>

        <TabsContent value="aesthetics" className="space-y-4 mt-4">
          <div className="grid gap-2 px-1">
            {aesthetics.map((item, idx) => (
              <MicroCard key={idx} rank={idx + 1} {...item} />
            ))}
          </div>
          <TrendAnalysisCard 
            data={historyTrendData} 
            dataKey="aesthetics_avg" 
            title="Aesthetics Matrix" 
            color="#f97316"
            micros={aesthetics.map(m => ({ ...m, key: `aes_${m.key}` }))}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-4">
          <div className="grid gap-2 px-1">
            {performance.map((item, idx) => (
              <MicroCard key={idx} rank={idx + 1} {...item} />
            ))}
          </div>
          <TrendAnalysisCard 
            data={historyTrendData} 
            dataKey="performance_avg" 
            title="Performance Matrix" 
            color="#10b981"
            micros={performance.map(m => ({ ...m, key: `perf_${m.key}` }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MicroCard({ rank, label, sub, val, target, unit, color }: any) {
  const percent = Math.min(100, Math.round((val / target) * 100));
  const isComplete = percent >= 100;
  
  return (
    <Card className="border-none bg-card overflow-hidden rounded-2xl border border-muted/10 group transition-all hover:bg-muted/5">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 flex flex-col items-center justify-center shrink-0 border border-muted/20 rounded-xl bg-muted/5 shadow-inner">
          <span className="text-[8px] font-black text-muted-foreground/40 leading-none">RANK</span>
          <span className="text-sm font-black text-foreground/80">{rank}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-baseline">
            <h4 className="font-black text-xs text-foreground uppercase tracking-tight">{label}</h4>
            <span className={cn("text-[9px] font-black uppercase tracking-tighter", isComplete ? "text-green-600" : "text-muted-foreground/40")}>
              {percent}% MET
            </span>
          </div>
          <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">{sub}</p>
          <div className="pt-2 space-y-1">
            <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden flex items-center relative">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]")} 
                style={{ width: `${percent}%`, backgroundColor: color }}
              />
              {isComplete && (
                <div className="absolute right-0 top-0 bottom-0 px-1 flex items-center bg-green-500 rounded-r-full">
                  <ShieldCheck className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            <div className="flex justify-between text-[7px] font-black text-muted-foreground/30 uppercase tracking-tighter">
              <span>{val.toFixed(val < 1 && val > 0 ? 2 : 0)} {unit}</span>
              <span>GOAL {target} {unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendAnalysisCard({ data, dataKey, title, color, micros }: { data: any[], dataKey: string, title: string, color: string, micros: any[] }) {
  const avg = Math.round(data.reduce((a, b) => a + b[dataKey], 0) / data.length);

  return (
    <Card className="border-none shadow-md bg-card rounded-3xl p-6 mx-1 mt-6 border border-muted/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Activity className="w-20 h-20 text-muted-foreground" />
      </div>
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">INTELLIGENCE LOG</p>
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> {title}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary leading-none">{avg}%</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1">7D EFFICIENCY</p>
          </div>
        </div>

        <div className="h-[160px] w-full -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', fontSize: '9px', fontWeight: '900', background: 'hsl(var(--card))' }}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              {/* Individual Micro Lines */}
              {micros.map((m, i) => (
                <Line 
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={1.2}
                  dot={false}
                  opacity={0.4}
                  activeDot={false}
                />
              ))}

              {/* Main Average Area */}
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                name="Combined Score"
                stroke={color} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill={`url(#color${dataKey})`} 
                animationDuration={2000}
                dot={{ r: 3, fill: color, strokeWidth: 1.5, stroke: "hsl(var(--card))" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-1 pt-2">
          {micros.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-[6px] font-black text-muted-foreground uppercase text-center leading-tight truncate w-full">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function MealHistoryView({ allHistory, goalData, onBack }: { allHistory: LoggedMeal[], goalData: any, onBack: () => void }) {
  const [refDate, setRefDate] = useState(new Date());

  const weekInterval = useMemo(() => {
    const start = startOfWeek(refDate, { weekStartsOn: 1 });
    const end = endOfWeek(refDate, { weekStartsOn: 1 });
    return { start, end };
  }, [refDate]);

  const weekDays = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map(i => addDays(weekInterval.start, i));
  }, [weekInterval]);

  const chartData = useMemo(() => {
    const targetCal = goalData?.finalCalories || 2200;
    return weekDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayMeals = allHistory.filter(m => m.dateStr === dateStr);
      const calories = dayMeals.reduce((acc, m) => acc + m.calories, 0);
      return {
        day: format(day, 'EEE'),
        calories,
        target: targetCal,
        dateStr
      };
    });
  }, [allHistory, weekDays, goalData]);

  const weeklyStats = useMemo(() => {
    const targetCal = goalData?.finalCalories || 2200;
    const totalIntake = chartData.reduce((acc, curr) => acc + curr.calories, 0);
    const totalTarget = targetCal * 7;
    const balance = totalIntake - totalTarget;
    const daysTracked = chartData.filter(d => d.calories > 0).length;
    const avgIntake = daysTracked > 0 ? Math.round(totalIntake / daysTracked) : 0;

    return { totalIntake, balance, avgIntake, daysTracked };
  }, [chartData, goalData]);

  const handlePrevWeek = () => setRefDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setRefDate(prev => addWeeks(prev, 1));

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Meal History</h1>
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

      <Card className="border-none shadow-md bg-card rounded-[1.5rem] p-5 space-y-4 mx-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WEEKLY BALANCE</p>
            <div className={cn("flex items-center gap-1.5", weeklyStats.balance <= 0 ? "text-green-600" : "text-orange-500")}>
              {weeklyStats.balance <= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              <span className="text-2xl font-black">{Math.abs(weeklyStats.balance).toLocaleString()}</span>
              <span className="text-[10px] font-bold uppercase">Kcal {weeklyStats.balance <= 0 ? 'Deficit' : 'Surplus'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">AVG INTAKE</p>
            <p className="text-lg font-black">{weeklyStats.avgIntake.toLocaleString()} <span className="text-[8px] opacity-40">KCAL</span></p>
          </div>
        </div>

        <div className="h-[160px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', fontSize: '10px', fontWeight: 'bold' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorCal)" 
                animationDuration={1500}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-3 px-1">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayMeals = allHistory.filter(m => m.dateStr === dateStr);
          const dailyCal = dayMeals.reduce((acc, m) => acc + m.calories, 0);
          const targetCal = goalData?.finalCalories || 2200;
          const diff = dailyCal - targetCal;

          return (
            <Accordion key={dateStr} type="single" collapsible className="w-full">
              <AccordionItem value={dateStr} className="border-none">
                <Card className={cn(
                  "border-none shadow-sm overflow-hidden bg-card rounded-[1.25rem] transition-all",
                  dayMeals.length === 0 ? "opacity-40" : ""
                )}>
                  <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]]:bg-muted/5 group [&>svg]:hidden">
                    <div className="flex items-center justify-between w-full py-3 px-6">
                      <div className="text-left">
                        <h3 className="text-[13px] font-black text-foreground leading-tight">
                          {format(day, 'EEEE, MMM d')}
                        </h3>
                        <p className={cn(
                          "text-[9px] font-black uppercase mt-0.5",
                          dayMeals.length > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {dayMeals.length > 0 ? `${dayMeals.length} MEALS LOGGED` : "NO DATA"}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-foreground/80">{dailyCal.toLocaleString()} <span className="text-[8px] opacity-40">KCAL</span></p>
                          {dailyCal > 0 && (
                            <p className={cn("text-[7px] font-black uppercase", diff <= 0 ? "text-green-600" : "text-orange-500")}>
                              {diff <= 0 ? 'UNDER' : 'OVER'} TARGET
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="p-3 space-y-2 bg-muted/5 border-t border-muted/10">
                      {dayMeals.length === 0 ? (
                        <p className="text-center py-4 text-[9px] font-bold text-muted-foreground uppercase">No entries recorded</p>
                      ) : (
                        dayMeals.map(meal => (
                          <Card key={meal.id} className="border border-muted/20 bg-card rounded-xl overflow-hidden shadow-sm">
                            <CardContent className="p-3 space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <p className="text-[8px] font-black text-primary uppercase tracking-widest">{meal.type}</p>
                                  <h4 className="text-xs font-bold text-foreground/90">{meal.name}</h4>
                                </div>
                                <div className="text-right">
                                  <p className="text-[11px] font-black">{Math.round(meal.calories)} <span className="text-[8px] opacity-40 uppercase">Kcal</span></p>
                                  <p className="text-[7px] font-bold text-muted-foreground uppercase">{meal.time}</p>
                                </div>
                              </div>
                              
                              {meal.items && meal.items.length > 0 && (
                                <div className="border-l-2 border-muted/20 pl-2.5 py-0.5 space-y-1 my-1">
                                  {meal.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                      <span className="text-[9px] font-bold text-muted-foreground/80 uppercase truncate max-w-[180px]">
                                        {item.quantity} {item.name}
                                      </span>
                                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase">
                                        {Math.round(item.calories)} kcal
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-3 text-[9px] font-black uppercase tracking-tight pt-1 border-t border-muted/5">
                                <span style={{ color: MACRO_COLORS.protein }}>P {Math.round(meal.protein)}G</span>
                                <span style={{ color: MACRO_COLORS.carbs }}>C {Math.round(meal.carbs)}G</span>
                                <span style={{ color: MACRO_COLORS.fat }}>F {Math.round(meal.fat)}G</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
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

function TrendsContent({ period, history, goalData }: { period: 'weekly' | 'monthly', history: LoggedMeal[], goalData: any }) {
  const [refDate, setRefDate] = useState(new Date());

  const handlePrev = () => {
    if (period === 'weekly') setRefDate(prev => subWeeks(prev, 1));
    else setRefDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    if (period === 'weekly') setRefDate(prev => addWeeks(prev, 1));
    else setRefDate(prev => addMonths(prev, 1));
  };

  const { interval, label } = useMemo(() => {
    if (period === 'weekly') {
      const start = startOfWeek(refDate, { weekStartsOn: 1 });
      const end = endOfWeek(refDate, { weekStartsOn: 1 });
      return { 
        interval: { start, end },
        label: `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      };
    } else {
      const start = startOfMonth(refDate);
      const end = endOfMonth(refDate);
      return {
        interval: { start, end },
        label: format(refDate, 'MMMM yyyy')
      };
    }
  }, [refDate, period]);

  const stats = useMemo(() => {
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
  }, [interval, history, goalData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card p-3 rounded-2xl shadow-sm border border-muted/20">
        <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full hover:bg-muted">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-foreground uppercase tracking-tight">
            {label}
          </span>
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">
            {period === 'weekly' ? 'WEEK' : 'MONTH'}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full hover:bg-muted">
          <ChevronRight className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {!stats ? (
        <Card className="border-none shadow-sm bg-card p-12 flex flex-col items-center justify-center opacity-30 gap-4">
          <Calendar className="w-12 h-12" />
          <p className="text-[10px] font-black uppercase tracking-widest text-center">No data logged for this period</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm bg-card p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Avg Calories</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{stats.avgCalories}</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Kcal</span>
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-card p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Net {stats.netSurplusDeficit >= 0 ? 'Surplus' : 'Deficit'}</p>
              <div className={cn("flex items-center gap-1", stats.netSurplusDeficit >= 0 ? "text-orange-500" : "text-green-600")}>
                {stats.netSurplusDeficit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span className="text-sm font-black">{Math.abs(stats.netSurplusDeficit)} kcal</span>
              </div>
            </Card>
          </div>

          <Card className="border-none shadow-sm bg-card overflow-hidden">
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

          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-primary" /> Average Macro Ratio
              </h3>
              <div className="space-y-2">
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/20">
                  <div style={{ width: `${stats.macroRatios.protein}%`, backgroundColor: MACRO_COLORS.protein }} className="h-full" />
                  <div style={{ width: `${stats.macroRatios.carbs}%`, backgroundColor: MACRO_COLORS.carbs }} className="h-full" />
                  <div style={{ width: `${stats.macroRatios.fat}%`, backgroundColor: MACRO_COLORS.fat }} className="h-full" />
                </div>
                <div className="flex justify-between text-[7px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>{stats.macroRatios.protein}% Protein</span>
                  <span>{stats.macroRatios.carbs}% Carbs</span>
                  <span>{stats.macroRatios.fat}% Fats</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-primary" /> Goal Achievements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(['protein', 'carbs', 'fat', 'fiber'] as const).map(macro => (
                  <div key={macro} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <p className="text-[8px] font-black uppercase text-muted-foreground">{macro}</p>
                      <span className="text-[10px] font-black" style={{ color: MACRO_COLORS[macro] }}>{stats.goalAchievements[macro]}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${stats.goalAchievements[macro]}%`, backgroundColor: MACRO_COLORS[macro] }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
