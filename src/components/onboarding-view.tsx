
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Activity,
  User,
  HeartPulse,
  Fingerprint,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type Objective = 'maintain' | 'gain' | 'loss';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';
type WeeklyRate = 0.25 | 0.5 | 0.75 | 1.0;

interface OnboardingViewProps {
  onComplete: () => void;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Personal Info
  const [name, setName] = useState("");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Step 2: Body Status
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("175");
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // Step 3: Objective
  const [objective, setObjective] = useState<Objective>('loss');
  const [targetWeight, setTargetWeight] = useState("70");
  const [weeklyRate, setWeeklyRate] = useState<WeeklyRate>(0.5);

  // Step 4: Fine-Tuning
  const [calAdj, setCalAdj] = useState([0]);
  const [protAdj, setProtAdj] = useState([1.8]);
  const [carbRatio, setCarbRatio] = useState([50]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const calculations = useMemo(() => {
    const w = parseFloat(weight) || 75;
    const h = parseFloat(height) || 175;
    const a = parseFloat(age) || 25;
    const tw = parseFloat(targetWeight) || w;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') bmr += 5; else bmr -= 161;

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9
    };
    const tdee = Math.round(bmr * activityMultipliers[activity]);

    const finalCalories = Math.round(tdee + calAdj[0]);
    const proteinGrams = Math.round(w * protAdj[0]);
    const proteinKcal = proteinGrams * 4;
    
    const fiberGrams = Math.round((finalCalories / 1000) * 14);
    
    const remainingKcal = Math.max(0, finalCalories - proteinKcal);
    const carbKcal = remainingKcal * (carbRatio[0] / 100);
    const fatKcal = remainingKcal - carbKcal;

    const proteinPct = finalCalories > 0 ? Math.round((proteinKcal / finalCalories) * 100) : 0;
    const carbPct = finalCalories > 0 ? Math.round((carbKcal / finalCalories) * 100) : 0;
    const fatPct = Math.max(0, 100 - proteinPct - carbPct);

    const currentDeficitOrSurplus = Math.abs(finalCalories - tdee);
    const derivedWeeklyRate = parseFloat((currentDeficitOrSurplus / 1100).toFixed(2));
    
    const weightDiff = Math.abs(tw - w);
    const weeksToGoal = derivedWeeklyRate > 0 ? (weightDiff / derivedWeeklyRate).toFixed(1) : "0";

    return {
      bmr,
      tdee,
      finalCalories,
      protein: proteinGrams,
      carbs: Math.round(carbKcal / 4),
      fats: Math.round(fatKcal / 9),
      fiber: fiberGrams,
      proteinPct,
      carbPct,
      fatPct,
      isWeightValid: objective === 'gain' ? tw > w : objective === 'loss' ? tw < w : tw === w,
      weeksToGoal,
      weightDiff,
      derivedWeeklyRate
    };
  }, [weight, height, age, gender, activity, objective, targetWeight, calAdj, protAdj, carbRatio]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 3 && !calculations.isWeightValid) return;
    
    if (step === 3) {
      let initialOffset = 0;
      if (objective === 'loss') initialOffset = -(weeklyRate * 1100);
      if (objective === 'gain') initialOffset = (weeklyRate * 1100);
      setCalAdj([Math.round(initialOffset)]);
    }

    if (step === 5) {
      const dataToSave = {
        gender, age, weight, height, activity,
        objective, targetWeight, weeklyRate,
        calAdj, protAdj, carbRatio, isSaved: true,
        ...calculations
      };
      localStorage.setItem('pulseflow_goal_data', JSON.stringify(dataToSave));
      localStorage.setItem('pulseflow_user_profile', JSON.stringify({ name, email: `${name.toLowerCase().replace(/\s/g, '.')}@pulseflow.ai`, dob: "1998-05-15", location: "Global" }));
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const bgImage = PlaceHolderImages.find(img => img.id === 'analyzer-bg');

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1200&auto=format&fit=crop"} 
          alt="Tech Background"
          fill
          className="object-cover opacity-20 scale-110"
          data-ai-hint="fitness technology"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#065A54]/80 via-slate-950/90 to-slate-950" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Protocol */}
        <header className="p-8 pt-12 space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white">arcex fit</h1>
          </div>
          <p className="text-[10px] font-black uppercase text-primary/60 tracking-[0.4em] ml-1">Setup Protocol v1.0</p>
        </header>

        {/* System Progress Track */}
        <div className="px-8 flex justify-between gap-1.5 mb-8 shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 space-y-2">
               <div className={cn(
                 "h-1 rounded-full transition-all duration-700 shadow-sm", 
                 step >= i ? "bg-primary" : "bg-white/10"
               )} />
               <p className={cn(
                 "text-[7px] font-black uppercase tracking-widest text-center transition-opacity duration-500",
                 step === i ? "opacity-100 text-primary" : "opacity-0"
               )}>
                 Phase 0{i}
               </p>
            </div>
          ))}
        </div>

        {/* Main Interface Content */}
        <div className="flex-1 px-4 overflow-y-auto swipe-container pb-32">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                   <Fingerprint className="w-5 h-5 text-primary" /> Identification
                </h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Initialize user identity</p>
              </div>
              
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Primary Display Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Enter your name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm focus:ring-primary/20 transition-all placeholder:text-white/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Age (Years)</Label>
                      <Input 
                        type="number"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm focus:ring-primary/20 text-center"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Genetic Sex</Label>
                      <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                        <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-slate-900 border-white/10 text-white">
                          <SelectItem value="male" className="text-xs font-bold uppercase">Male</SelectItem>
                          <SelectItem value="female" className="text-xs font-bold uppercase">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Biometrics
                </h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Base metabolic configuration</p>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Body Weight (KG)</Label>
                      <Input 
                        type="number"
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm focus:ring-primary/20 text-center"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Height (CM)</Label>
                      <Input 
                        type="number"
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm focus:ring-primary/20 text-center"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Activity Multiplier</Label>
                    <Select value={activity} onValueChange={(val: any) => setActivity(val)}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-slate-900 border-white/10 text-white">
                        <SelectItem value="sedentary" className="text-xs font-bold uppercase">Sedentary</SelectItem>
                        <SelectItem value="light" className="text-xs font-bold uppercase">Lightly Active</SelectItem>
                        <SelectItem value="moderate" className="text-xs font-bold uppercase">Moderately Active</SelectItem>
                        <SelectItem value="active" className="text-xs font-bold uppercase">Very Active</SelectItem>
                        <SelectItem value="extreme" className="text-xs font-bold uppercase">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Target Objective
                </h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Define the mission goal</p>
              </div>

              <div className="grid grid-cols-3 gap-2 px-1">
                {(['loss', 'maintain', 'gain'] as Objective[]).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setObjective(obj)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-center backdrop-blur-md",
                      objective === obj 
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(74,222,128,0.1)]" 
                        : "border-white/5 bg-white/5"
                    )}
                  >
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", objective === obj ? "text-primary" : "text-white/40")}>{obj}</p>
                  </button>
                ))}
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1">Target Mass (KG)</Label>
                    <Input 
                      type="number"
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className={cn(
                        "h-14 rounded-2xl font-black text-lg text-center transition-all",
                        !calculations.isWeightValid ? "border-red-500 bg-red-500/10 text-red-500" : "bg-white/5 border-white/10 text-white"
                      )}
                    />
                    {!calculations.isWeightValid && (
                      <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center mt-2">Invalid parameter for objective: {objective}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1 text-center block">Temporal Intensity</Label>
                    <div className="grid gap-3">
                      {[0.25, 0.5, 0.75, 1.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setWeeklyRate(rate as WeeklyRate)}
                          className={cn(
                            "p-4 rounded-2xl border text-left flex justify-between items-center transition-all group",
                            weeklyRate === rate ? "border-primary bg-primary/10" : "border-white/5 bg-white/5"
                          )}
                        >
                          <div>
                            <p className={cn("text-[11px] font-black uppercase tracking-tight", weeklyRate === rate ? "text-primary" : "text-white")}>{rate} KG / WEEK</p>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Adjusted Caloric Flux</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "h-6 text-[8px] font-black uppercase transition-all",
                            weeklyRate === rate ? "border-primary text-primary" : "border-white/10 text-white/20"
                          )}>
                            {(calculations.weightDiff / rate).toFixed(1)} WEEKS
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Strategy Optimization
                </h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Fine-tune intake parameters</p>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="bg-primary/5 p-6 rounded-[2rem] text-center border border-primary/10 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-2 relative z-10">Daily Energy Flux</p>
                    <div className="flex items-baseline justify-center gap-2 relative z-10">
                      <p className="text-5xl font-black text-white tracking-tighter">{calculations.finalCalories}</p>
                      <span className="text-[10px] text-primary uppercase font-black tracking-widest">Kcal</span>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-white/60">Energy Offset</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-primary/20 text-primary border-none">{calAdj[0] > 0 ? `+${calAdj[0]}` : calAdj[0]} KCAL</Badge>
                      </div>
                      <Slider value={calAdj} onValueChange={setCalAdj} min={objective === 'loss' ? -1100 : 0} max={objective === 'gain' ? 1100 : 0} step={20} className="[&_[role=slider]]:bg-primary" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-white/60">Protein Intensity</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-amber-500/20 text-amber-500 border-none">{protAdj[0]}g / kg</Badge>
                      </div>
                      <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={3.0} step={0.1} className="[&_[role=slider]]:bg-amber-500" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-white/60">Macro Distribution</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-blue-500/20 text-blue-500 border-none">{carbRatio[0]}% CARBS</Badge>
                      </div>
                      <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} className="[&_[role=slider]]:bg-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Authorization
                </h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Confirm system parameters</p>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                      <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-2">DAILY BUDGET</p>
                      <p className="text-2xl font-black text-white">{calculations.finalCalories}</p>
                      <p className="text-[7px] font-bold text-white/20 uppercase">Kilo-Calories</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-right">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">TARGET PACE</p>
                      <p className="text-2xl font-black text-white">{calculations.derivedWeeklyRate}</p>
                      <p className="text-[7px] font-bold text-white/20 uppercase">KG / WEEK</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-center">NUTRITIONAL BLUEPRINT</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="space-y-1">
                        <p className="text-sm font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Prot</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Carb</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Fat</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black" style={{ color: MACRO_COLORS.fiber }}>{calculations.fiber}g</p>
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Fib</p>
                      </div>
                    </div>
                    
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full" style={{ width: `${calculations.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} />
                      <div className="h-full" style={{ width: `${calculations.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} />
                      <div className="h-full" style={{ width: `${calculations.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} />
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-500/20 flex gap-5 items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                       <Sparkles className="w-20 h-20 text-emerald-400" />
                    </div>
                    <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 relative z-10">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest leading-tight">AI GUIDANCE ENABLED</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter mt-0.5">Intelligence sync complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Protocol Controls */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent flex gap-4 z-20 max-w-lg mx-auto">
          {step > 1 && (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)}
              className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className="flex-1 h-16 rounded-[1.5rem] bg-primary text-slate-950 font-black uppercase text-[12px] tracking-[0.25em] shadow-2xl shadow-primary/20 gap-3 group active:scale-95 transition-all"
          >
            {step === 5 ? "Initialize Core" : "Commit Phase"}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
