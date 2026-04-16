"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  User, 
  Loader2, 
  Activity,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Trophy,
  Timer
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { format, differenceInDays, parseISO } from 'date-fns';
import { EXERCISES_DATA } from '@/lib/exercises-data';
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface NutrientItem {
  label: string;
  val: number;
  target: number;
  unit: string;
  color: string;
}

interface Message {
  role: 'user' | 'system';
  text: string;
  type?: string;
  reportSubtype?: 'overall' | 'standard';
  chartData?: any[];
  nutrientData?: NutrientItem[];
  detailData?: NutrientItem[]; // Used for detailed macro bars/tables
  macroPieData?: any[];
  microTableData?: { label: string; pct: number }[];
}

interface GuideViewProps {
  goalData: any;
  loggedMeals: any[];
  hydrationAmount: number;
  weightHistory: any[];
  onBack: () => void;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

export function GuideView({ goalData, loggedMeals, hydrationAmount, weightHistory, onBack }: GuideViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: "Hello! I'm your Personal Assistant. Pick an analysis below to see how you're doing today." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const coachImage = PlaceHolderImages.find(img => img.id === 'gym-coach');

  // Unified Scroll Reset for Guide View interactions
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isLoading]);

  const totals = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
      fiber: acc.fiber + (meal.fiber || 0),
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
  }, [loggedMeals]);

  const microTargets = useMemo(() => {
    const userGender = goalData?.gender || 'male';
    const userAge = parseInt(goalData?.age) || 25;
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
  }, [goalData]);

  const generateReport = (type: string) => {
    const targetCal = goalData?.finalCalories || 2200;
    const targetP = goalData?.protein || 150;
    const targetC = goalData?.carbs || 250;
    const targetF = goalData?.fats || 70;
    const targetFI = goalData?.fiber || 30;
    const targetHydration = goalData?.hydrationTargetLiters || 3.0;

    const hMarker = "■ ";

    if (type === 'overall') {
      const pKcal = totals.protein * 4;
      const cKcal = totals.carbs * 4;
      const fKcal = totals.fat * 9;
      const totalKcal = Math.max(1, pKcal + cKcal + fKcal);
      
      const pRatio = Math.round((pKcal / totalKcal) * 100);
      const cRatio = Math.round((cKcal / totalKcal) * 100);
      const fRatio = 100 - pRatio - cRatio;

      const macroPieData = [
        { name: 'Protein', value: Math.max(0.1, pKcal), color: MACRO_COLORS.protein },
        { name: 'Carbs', value: Math.max(0.1, cKcal), color: MACRO_COLORS.carbs },
        { name: 'Fat', value: Math.max(0.1, fKcal), color: MACRO_COLORS.fat },
      ];

      const microTableData = [
        { label: 'Vitamin A', pct: Math.round((totals.vitaminA / microTargets.vitaminA) * 100) },
        { label: 'Omega-3', pct: Math.round((totals.omega3 / microTargets.omega3) * 100) },
        { label: 'Vitamin C', pct: Math.round((totals.vitaminC / microTargets.vitaminC) * 100) },
        { label: 'Zinc', pct: Math.round((totals.zinc / microTargets.zinc) * 100) },
        { label: 'Selenium', pct: Math.round((totals.selenium / microTargets.selenium) * 100) },
        { label: 'Magnesium', pct: Math.round((totals.magnesium / microTargets.magnesium) * 100) },
        { label: 'Vitamin D', pct: Math.round((totals.vitaminD / microTargets.vitaminD) * 100) },
        { label: 'Potassium', pct: Math.round((totals.potassium / microTargets.potassium) * 100) },
        { label: 'Iron', pct: Math.round((totals.iron / microTargets.iron) * 100) },
        { label: 'Calcium', pct: Math.round((totals.calcium / microTargets.calcium) * 100) },
      ];

      return {
        text: `${hMarker}FULL NUTRITION ANALYSIS\n\nHere is a look at your eating today. Your diet ratio is ${pRatio}P:${cRatio}C:${fRatio}F.`,
        type: 'nutrition',
        reportSubtype: 'overall',
        macroPieData,
        microTableData,
        nutrientData: [
          { label: 'Calories', val: totals.calories, target: targetCal, unit: 'kcal', color: '#f59e0b' },
          { label: 'Hydration', val: hydrationAmount / 1000, target: targetHydration, unit: 'L', color: '#0ea5e9' },
        ],
        detailData: [
          { label: 'Protein', val: totals.protein, target: targetP, unit: 'g', color: MACRO_COLORS.protein },
          { label: 'Carbs', val: totals.carbs, target: targetC, unit: 'g', color: MACRO_COLORS.carbs },
          { label: 'Fat', val: totals.fat, target: targetF, unit: 'g', color: MACRO_COLORS.fat },
          { label: 'Fiber', val: totals.fiber, target: targetFI, unit: 'g', color: MACRO_COLORS.fiber },
        ]
      };
    }

    if (type === 'macros') {
      const nutrientData: NutrientItem[] = [
        { label: 'Protein', val: totals.protein, target: targetP, unit: 'g', color: MACRO_COLORS.protein },
        { label: 'Carbs', val: totals.carbs, target: targetC, unit: 'g', color: MACRO_COLORS.carbs },
        { label: 'Fat', val: totals.fat, target: targetF, unit: 'g', color: MACRO_COLORS.fat },
        { label: 'Fiber', val: totals.fiber, target: targetFI, unit: 'g', color: MACRO_COLORS.fiber },
      ];

      return {
        text: `${hMarker}MACRO & FIBER ANALYSIS\n\nCheck your protein, carbs, fat, and fiber for the day.`,
        type: 'nutrition',
        reportSubtype: 'standard',
        nutrientData
      };
    }

    if (type === 'micros') {
      const nutrientData: NutrientItem[] = [
        { label: "Vitamin A", val: totals.vitaminA, target: microTargets.vitaminA, unit: "mcg", color: "#f97316" },
        { label: "Omega-3", val: totals.omega3, target: microTargets.omega3, unit: "g", color: "#0ea5e9" },
        { label: "Vitamin C", val: totals.vitaminC, target: microTargets.vitaminC, unit: "mg", color: "#eab308" },
        { label: "Zinc", val: totals.zinc, target: microTargets.zinc, unit: "mg", color: "#6366f1" },
        { label: "Selenium", val: totals.selenium, target: microTargets.selenium, unit: "mcg", color: "#f43f5e" },
        { label: "Magnesium", val: totals.magnesium, target: microTargets.magnesium, unit: "mg", color: "#a855f7" },
        { label: "Vitamin D", val: totals.vitaminD, target: microTargets.vitaminD, unit: "mcg", color: "#f59e0b" },
        { label: "Potassium", val: totals.potassium, target: microTargets.potassium, unit: "mg", color: "#10b981" },
        { label: "Iron", val: totals.iron, target: microTargets.iron, unit: "mg", color: "#ef4444" },
        { label: "Calcium", val: totals.calcium, target: microTargets.calcium, unit: "mg", color: "#64748b" },
      ];

      return {
        text: `${hMarker}FULL MICRO ANALYSIS\n\nCheck your vitamins and minerals for skin and performance.`,
        type: 'nutrition',
        reportSubtype: 'standard',
        nutrientData
      };
    }

    if (type === 'weight') {
      const current = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : (goalData?.weight ? parseFloat(goalData.weight) : 0);
      const start = goalData?.weight ? parseFloat(goalData.weight) : 0;
      const target = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
      const diff = Math.abs(current - target).toFixed(1);
      
      let historyNote = "";
      if (weightHistory.length > 1) {
        const prevEntry = weightHistory[weightHistory.length - 2];
        const days = differenceInDays(new Date(), new Date(prevEntry.date));
        const dayText = days === 0 ? "Earlier today" : days === 1 ? "Yesterday" : `${days} days ago`;
        historyNote = `• History: ${dayText} you were ${prevEntry.weight} kg\n`;
      }

      const objective = goalData?.objective || 'maintenance';
      let progress = 0;
      if (start !== target) {
        if (objective === 'loss') progress = ((start - current) / (start - target)) * 100;
        else progress = ((current - start) / (target - start)) * 100;
      }

      const chartData = weightHistory.map(h => ({
        date: format(new Date(h.date), 'MMM d'),
        weight: h.weight
      }));

      return {
        text: `${hMarker}WEIGHT ANALYSIS\n\n• Current: ${current.toFixed(1)} kg\n${historyNote}• Start: ${start.toFixed(1)} kg\n• Target: ${target.toFixed(1)} kg\n\n${hMarker}YOUR PROGRESS\n• Total Progress: ${Math.round(Math.max(0, progress))}%\n• Remaining: ${diff} kg\n• Goal: ${objective.charAt(0).toUpperCase() + objective.slice(1)}`,
        type: 'weight',
        chartData
      };
    }

    if (type === 'workout') {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const savedLogs = localStorage.getItem('pulseflow_workout_logs');
      const logs = savedLogs ? JSON.parse(savedLogs) : null;
      
      let totalVolume = 0;
      const exerciseDetails: any[] = [];
      const musclesSet = new Set<string>();
      
      if (logs?.date === todayStr) {
        Object.entries(logs.data).forEach(([exName, sets]: [string, any]) => {
          const exData = EXERCISES_DATA.find(e => e.name === exName);
          if (exData) musclesSet.add(exData.muscle);
          
          let exVolume = 0;
          const setBreakdown: string[] = [];
          
          sets.forEach((s: any, idx: number) => {
            if (s.type === 'strength') {
              const weight = parseFloat(s.weight) || 0;
              const reps = parseFloat(s.reps) || 0;
              const vol = weight * reps;
              exVolume += vol;
              totalVolume += vol;
              setBreakdown.push(`    Set ${idx + 1}: ${weight}kg x ${reps} (${vol.toLocaleString()} kg)`);
            } else if (s.type === 'time') {
              setBreakdown.push(`    Set ${idx + 1}: ${formatExerciseTime(s.time)}`);
            }
          });
          
          exerciseDetails.push({
            name: exName,
            sets: sets.length,
            volume: exVolume,
            breakdown: setBreakdown
          });
        });
      }

      const muscleList = Array.from(musclesSet).map(m => `• ${m}`).join('\n');
      const exerciseList = exerciseDetails.map(d => {
        const header = `• ${d.name}: ${d.sets} sets (Total: ${d.volume.toLocaleString()} kg)`;
        const sets = d.breakdown.join('\n');
        return `${header}\n${sets}`;
      }).join('\n\n');

      const chartData = exerciseDetails.map((d, i) => ({
        index: i + 1,
        volume: d.volume,
        name: d.name
      })).filter(d => d.volume > 0);

      return {
        text: `${hMarker}WORKOUT ANALYSIS\n\n• Status: ${exerciseDetails.length > 0 ? 'Active' : 'No logs for today'}\n• Total Volume: ${Math.round(totalVolume).toLocaleString()} kg\n• Exercises: ${exerciseDetails.length}\n\n${hMarker}MUSCLES TRAINED\n${muscleList || '• None logged yet.'}\n\n${hMarker}EXERCISES DONE\n${exerciseList || '• No logs today.'}`,
        type: 'workout',
        chartData
      };
    }

    return { text: "Error: Could not find analysis." };
  };

  const handleQuery = (label: string, value: string) => {
    if (isLoading) return;

    const userMsg: Message = { role: 'user', text: label };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const report = generateReport(value);
      setMessages(prev => [...prev, { 
        role: 'system', 
        text: report.text, 
        type: report.type,
        reportSubtype: report.reportSubtype as any,
        chartData: report.chartData,
        nutrientData: report.nutrientData,
        detailData: (report as any).detailData,
        macroPieData: report.macroPieData,
        microTableData: report.microTableData
      }]);
      setIsLoading(false);
    }, 800);
  };

  const formatExerciseTime = (seconds: any) => {
    const total = parseInt(seconds) || 0;
    const m = Math.floor(total / 60);
    const s = total % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const options = [
    { label: "Full Nutrition Analysis", value: 'overall' },
    { label: "Macro & Fiber Analysis", value: 'macros' },
    { label: "Full Micro Analysis", value: 'micros' },
    { label: "Weight Progress", value: 'weight' },
    { label: "Workout Progress", value: 'workout' }
  ];

  return (
    <div data-view="guide" className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 pb-24 font-sans">
      {/* Compact Header */}
      <div className="relative overflow-hidden pt-4 pb-4 px-4 border-b border-white/10 shrink-0">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={coachImage?.imageUrl || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop"} 
            alt="Coach Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            data-ai-hint="fitness coach"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #065A54, #08A391)', opacity: 0.9 }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full bg-white/10 hover:bg-white/20 w-9 h-9 shrink-0 text-white border border-white/10 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black uppercase tracking-tight text-white">Personal Analyzer</h1>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[6px] font-black text-white uppercase tracking-widest leading-none">Online</span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em] mt-0.5">ANALYSIS ASSISTANT</p>
          </div>
        </div>
      </div>

      {/* Chat Area - Optimized for screen usage */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 space-y-3 py-4 swipe-container"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex flex-col w-full animate-in fade-in slide-in-from-bottom-2",
              msg.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[95%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-card border border-muted/20 rounded-tl-none text-foreground/90"
            )}>
              <div className="flex items-center gap-2 mb-2 opacity-40">
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 ml-auto order-2" />
                ) : (
                  <Activity className="w-3 h-3 text-primary" />
                )}
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              <p className="font-medium whitespace-pre-wrap tracking-tight">{msg.text}</p>
              
              {msg.type === 'nutrition' && (
                <div className="mt-4 space-y-6">
                  {msg.reportSubtype === 'overall' ? (
                    <>
                      {/* Fundamental Summary Bars (Calories & Hydration) */}
                      <div className="space-y-4">
                        {msg.nutrientData?.map((item, idx) => {
                          const percent = Math.min(100, Math.round((item.val / item.target) * 100));
                          const diff = item.target - item.val;
                          const isOver = diff < 0;
                          
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="text-[11px] font-black uppercase tracking-tight text-foreground/80">{item.label}</span>
                                <span className="text-[10px] font-bold text-foreground/60">{Math.round(item.val)} / {item.target} {item.unit}</span>
                              </div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
                                {Math.abs(Math.round(diff))} {item.unit} {isOver ? 'over' : 'left'}
                              </div>
                              <div className="text-[9px] font-black text-primary uppercase mt-0.5">
                                {percent}% Done
                              </div>
                              <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden mt-1">
                                <div 
                                  className="h-full transition-all duration-700 ease-out" 
                                  style={{ width: `${percent}%`, backgroundColor: item.color }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Macro Pie Chart */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">MACRO DISTRIBUTION</p>
                        <div className="h-40 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={msg.macroPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {msg.macroPieData?.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  borderRadius: '8px', 
                                  fontSize: '10px', 
                                  fontWeight: 'bold', 
                                  border: '1px solid hsl(var(--border))', 
                                  backgroundColor: 'hsl(var(--card))',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(val: number) => [`${Math.round(val)} kcal`, 'Energy']}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4">
                          {msg.macroPieData?.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-[8px] font-black text-muted-foreground uppercase">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Macro Performance Audit (Excel Style) */}
                      <div className="space-y-2 pt-2 border-t border-muted/5">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">MACRO DETAILS</p>
                        <div className="border border-muted/20 rounded-xl overflow-hidden shadow-inner">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/30 border-b border-muted/20">
                              <tr>
                                <th className="p-2 text-[8px] font-black uppercase text-muted-foreground border-r border-muted/20">MACRO</th>
                                <th className="p-2 text-[8px] font-black uppercase text-primary text-right">% MET</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.detailData?.map((row, idx) => (
                                <tr key={idx} className={cn("border-b border-muted/10 last:border-0", idx % 2 === 0 ? "bg-card" : "bg-muted/5")}>
                                  <td className="p-2 text-[10px] font-bold text-foreground/70 uppercase border-r border-muted/20">{row.label}</td>
                                  <td className={cn(
                                    "p-2 text-[10px] font-black text-right font-mono",
                                    Math.round((row.val / row.target) * 100) >= 100 ? "text-green-600" : "text-primary"
                                  )}>
                                    {Math.round((row.val / row.target) * 100)}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Technical Micro Audit (Excel Style) */}
                      <div className="space-y-2 pt-2">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">MICRO DETAILS</p>
                        <div className="border border-muted/20 rounded-xl overflow-hidden shadow-inner">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/30 border-b border-muted/20">
                              <tr>
                                <th className="p-2 text-[8px] font-black uppercase text-muted-foreground border-r border-muted/20">NUTRIENT</th>
                                <th className="p-2 text-[8px] font-black uppercase text-primary text-right">% GOAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.microTableData?.map((row, idx) => (
                                <tr key={idx} className={cn("border-b border-muted/10 last:border-0", idx % 2 === 0 ? "bg-card" : "bg-muted/5")}>
                                  <td className="p-2 text-[10px] font-bold text-foreground/70 uppercase border-r border-muted/20">{row.label}</td>
                                  <td className={cn(
                                    "p-2 text-[10px] font-black text-right font-mono",
                                    row.pct >= 80 ? "text-green-600" : row.pct >= 50 ? "text-amber-500" : "text-muted-foreground"
                                  )}>
                                    {row.pct}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    msg.nutrientData?.map((item, idx) => {
                      const percent = Math.min(100, Math.round((item.val / item.target) * 100));
                      const diff = item.target - item.val;
                      const isOver = diff < 0;
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-[11px] font-black uppercase tracking-tight text-foreground/80 leading-none">{item.label}</h4>
                            <span className="text-[10px] font-bold text-foreground/60">{Math.round(item.val)} / {item.target} {item.unit}</span>
                          </div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
                            {Math.abs(Math.round(diff))} {item.unit} {isOver ? 'over' : 'left'}
                          </p>
                          <p className="text-[9px] font-black text-primary uppercase leading-none">
                            {percent}% Done
                          </p>
                          <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full transition-all duration-700 ease-out" 
                              style={{ 
                                width: `${percent}%`, 
                                backgroundColor: item.color 
                              }} 
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {msg.type === 'weight' && msg.chartData && msg.chartData.length > 1 && (
                <div className="mt-2 pt-2 border-t border-muted/10 h-40 w-full">
                  <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">WEIGHT TREND (KG)</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={msg.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        fontSize={8} 
                        fontWeight={700} 
                        tick={{ fill: 'currentColor', opacity: 0.5 }} 
                        dy={2} 
                        ticks={Array.from(new Set([msg.chartData[0].date, msg.chartData[msg.chartData.length - 1].date]))}
                      />
                      <YAxis 
                        fontSize={8} 
                        fontWeight={700} 
                        tick={{ fill: 'currentColor', opacity: 0.5 }} 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          border: '1px solid hsl(var(--border))', 
                          backgroundColor: 'hsl(var(--card))',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {msg.type === 'workout' && msg.chartData && msg.chartData.length > 1 && (
                <div className="mt-2 pt-2 border-t border-muted/10 w-full">
                  <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 text-left">
                    VOLUME TREND (KG)
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={msg.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                        <XAxis 
                          dataKey="index" 
                          fontSize={8} 
                          fontWeight={700} 
                          tick={{ fill: 'currentColor', opacity: 0.5 }} 
                          dy={2} 
                          ticks={Array.from(new Set([msg.chartData[0].index, msg.chartData[msg.chartData.length - 1].index]))}
                        />
                        <YAxis 
                          fontSize={8} 
                          fontWeight={700} 
                          tick={{ fill: 'currentColor', opacity: 0.5 }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '8px', 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            border: '1px solid hsl(var(--border))', 
                            backgroundColor: 'hsl(var(--card))',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                          formatter={(val: number) => [`${val.toLocaleString()} kg`, "Volume"]}
                          labelFormatter={(index: any) => {
                            const item = msg.chartData?.find(d => d.index === index);
                            return item ? `${item.name} (Ex ${index})` : `Exercise ${index}`;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2.5} 
                          dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="text-[8px] font-black text-muted-foreground tracking-widest">
                      EXERCISE COUNT (Ex)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-card border border-muted/20 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Analyzing your data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Options Menu - Compact & Full Width */}
      <div className="px-1 mt-auto space-y-2 mb-4">
        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-3">Select Analysis</p>
        <Card className="border-none shadow-md bg-card rounded-2xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            {options.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => handleQuery(opt.label, opt.value)}
                disabled={isLoading}
                className={cn(
                  "w-full p-3 flex items-center justify-between text-left transition-all disabled:opacity-50",
                  i !== options.length - 1 && "border-b border-muted/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-muted/20 rounded-full" />
                  <span className="text-[13px] font-semibold text-foreground/80">{opt.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}