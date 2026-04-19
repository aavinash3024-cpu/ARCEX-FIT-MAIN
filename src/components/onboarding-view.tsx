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
  Cpu,
  ArrowRight
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
          className="object-cover opacity-15 scale-105"
          data-ai-hint="fitness technology"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#065A54]/60 via-slate-950/95 to-slate-950" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Surgical Header Protocol */}
        <header className="px-8 pt-10 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-[0.2em] uppercase text-white leading-none">arcex fit</h1>
              <p className="text-[7px] font-black uppercase text-primary/40 tracking-[0.4em] mt-1.5">Setup Protocol v1.0</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">SECURE_ENV</span>
          </div>
        </header>

        {/* Phase Neuro-Track */}
        <div className="px-8 flex justify-between items-end gap-1 mb-8 shrink-0 h-6">
          {[1, 2, 3, 4, 5].map((i) => {
            const isActive = step === i;
            const isCompleted = step > i;
            return (
              <div key={i} className="flex-1 flex flex-col gap-1.5">
                 <div className={cn(
                   "h-[1.5px] w-full transition-all duration-700", 
                   isCompleted ? "bg-primary/40" : isActive ? "bg-primary shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-white/5"
                 )} />
                 <p className={cn(
                   "text-[7px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                   isActive ? "text-primary opacity-100" : "text-white/10 opacity-100"
                 )}>
                   PH_0{i}
                 </p>
              </div>
            );
          })}
        </div>

        {/* Main Interface Content */}
        <div className="flex-1 px-4 overflow-y-auto swipe-container pb-40">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                   <Fingerprint className="w-6 h-6 text-primary" /> Identity
                </h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">INITIALIZE BIOMETRIC KEY</p>
              </div>
              
              <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="space-y-3">
                    <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Primary Display Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="ALEX JOHNSON"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-xs focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/5 tracking-widest uppercase"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Age (Years)</Label>
                      <Input 
                        type="number"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        className="h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-xs focus:ring-1 focus:ring-primary/20 text-center tracking-widest"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Genetic Sex</Label>
                      <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                        <SelectTrigger className="h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-[10px] tracking-[0.2em] focus:ring-1 focus:ring-primary/20 uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-slate-900 border-white/10 text-white">
                          <SelectItem value="male" className="text-[10px] font-black uppercase tracking-widest">Male</SelectItem>
                          <SelectItem value="female" className="text-[10px] font-black uppercase tracking-widest">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" /> Metrics
                </h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">CALIBRATE METABOLIC ENGINE</p>
              </div>

              <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Body Mass (KG)</Label>
                      <Input 
                        type="number"
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-xs focus:ring-1 focus:ring-primary/20 text-center tracking-widest"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Height (CM)</Label>
                      <Input 
                        type="number"
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        className="h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-xs focus:ring-1 focus:ring-primary/20 text-center tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1">Activity Multiplier</Label>
                    <Select value={activity} onValueChange={(val: any) => setActivity(val)}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-[10px] tracking-[0.2em] focus:ring-1 focus:ring-primary/20 uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-slate-900 border-white/10 text-white">
                        <SelectItem value="sedentary" className="text-[10px] font-black uppercase tracking-widest">Sedentary</SelectItem>
                        <SelectItem value="light" className="text-[10px] font-black uppercase tracking-widest">Lightly Active</SelectItem>
                        <SelectItem value="moderate" className="text-[10px] font-black uppercase tracking-widest">Moderately Active</SelectItem>
                        <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest">Very Active</SelectItem>
                        <SelectItem value="extreme" className="text-[10px] font-black uppercase tracking-widest">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" /> Mission
                </h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">DEFINE PERFORMANCE TARGET</p>
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
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", objective === obj ? "text-primary" : "text-white/20")}>{obj}</p>
                  </button>
                ))}
              </div>

              <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="space-y-3">
                    <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1 text-center block">Target Mass (KG)</Label>
                    <Input 
                      type="number"
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className={cn(
                        "h-16 rounded-[1.5rem] font-black text-2xl text-center transition-all bg-white/[0.01] tracking-tighter",
                        !calculations.isWeightValid ? "border-red-500/50 bg-red-500/5 text-red-500" : "border-white/5 text-white"
                      )}
                    />
                    {!calculations.isWeightValid && (
                      <p className="text-[7px] font-black text-red-500 uppercase tracking-[0.3em] text-center mt-2">PARAMETER CONFLICT: {objective.toUpperCase()}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] pl-1 text-center block">Temporal Velocity</Label>
                    <div className="grid gap-3">
                      {[0.25, 0.5, 0.75, 1.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setWeeklyRate(rate as WeeklyRate)}
                          className={cn(
                            "p-5 rounded-[1.5rem] border text-left flex justify-between items-center transition-all group",
                            weeklyRate === rate ? "border-primary bg-primary/10" : "border-white/5 bg-white/[0.02]"
                          )}
                        >
                          <div>
                            <p className={cn("text-xs font-black uppercase tracking-widest", weeklyRate === rate ? "text-primary" : "text-white/60")}>{rate} KG/WK</p>
                            <p className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">EST_FLUX</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "h-7 text-[8px] font-black uppercase tracking-widest transition-all px-3 rounded-full",
                            weeklyRate === rate ? "border-primary text-primary" : "border-white/10 text-white/10"
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
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" /> Strategy
                </h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">OPTIMIZE CALORIC FLUX</p>
              </div>

              <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-12">
                  <div className="bg-white/[0.02] p-8 rounded-[2.5rem] text-center border border-white/5 shadow-inner relative overflow-hidden group">
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mb-3 relative z-10 opacity-60">DAILY_ENERGY_BUDGET</p>
                    <div className="flex items-baseline justify-center gap-3 relative z-10">
                      <p className="text-6xl font-black text-white tracking-tighter">{calculations.finalCalories}</p>
                      <span className="text-[10px] text-primary uppercase font-black tracking-[0.3em]">KCAL</span>
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    <div className="space-y-5">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Energy Offset</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-primary/20 text-primary border-none tracking-widest">{calAdj[0] > 0 ? `+${calAdj[0]}` : calAdj[0]} KCAL</Badge>
                      </div>
                      <Slider value={calAdj} onValueChange={setCalAdj} min={objective === 'loss' ? -1100 : 0} max={objective === 'gain' ? 1100 : 0} step={20} className="[&_[role=slider]]:bg-primary [&_[role=track]]:h-1" />
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Protein Intensity</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-amber-500/20 text-amber-500 border-none tracking-widest">{protAdj[0]}G/KG</Badge>
                      </div>
                      <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={3.0} step={0.1} className="[&_[role=slider]]:bg-amber-500 [&_[role=track]]:h-1" />
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Distribution</Label>
                        <Badge variant="secondary" className="text-[9px] font-black h-5 bg-blue-500/20 text-blue-500 border-none tracking-widest">{carbRatio[0]}% CARBS</Badge>
                      </div>
                      <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} className="[&_[role=slider]]:bg-blue-500 [&_[role=track]]:h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="px-4 space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" /> Summary
                </h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">FINAL PROTOCOL AUDIT</p>
              </div>

              <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                      <p className="text-[7px] font-black text-primary uppercase tracking-[0.4em] mb-2 leading-none">ENERGY_NET</p>
                      <p className="text-3xl font-black text-white tracking-tighter">{calculations.finalCalories}</p>
                      <p className="text-[7px] font-bold text-white/10 uppercase tracking-widest mt-1">KILOCALORIES</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 text-right">
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 leading-none">VEL_COEF</p>
                      <p className="text-3xl font-black text-white tracking-tighter">{calculations.derivedWeeklyRate}</p>
                      <p className="text-[7px] font-bold text-white/10 uppercase tracking-widest mt-1">KG / WEEK</p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    <h4 className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em] text-center">NUTRITIONAL_MAP</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="space-y-1.5">
                        <p className="text-sm font-black tracking-tight" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                        <p className="text-[7px] font-black text-white/10 uppercase tracking-widest">PROT</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black tracking-tight" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                        <p className="text-[7px] font-black text-white/10 uppercase tracking-widest">CARB</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black tracking-tight" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                        <p className="text-[7px] font-black text-white/10 uppercase tracking-widest">FAT</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black tracking-tight" style={{ color: MACRO_COLORS.fiber }}>{calculations.fiber}g</p>
                        <p className="text-[7px] font-black text-white/10 uppercase tracking-widest">FIB</p>
                      </div>
                    </div>
                    
                    <div className="h-[1.5px] w-full bg-white/[0.02] rounded-full overflow-hidden flex">
                      <div className="h-full transition-all duration-1000" style={{ width: `${calculations.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} />
                      <div className="h-full transition-all duration-1000" style={{ width: `${calculations.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} />
                      <div className="h-full transition-all duration-1000" style={{ width: `${calculations.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} />
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-500/10 flex gap-6 items-center relative overflow-hidden">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em] leading-tight">AI GUIDANCE READY</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">NEURAL ENGINE CALIBRATED</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Protocol Controls */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex gap-4 z-20 max-w-lg mx-auto">
          {step > 1 && (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)}
              className="w-16 h-16 rounded-[2rem] bg-white/[0.03] border border-white/5 text-white/40 hover:text-white transition-all active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className="flex-1 h-16 rounded-[2rem] bg-primary text-slate-950 font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_20px_40px_rgba(74,222,128,0.15)] gap-3 group active:scale-95 transition-all"
          >
            {step === 5 ? "Initialize Core" : "Commit Phase"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
