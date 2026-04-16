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
  Table as TableIcon,
  CircleCheck,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  BarChart
} from 'recharts';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { parseMeal } from '@/ai/flows/parse-meal-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
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
  addDays,
  eachDayOfInterval
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
  initialShowSummary?: boolean;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

export function NutritionView({ loggedMeals, setLoggedMeals, initialShowSummary = false }: NutritionViewProps) {
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(initialShowSummary);
  const [showMacroAnalysis, setShowMacroAnalysis] = useState(false);
  const [showMicroAnalysis, setShowMicroAnalysis] = useState(false);
  const [logTab, setLogTab] = useState("log");
  const [mealInput, setMealInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [credits, setCredits] = useState(20);
  
  const [recentMeals, setRecentMeals] = useState<LoggedMeal[]>([]);
  const [savedMeals, setSavedMeals] = useState<LoggedMeal[]>([]);
  const [allHistory, setAllHistory] = useState<LoggedMeal[]>([]);
  const [goalData, setGoalData] = useState<any>(null);
  const [foodCache, setFoodCache] = useState<Record<string, CachedFoodItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll to top on sub-view change
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [showSummary, showMacroAnalysis, showMicroAnalysis]);

  useEffect(() => {
    const savedRecent = localStorage.getItem('pulseflow_recent_meals');
    const savedFavorites = localStorage.getItem('pulseflow_saved_meals');
    const savedHistory = localStorage.getItem('pulseflow_all_meals_history');
    const savedCredits = localStorage.getItem('pulseflow_meal_credits_v2');
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    const savedCache = localStorage.getItem('pulseflow_food_cache');
    
    if (savedRecent) setRecentMeals(JSON.parse(savedRecent));
    if (savedFavorites) setSavedMeals(JSON.parse(savedFavorites));
    if (savedHistory) setAllHistory(JSON.parse(savedHistory));
    if (savedGoal) setGoalData(JSON.parse(savedGoal));
    if (savedCache) setFoodCache(JSON.parse(savedCache));
    if (savedCredits !== null) setCredits(Number(savedCredits));
    else setCredits(20);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_recent_meals', JSON.stringify(recentMeals));
      localStorage.setItem('pulseflow_saved_meals', JSON.stringify(savedMeals));
      localStorage.setItem('pulseflow_all_meals_history', JSON.stringify(allHistory));
      localStorage.setItem('pulseflow_meal_credits_v2', credits.toString());
      localStorage.setItem('pulseflow_food_cache', JSON.stringify(foodCache));
    }
  }, [recentMeals, savedMeals, allHistory, credits, foodCache, isLoaded]);

  const tryLocalParse = (input: string): LoggedMeal | null | "INVALID" => {
    const normalized = input.toLowerCase();
    const numMatch = normalized.match(/(\d+(?:\.\d+)?)/);
    const quantity = numMatch ? parseFloat(numMatch[0]) : 1;
    
    for (const [foodName, data] of Object.entries(foodCache)) {
      if (normalized.includes(foodName)) {
        const today = new Date();
        const dateStr = format(today, 'yyyy-MM-dd');
        
        const mealData = {
          id: Math.random().toString(36).substr(2, 9),
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

        if (mealData.calories > 20000) {
          toast({
            variant: "destructive",
            title: "Invalid Meal",
            description: "Meals above 20,000 calories cannot be logged."
          });
          return "INVALID";
        }

        return mealData;
      }
    }
    return null;
  };

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;

    if (credits <= 0) {
      toast({
        variant: "destructive",
        title: "No Credits Left",
        description: "You have reached your daily limit of 20 meals."
      });
      return;
    }

    const cachedResult = tryLocalParse(mealInput);
    if (cachedResult === "INVALID") {
      setMealInput("");
      return;
    }
    if (cachedResult) {
      const meal = cachedResult as LoggedMeal;
      setLoggedMeals(prev => [meal, ...prev]);
      setAllHistory(prev => [meal, ...prev]);
      setRecentMeals(prev => {
        const filtered = prev.filter(m => m.name.toLowerCase() !== meal.name.toLowerCase());
        return [meal, ...filtered].slice(0, 20);
      });
      setCredits(prev => Math.max(0, prev - 1));
      setMealInput("");
      return;
    }

    setIsParsing(true);
    try {
      const result = await parseMeal({ description: mealInput });
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');
      
      setCredits(prev => Math.max(0, prev - 1));

      if (result.calories > 20000) {
        toast({
          variant: "destructive",
          title: "Invalid Meal",
          description: "Meals above 20,000 calories cannot be logged."
        });
        setMealInput("");
        return;
      }

      const isCoherentMeal = result.calories > 0 && result.items.length > 0 && result.name.length > 2;
      if (!isCoherentMeal) {
        toast({
          variant: "destructive",
          title: "Invalid Meal",
          description: "This doesn't seem to be a meal. Please describe what you ate."
        });
        setMealInput("");
        return;
      }
      
      const newMeal: LoggedMeal = {
        id: Math.random().toString(36).substr(2, 9),
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
      setRecentMeals(prev => {
        const filtered = prev.filter(m => m.name.toLowerCase() !== newMeal.name.toLowerCase());
        return [newMeal, ...filtered].slice(0, 20);
      });
      setMealInput("");
    } catch (error) {
      console.error("Failed to parse meal", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze meal. Try again."
      });
    } finally {
      setIsParsing(false);
    }
  };

  const logExistingMeal = (meal: LoggedMeal) => {
    if (credits <= 0) {
      toast({
        variant: "destructive",
        title: "No Credits Left",
        description: "You have reached your daily limit."
      });
      return;
    }
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

  if (showMicroAnalysis) return <MicroAnalysisView allHistory={allHistory} loggedMeals={loggedMeals} goalData={goalData} onBack={() => setShowMicroAnalysis(false)} />;

  if (showMacroAnalysis) {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setShowMacroAnalysis(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Macro Analysis</h1>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1 rounded-2xl shadow-inner border border-muted/20">
            <TabsTrigger value="weekly" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Monthly</TabsTrigger>
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
      fiber: acc.fiber + meal.fiber,
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
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
      vitaminA: 0, omega3: 0, vitaminC: 0, zinc: 0, selenium: 0,
      magnesium: 0, vitaminD: 0, potassium: 0, iron: 0, calcium: 0
    });

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
                <p className="text-10px font-black text-primary">{ratios.p}:{ratios.c}:{ratios.f}</p>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/20">
                <div style={{ width: `${Math.min(100, (pKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.protein }} className="h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.min(100, (cKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.carbs }} className="h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.min(100, (fKcal / Math.max(1, totalMacroKcal)) * 100)}%`, backgroundColor: MACRO_COLORS.fat }} className="h-full transition-all duration-1000 ease-out" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {macroStatuses.map((macro, idx) => (
                <div key={idx} className="bg-muted/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-muted/10 shadow-sm transition-all">
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
                <Card key={meal.id} className="border-none shadow-sm bg-card transition-all">
                  <CardContent className="p-4 relative">
                    <div className="space-y-2 pr-4">
                      <h4 className="font-bold text-sm text-foreground leading-tight">
                        {meal.name}
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
        <div className="p-3 flex items-center gap-3">
          <div className="shrink-0 p-[1.5px] rounded-full bg-[#065A54]">
            <div className="p-[1.5px] rounded-full bg-white">
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-muted/20 shadow-sm">
                <Image 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop"
                  alt="Nutrition Logo"
                  fill
                  className="object-cover"
                  data-ai-hint="healthy food avatar"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-xs font-black uppercase tracking-tight text-foreground">Meal Logging</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  CREDITS LEFT: <span className={cn("font-black", credits <= 5 ? "text-destructive" : "text-primary")}>{credits}/20</span>
                </p>
              </div>
              {Object.keys(foodCache).length > 0 && (
                <Badge variant="outline" className="h-4 border-muted/20 text-muted-foreground bg-muted/5 text-[7px] font-black uppercase gap-1 px-1.5">
                  <Zap className="w-2 h-2 fill-current" /> {Object.keys(foodCache).length} Learned
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={logTab} onValueChange={setLogTab} className="w-full">
            <div className="px-2 py-1">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/50 p-1 rounded-xl shadow-inner border border-muted/20">
                <TabsTrigger value="log" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Log
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="log" className="p-2 mt-0 space-y-3">
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
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #065A54, #08A391)' }} />
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-0.5">
              <h2 className="text-[10px] font-black uppercase tracking-tight text-foreground">DAILY HISTORY</h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">LOGGED ITEMS</p>
            </div>
            <button 
              onClick={() => setShowSummary(true)} 
              className="text-[9px] font-bold text-foreground uppercase flex items-center hover:opacity-70 transition-opacity"
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
                  <Card key={meal.id} className="border-none shadow-sm overflow-hidden bg-muted/20 transition-all group relative">
                    <CardContent className="p-0 flex min-h-[72px]">
                      <div className="w-1.5 bg-primary/40 shrink-0" />
                      <div className="w-12 bg-card/50 shrink-0 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-primary/30" />
                      </div>
                      <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0 pr-10">
                        <div className="min-w-0">
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

      <div className="grid grid-cols-2 gap-4 mx-1">
        <Card 
          onClick={() => setShowMicroAnalysis(true)}
          className="border-none bg-card overflow-hidden rounded-[1.5rem] border border-muted/10 cursor-pointer transition-all group shadow-none"
        >
          <CardContent className="p-5 flex flex-col items-start gap-3 relative">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
              <HeartPulse className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-0.5 pr-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">TRACK</p>
              <p className="text-xs font-bold text-foreground/80">Micro Analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setShowMacroAnalysis(true)}
          className="border-none bg-card overflow-hidden rounded-[1.5rem] border border-muted/10 cursor-pointer transition-all group shadow-none"
        >
          <CardContent className="p-5 flex flex-col items-start gap-3 relative">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5 pr-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">TRACK</p>
              <p className="text-xs font-bold text-foreground/80">Macro Analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MicroAnalysisView({ allHistory, loggedMeals, goalData, onBack }: { allHistory: LoggedMeal[], loggedMeals: LoggedMeal[], goalData: any, onBack: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [refDate, setRefDate] = useState(new Date());

  // Scroll to top on sub-view change
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [showDetails, period]);

  const handlePrev = () => {
    if (period === 'weekly') setRefDate(prev => subWeeks(prev, 1));
    else setRefDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    if (period === 'weekly') setRefDate(prev => addWeeks(prev, 1));
    else setRefDate(prev => addMonths(prev, 1));
  };

  const { interval, periodLabel } = useMemo(() => {
    if (period === 'weekly') {
      const start = startOfWeek(refDate, { weekStartsOn: 1 });
      const end = endOfWeek(refDate, { weekStartsOn: 1 });
      return { 
        interval: { start, end },
        periodLabel: `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      };
    } else {
      const start = startOfMonth(refDate);
      const end = endOfMonth(refDate);
      return {
        interval: { start, end },
        periodLabel: format(refDate, 'MMMM yyyy')
      };
    }
  }, [refDate, period]);

  const periodMeals = useMemo(() => {
    return allHistory.filter(m => {
      const d = new Date(m.timestamp);
      return isWithinInterval(d, interval);
    });
  }, [allHistory, interval]);

  const trackedDaysInPeriod = useMemo(() => {
    return Array.from(new Set(periodMeals.map(m => m.dateStr))).length;
  }, [periodMeals]);

  const todayTotals = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayLogs = allHistory.filter(m => m.dateStr === todayStr);
    return todayLogs.reduce((acc, meal) => ({
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
  }, [allHistory]);

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
  }, [userGender, userAge]);

  const aesthetics = [
    { id: 'vitaminA', label: "Vitamin A", sub: "Texture/Acne", val: todayTotals.vitaminA, target: targets.vitaminA, unit: "mcg", color: "#f97316" },
    { id: 'omega3', label: "Omega-3", sub: "Hydration/Inflammation", val: todayTotals.omega3, target: targets.omega3, unit: "g", color: "#0ea5e9" },
    { id: 'vitaminC', label: "Vitamin C", sub: "Collagen/Firmness", val: todayTotals.vitaminC, target: targets.vitaminC, unit: "mg", color: "#eab308" },
    { id: 'zinc', label: "Zinc", sub: "Oil Control/Healing", val: todayTotals.zinc, target: targets.zinc, unit: "mg", color: "#6366f1" },
    { id: 'selenium', label: "Selenium", sub: "UV Protection", val: todayTotals.selenium, target: targets.selenium, unit: "mcg", color: "#f43f5e" },
  ];

  const performance = [
    { id: 'magnesium', label: "Magnesium", sub: "Repair/Relaxation", val: todayTotals.magnesium, target: targets.magnesium, unit: "mg", color: "#a855f7" },
    { id: 'vitaminD', label: "Vitamin D", sub: "Power/Hormones", val: todayTotals.vitaminD, target: targets.vitaminD, unit: "mcg", color: "#f59e0b" },
    { id: 'potassium', label: "Potassium", sub: "Signaling/Pump", val: todayTotals.potassium, target: targets.potassium, unit: "mg", color: "#10b981" },
    { id: 'iron', label: "Iron", sub: "Stamina/Oxygen", val: todayTotals.iron, target: targets.iron, unit: "mg", color: "#ef4444" },
    { id: 'calcium', label: "Calcium", sub: "Contraction/Firing", val: todayTotals.calcium, target: targets.calcium, unit: "mg", color: "#64748b" },
  ];

  if (showDetails) {
    return (
      <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2 px-1">
          <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold font-headline leading-none">Detailed Analysis</h1>
          </div>
        </div>

        <Tabs defaultValue="aesthetics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1 rounded-2xl shadow-inner border border-muted/20">
            <TabsTrigger value="aesthetics" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Skin and Heal</TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Gym and Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="aesthetics" className="space-y-4 mt-4">
            <div className="flex items-center justify-between bg-card p-3 rounded-2xl shadow-sm border border-muted/20 mx-1">
              <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full">
                <ChevronLeft className="w-5 h-5 text-primary" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">
                  {periodLabel}
                </span>
                <div className="flex gap-2 mt-1 bg-muted/30 p-0.5 rounded-lg">
                   <button onClick={() => setPeriod('weekly')} className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-md transition-all", period === 'weekly' ? "bg-[#fcfcfc] text-black shadow-sm" : "text-muted-foreground")}>Week</button>
                   <button onClick={() => setPeriod('monthly')} className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-md transition-all", period === 'monthly' ? "bg-[#fcfcfc] text-black shadow-sm" : "text-muted-foreground")}>Month</button>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full">
                <ChevronRight className="w-5 h-5 text-primary" />
              </Button>
            </div>

            <WeeklyMicroTable 
              allHistory={allHistory} 
              targets={targets} 
              micros={aesthetics} 
              title="Skin and Heal" 
              refDate={refDate}
              period={period}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <div className="flex items-center justify-between bg-card p-3 rounded-2xl shadow-sm border border-muted/20 mx-1">
              <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full">
                <ChevronLeft className="w-5 h-5 text-primary" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">
                  {periodLabel}
                </span>
                <div className="flex gap-2 mt-1 bg-muted/30 p-0.5 rounded-lg">
                   <button onClick={() => setPeriod('weekly')} className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-md transition-all", period === 'weekly' ? "bg-[#fcfcfc] text-black shadow-sm" : "text-muted-foreground")}>Week</button>
                   <button onClick={() => setPeriod('monthly')} className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-md transition-all", period === 'monthly' ? "bg-[#fcfcfc] text-black shadow-sm" : "text-muted-foreground")}>Month</button>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full">
                <ChevronRight className="w-5 h-5 text-primary" />
              </Button>
            </div>

            <WeeklyMicroTable 
              allHistory={allHistory} 
              targets={targets} 
              micros={performance} 
              title="Gym and Recovery" 
              refDate={refDate}
              period={period}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold font-headline leading-none">Micro Analysis</h1>
        </div>
      </div>

      <Tabs defaultValue="aesthetics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1 rounded-2xl shadow-inner border border-muted/20">
          <TabsTrigger value="aesthetics" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Skin and Heal</TabsTrigger>
          <TabsTrigger value="performance" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Gym and Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="aesthetics" className="space-y-4 mt-4">
          <div className="grid gap-2 px-1">
            {aesthetics.map((item, idx) => (
              <MicroCard key={idx} {...item} />
            ))}
          </div>
          <div className="px-1 mt-4">
            <Button 
              onClick={() => setShowDetails(true)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
            >
              Check Detailed Analysis <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-4">
          <div className="grid gap-2 px-1">
            {performance.map((item, idx) => (
              <MicroCard key={idx} {...item} />
            ))}
          </div>
          <div className="px-1 mt-4">
            <Button 
              onClick={() => setShowDetails(true)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
            >
              Check Detailed Analysis <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MicroCard({ label, sub, val, target, unit, color }: any) {
  const percent = Math.min(100, Math.round((val / target) * 100));
  
  return (
    <Card className="border-none bg-card overflow-hidden rounded-2xl border border-muted/10 group transition-all">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: color, opacity: 0.3 }} />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-baseline">
            <h4 className="font-black text-xs text-foreground uppercase tracking-tight">{label}</h4>
            <span className={cn("text-[9px] font-black uppercase tracking-tighter text-foreground")}>
              {percent}%
            </span>
          </div>
          <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">{sub}</p>
          <div className="pt-2 space-y-1">
            <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden flex items-center relative">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]")} 
                style={{ width: `${percent}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-foreground uppercase tracking-tighter">
              <span>{val.toFixed(val < 1 && val > 0 ? 2 : 0)} {unit}</span>
              <span>GOAL {target} {unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyMicroTable({ allHistory, targets, micros, title, refDate, period }: { allHistory: LoggedMeal[], targets: any, micros: any[], title: string, refDate: Date, period: 'weekly' | 'monthly' }) {
  const daysToShow = useMemo(() => {
    if (period === 'weekly') {
      const start = startOfWeek(refDate, { weekStartsOn: 1 });
      return [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const d = addDays(start, offset);
        return {
          dateStr: format(d, 'yyyy-MM-dd'),
          dayName: format(d, 'EEE')
        };
      });
    } else {
      const start = startOfMonth(refDate);
      const end = endOfMonth(refDate);
      return eachDayOfInterval({ start, end }).map(d => ({
        dateStr: format(d, 'yyyy-MM-dd'),
        dayName: format(d, 'd')
      }));
    }
  }, [refDate, period]);

  const trackedDaysCount = useMemo(() => {
    const datesWithLogs = new Set(allHistory.map(m => m.dateStr));
    return daysToShow.filter(day => datesWithLogs.has(day.dateStr)).length;
  }, [allHistory, daysToShow]);

  const tableData = useMemo(() => {
    return micros.map(m => {
      const dailyValues = daysToShow.map(day => {
        const dayMeals = allHistory.filter(meal => meal.dateStr === day.dateStr);
        const sum = dayMeals.reduce((acc, meal) => acc + ((meal as any)[m.id] || 0), 0);
        return sum;
      });

      const totalValue = dailyValues.reduce((a, b) => a + b, 0);
      const avg = trackedDaysCount > 0 ? totalValue / trackedDaysCount : 0;
      const target = targets[m.id];
      const percentMet = Math.round((avg / target) * 100);

      return {
        nutrient: m.label,
        unit: m.unit,
        target,
        daily: dailyValues,
        avg,
        percentMet,
        color: m.color
      };
    });
  }, [allHistory, daysToShow, micros, targets, trackedDaysCount]);

  return (
    <Card className="border-none shadow-md bg-card rounded-3xl p-6 mx-1 mt-4 border border-muted/10 overflow-hidden relative">
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{period === 'weekly' ? 'WEEKLY BREAKDOWN' : 'MONTHLY BREAKDOWN'}</p>
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> {title}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary leading-none">{period.toUpperCase()}</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1">LOGGED DAYS ONLY</p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6 swipe-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted/10">
                <th className="py-2 pr-4 text-[8px] font-black uppercase text-muted-foreground tracking-widest whitespace-nowrap">Nutrient</th>
                {daysToShow.map((day, i) => (
                  <th key={i} className="py-2 px-3 text-[8px] font-black uppercase text-muted-foreground text-center">{day.dayName}</th>
                ))}
                <th className="py-2 px-3 text-[8px] font-black uppercase text-primary text-center bg-primary/5">Avg</th>
                <th className="py-2 pl-4 text-[8px] font-black uppercase text-foreground text-right">% Met</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {tableData.map((row, idx) => (
                <tr key={idx} className="transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-3 rounded-full opacity-40" style={{ backgroundColor: row.color }} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-foreground/80 uppercase tracking-tighter truncate">{row.nutrient}</p>
                        <p className="text-[7px] font-bold text-muted-foreground uppercase leading-none">{row.unit}</p>
                      </div>
                    </div>
                  </td>
                  {row.daily.map((val, i) => (
                    <td key={i} className="py-3 px-3 text-[10px] font-bold text-muted-foreground/60 text-center font-mono">
                      {val > 0 ? val.toFixed(val < 1 ? 2 : 0) : '—'}
                    </td>
                  ))}
                  <td className="py-3 px-3 text-[10px] font-black text-primary text-center bg-primary/5 font-mono">
                    {row.avg.toFixed(row.avg < 1 ? 2 : 0)}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span className={cn(
                      "text-[10px] font-black font-mono",
                      row.percentMet >= 100 ? "text-green-600" : "text-foreground/70"
                    )}>
                      {row.percentMet}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

function TrendsContent({ period, history, goalData }: { period: 'weekly' | 'monthly', history: LoggedMeal[], goalData: any }) {
  const [refDate, setRefDate] = useState(new Date());

  // Scroll to top on period change
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [refDate]);

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
    const targetP = goalData?.protein || 150;
    const targetC = goalData?.carbs || 250;
    const targetF = goalData?.fats || 70;
    const targetFI = goalData?.fiber || 30;

    const netSurplusDeficit = avgCalories - targetCal;

    const goalAchievements = {
      protein: Math.min(100, Math.round(((totalProtein / daysWithLogs.length) / targetP) * 100)),
      carbs: Math.min(100, Math.round(((totalCarbs / daysWithLogs.length) / targetC) * 100)),
      fat: Math.min(100, Math.round(((totalFat / daysWithLogs.length) / targetF) * 100)),
      fiber: Math.min(100, Math.round(((totalFiber / daysWithLogs.length) / targetFI) * 100))
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
        <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full">
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
        <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full">
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
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Avg ({stats.daysTracked} Days)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black">{stats.avgCalories}</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Kcal</span>
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-card p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Daily Balance</p>
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
