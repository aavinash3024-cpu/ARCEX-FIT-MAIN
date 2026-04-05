
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Sparkles, 
  User, 
  Loader2, 
  Activity,
  ArrowRight
} from "lucide-react";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'system';
  text: string;
}

interface GuideViewProps {
  goalData: any;
  loggedMeals: any[];
  hydrationAmount: number;
  weightHistory: any[];
  onBack: () => void;
}

export function GuideView({ goalData, loggedMeals, hydrationAmount, weightHistory, onBack }: GuideViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: "Hello! I'm your Personal Analyzer. Select one of the options below to get a detailed report on your progress today." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

    if (type === 'overall') {
      const accuracy = Math.round((totals.calories / targetCal) * 100);
      const hydrationLiters = hydrationAmount / 1000;
      
      const micros = [
        { label: 'Vit A', val: totals.vitaminA, target: microTargets.vitaminA, unit: 'mcg' },
        { label: 'Omega-3', val: totals.omega3, target: microTargets.omega3, unit: 'g' },
        { label: 'Vit C', val: totals.vitaminC, target: microTargets.vitaminC, unit: 'mg' },
        { label: 'Zinc', val: totals.zinc, target: microTargets.zinc, unit: 'mg' },
        { label: 'Selenium', val: totals.selenium, target: microTargets.selenium, unit: 'mcg' },
        { label: 'Mag', val: totals.magnesium, target: microTargets.magnesium, unit: 'mg' },
        { label: 'Vit D', val: totals.vitaminD, target: microTargets.vitaminD, unit: 'mcg' },
        { label: 'Potassium', val: totals.potassium, target: microTargets.potassium, unit: 'mg' },
        { label: 'Iron', val: totals.iron, target: microTargets.iron, unit: 'mg' },
        { label: 'Calcium', val: totals.calcium, target: microTargets.calcium, unit: 'mg' },
      ];

      const microList = micros.map(m => `• ${m.label}: ${m.val.toFixed(m.val < 1 && m.val > 0 ? 2 : 0)}${m.unit} / ${m.target}${m.unit}`).join('\n');

      return `FULL NUTRITION ANALYSIS

• Calories: ${Math.round(totals.calories)} / ${targetCal} kcal (${accuracy}%)
• Hydration: ${hydrationLiters.toFixed(1)} / ${targetHydration.toFixed(1)} L

MACRO BREAKDOWN
• Protein: ${Math.round(totals.protein)}g / ${targetP}g
• Carbs: ${Math.round(totals.carbs)}g / ${targetC}g
• Fat: ${Math.round(totals.fat)}g / ${targetF}g
• Fiber: ${Math.round(totals.fiber)}g / ${targetFI}g

MICRO ANALYSIS
${microList}

SUMMARY
${totals.calories < targetCal ? "You still have a calorie buffer. Focus on lean protein." : "You've reached your intake limit. Focus on water and recovery."}`;
    }

    if (type === 'macros') {
      const pDiff = totals.protein - targetP;
      const cDiff = totals.carbs - targetC;
      const fDiff = totals.fat - targetF;
      const fiDiff = totals.fiber - targetFI;

      return `MACRO & FIBER ANALYSIS

• Protein: ${Math.round(totals.protein)}g / ${targetP}g (${pDiff > 0 ? '+' : ''}${Math.round(pDiff)}g)
• Carbs: ${Math.round(totals.carbs)}g / ${targetC}g (${cDiff > 0 ? '+' : ''}${Math.round(cDiff)}g)
• Fat: ${Math.round(totals.fat)}g / ${targetF}g (${fDiff > 0 ? '+' : ''}${Math.round(fDiff)}g)
• Fiber: ${Math.round(totals.fiber)}g / ${targetFI}g (${fiDiff > 0 ? '+' : ''}${Math.round(fiDiff)}g)`;
    }

    if (type === 'micros') {
      const micros = [
        { label: 'Vitamin A', val: totals.vitaminA, target: microTargets.vitaminA, unit: 'mcg' },
        { label: 'Omega-3', val: totals.omega3, target: microTargets.omega3, unit: 'g' },
        { label: 'Vitamin C', val: totals.vitaminC, target: microTargets.vitaminC, unit: 'mg' },
        { label: 'Zinc', val: totals.zinc, target: microTargets.zinc, unit: 'mg' },
        { label: 'Selenium', val: totals.selenium, target: microTargets.selenium, unit: 'mcg' },
        { label: 'Magnesium', val: totals.magnesium, target: microTargets.magnesium, unit: 'mg' },
        { label: 'Vitamin D', val: totals.vitaminD, target: microTargets.vitaminD, unit: 'mcg' },
        { label: 'Potassium', val: totals.potassium, target: microTargets.potassium, unit: 'mg' },
        { label: 'Iron', val: totals.iron, target: microTargets.iron, unit: 'mg' },
        { label: 'Calcium', val: totals.calcium, target: microTargets.calcium, unit: 'mg' },
      ];

      const report = micros.map(m => `• ${m.label}: ${m.val.toFixed(m.val < 1 && m.val > 0 ? 2 : 0)}${m.unit} / ${m.target}${m.unit}`).join('\n');

      return `FULL MICRO ANALYSIS

${report}`;
    }

    if (type === 'weight') {
      const current = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : (goalData?.weight ? parseFloat(goalData.weight) : 0);
      const start = goalData?.weight ? parseFloat(goalData.weight) : 0;
      const target = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
      const diff = Math.abs(current - target).toFixed(1);
      
      const objective = goalData?.objective || 'maintenance';
      let progress = 0;
      if (start !== target) {
        if (objective === 'loss') progress = ((start - current) / (start - target)) * 100;
        else progress = ((current - start) / (target - start)) * 100;
      }

      return `WEIGHT PROGRESS REPORT

• Current: ${current.toFixed(1)} kg
• Start: ${start.toFixed(1)} kg
• Target: ${target.toFixed(1)} kg

• Total Progress: ${Math.round(Math.max(0, progress))}%
• Remaining: ${diff} kg
• Goal: ${objective.charAt(0).toUpperCase() + objective.slice(1)}`;
    }

    if (type === 'workout') {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const savedLogs = localStorage.getItem('pulseflow_workout_logs');
      const logs = savedLogs ? JSON.parse(savedLogs) : null;
      
      let totalVolume = 0;
      const exercises = logs?.date === todayStr ? Object.keys(logs.data) : [];
      
      if (logs?.date === todayStr) {
        Object.values(logs.data).forEach((sets: any) => {
          sets.forEach((s: any) => {
            if (s.type === 'strength') {
              totalVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
            }
          });
        });
      }

      return `WORKOUT PROGRESS REPORT

• Status: ${exercises.length > 0 ? 'Active' : 'No logs today'}
• Total Volume: ${Math.round(totalVolume).toLocaleString()} kg
• Exercises: ${exercises.length}

MUSCLES TARGETED
${exercises.length > 0 ? exercises.map(e => `• ${e}`).join('\n') : '• No movements logged yet today.'}`;
    }

    return "Error: Module undefined.";
  };

  const handleQuery = (label: string, value: string) => {
    if (isLoading) return;

    const userMsg: Message = { role: 'user', text: label };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const report = generateReport(value);
      setMessages(prev => [...prev, { role: 'system', text: report }]);
      setIsLoading(false);
    }, 800);
  };

  const options = [
    { label: "Full Nutrition Analysis", value: 'overall' },
    { label: "Macro & Fiber Analysis", value: 'macros' },
    { label: "Full Micro Analysis", value: 'micros' },
    { label: "Weight Progress", value: 'weight' },
    { label: "Workout Progress", value: 'workout' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 py-6 px-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 border-b border-muted/10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/40 w-10 h-10 shrink-0">
          <ChevronLeft className="w-5 h-5 text-foreground/70" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold uppercase tracking-tight text-foreground/90">Personal Analyzer</h1>
            <div className="bg-muted/50 px-1.5 py-0.5 rounded text-[7px] font-black text-muted-foreground uppercase tracking-widest leading-none">Online</div>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-0.5">Professional Report Assistant</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-muted-foreground/40" />
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 space-y-6 py-6 swipe-container"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-2",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[90%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
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
                  {msg.role === 'user' ? 'You' : 'Analysis Report'}
                </span>
              </div>
              <p className="font-medium whitespace-pre-wrap tracking-tight">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-card border border-muted/20 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Analyzing data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Options Menu */}
      <div className="px-2 mt-4 space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3">Select a report</p>
        <Card className="border-none shadow-md bg-card rounded-2xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            {options.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => handleQuery(opt.label, opt.value)}
                disabled={isLoading}
                className={cn(
                  "w-full p-4 flex items-center justify-between text-left transition-all active:bg-muted/10 disabled:opacity-50",
                  i !== options.length - 1 && "border-b border-muted/5"
                )}
              >
                <span className="text-sm font-semibold text-foreground/80">{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
