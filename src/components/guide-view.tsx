
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Sparkles, 
  User, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  PieChart,
  Activity,
  Zap,
  Target,
  X
} from "lucide-react";
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'system';
  text: string;
}

interface GuideViewProps {
  goalData: any;
  loggedMeals: any[];
  hydrationAmount: number;
  onBack: () => void;
}

export function GuideView({ goalData, loggedMeals, hydrationAmount, onBack }: GuideViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: "SYSTEM INITIALIZED: PulseFlow Performance Analyst Ready.\n\nSelect a Precision Module below to execute a real-time audit of your wellness data." }
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
      const score = Math.min(100, Math.round(((Math.min(totals.protein / targetP, 1) + Math.min(totals.carbs / targetC, 1) + Math.min(totals.fat / targetF, 1)) / 3) * 100));
      const hydrationLiters = hydrationAmount / 1000;
      
      let status = "TARGET";
      if (accuracy < 90) status = "BEHIND";
      if (accuracy > 105) status = "AHEAD";

      return `[FULL SYSTEM AUDIT]

• ENERGY: ${Math.round(totals.calories)} / ${targetCal} kcal (${accuracy}%)
• HYDRATION: ${hydrationLiters.toFixed(1)} / ${targetHydration.toFixed(1)} Liters
• MACROS: P ${Math.round(totals.protein)}g | C ${Math.round(totals.carbs)}g | F ${Math.round(totals.fat)}g
• FIBER: ${Math.round(totals.fiber)} / ${targetFI}g
• SYSTEM SCORE: ${score}%
• PERFORMANCE STATUS: ${status}
• ADVISORY: ${totals.calories < targetCal ? "Caloric buffer available. Focus on protein density." : "Limit intake to low-calorie micronutrient sources for remainder of day."}`;
    }

    if (type === 'macros') {
      const pDiff = totals.protein - targetP;
      const cDiff = totals.carbs - targetC;
      const fDiff = totals.fat - targetF;
      const fiDiff = totals.fiber - targetFI;

      const deficits = [
        { label: 'PROTEIN', val: (totals.protein / targetP) },
        { label: 'CARBS', val: (totals.carbs / targetC) },
        { label: 'FAT', val: (totals.fat / targetF) }
      ].sort((a, b) => a.val - b.val);

      return `[MACRO & FIBER ANALYSIS]

• PROTEIN: ${Math.round(totals.protein)}g / ${targetP}g (${pDiff > 0 ? '+' : ''}${Math.round(pDiff)}g)
• CARBS: ${Math.round(totals.carbs)}g / ${targetC}g (${cDiff > 0 ? '+' : ''}${Math.round(cDiff)}g)
• FAT: ${Math.round(totals.fat)}g / ${targetF}g (${fDiff > 0 ? '+' : ''}${Math.round(fDiff)}g)
• FIBER: ${Math.round(totals.fiber)}g / ${targetFI}g (${fiDiff > 0 ? '+' : ''}${Math.round(fiDiff)}g)
• PRIMARY GAP: ${deficits[0].label} (${Math.round(deficits[0].val * 100)}% met)`;
    }

    if (type === 'micros') {
      const micros = [
        { id: 'vitaminA', label: 'Vit A', val: totals.vitaminA, target: microTargets.vitaminA, unit: 'mcg' },
        { id: 'omega3', label: 'Omega-3', val: totals.omega3, target: microTargets.omega3, unit: 'g' },
        { id: 'vitaminC', label: 'Vit C', val: totals.vitaminC, target: microTargets.vitaminC, unit: 'mg' },
        { id: 'zinc', label: 'Zinc', val: totals.zinc, target: microTargets.zinc, unit: 'mg' },
        { id: 'selenium', label: 'Selenium', val: totals.selenium, target: microTargets.selenium, unit: 'mcg' },
        { id: 'magnesium', label: 'Mag', val: totals.magnesium, target: microTargets.magnesium, unit: 'mg' },
        { id: 'vitaminD', label: 'Vit D', val: totals.vitaminD, target: microTargets.vitaminD, unit: 'mcg' },
        { id: 'potassium', label: 'Potas', val: totals.potassium, target: microTargets.potassium, unit: 'mg' },
        { id: 'iron', label: 'Iron', val: totals.iron, target: microTargets.iron, unit: 'mg' },
        { id: 'calcium', label: 'Calc', val: totals.calcium, target: microTargets.calcium, unit: 'mg' },
      ];

      const report = micros.map(m => `• ${m.label}: ${m.val.toFixed(m.val < 1 && m.val > 0 ? 2 : 0)}${m.unit} / ${m.target}${m.unit}`).join('\n');

      return `[MICRONUTRIENT STATUS REPORT]

${report}

• AUDIT: ${micros.filter(m => (m.val / m.target) < 0.5).length} Critical gaps detected.`;
    }

    if (type === 'suggestion') {
      const remCal = targetCal - totals.calories;
      const remP = targetP - totals.protein;
      const remC = targetC - totals.carbs;

      let meal = "Grilled Salmon & Asparagus";
      let prep = "Pan-sear 150g salmon, steam greens.";
      let est = "350 kcal | 35g P | 5g C";

      if (remP < 10 && remC > 40) {
        meal = "Steel-Cut Oats with Berries";
        prep = "Boil oats, top with fresh antioxidants.";
        est = "300 kcal | 10g P | 55g C";
      } else if (remP > 30) {
        meal = "Double Chicken Power Bowl";
        prep = "200g grilled breast with spinach base.";
        est = "320 kcal | 45g P | 2g C";
      }

      return `[PRECISION MEAL SUGGESTION]

• TARGET GAP: ${Math.max(0, Math.round(remCal))} kcal, ${Math.max(0, Math.round(remP))}g P
• SUGGESTION: ${meal}
• ESTIMATED: ${est}
• PREPARATION: ${prep}`;
    }

    return "ERROR: Module undefined.";
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
    { label: "Overall System Audit", value: 'overall', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: "Macro & Fiber Analysis", value: 'macros', icon: PieChart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: "Full Micro Audit", value: 'micros', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: "Precision Meal Suggestion", value: 'suggestion', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 py-4 px-1 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-muted/10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black uppercase tracking-tight text-foreground">PulseFlow AI</h1>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[7px] font-black uppercase tracking-[0.2em] h-4 border-none">Active</Badge>
          </div>
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Precision Analyst Engine</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
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
              "max-w-[95%] rounded-[1.5rem] p-5 shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-card border border-muted/20 rounded-tl-none text-foreground/90 glass-card"
            )}>
              <div className="flex items-center gap-2 mb-3 opacity-40">
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 ml-auto order-2" />
                ) : (
                  <Activity className="w-3 h-3 text-primary" />
                )}
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {msg.role === 'user' ? 'Identity Verification' : 'PRECISION SYSTEM AUDIT'}
                </span>
              </div>
              <p className="font-bold whitespace-pre-wrap tracking-tight">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-card border border-muted/20 rounded-[1.5rem] rounded-tl-none p-5 shadow-sm flex flex-col gap-3 glass-card">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Scanning Data Streams...</span>
              </div>
              <div className="h-1 w-32 bg-muted/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress w-full origin-left" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Precision Modules Panel */}
      <div className="px-2 mt-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em]">Audit Modules</p>
          <div className="h-px flex-1 mx-4 bg-muted/20" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 pb-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleQuery(opt.label, opt.value)}
              disabled={isLoading}
              className="group relative text-left bg-card hover:bg-muted/5 border border-muted/20 p-4 rounded-[1.5rem] transition-all active:scale-[0.98] disabled:opacity-50 flex flex-col gap-3 overflow-hidden shadow-sm"
            >
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", opt.bg, opt.color)}>
                <opt.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-foreground/70 leading-tight pr-4">
                {opt.label}
              </span>
              <ArrowRight className="absolute bottom-4 right-4 w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
