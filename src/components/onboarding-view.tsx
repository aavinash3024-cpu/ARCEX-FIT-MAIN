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
  ArrowRight,
  PieChart,
  Settings2,
  Check
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

/**
 * Highly graphical continuous animation component for the full background.
 */
const GraphicalHeaderAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Central Pulsating Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      
      {/* CENTRAL CONCENTRIC RINGS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-primary/5 rounded-full animate-[spin_60s_linear_infinite] opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-primary/10 border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] border-2 border-primary/5 rounded-full animate-[spin_30s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-t-primary/20 border-r-transparent border-b-primary/20 border-l-transparent rounded-full animate-[spin_15s_linear_infinite]" />

      {/* Peripheral Rings */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-t-2 border-primary/10 rounded-full animate-[spin_25s_linear_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-b-2 border-primary/5 rounded-full animate-[spin_35s_linear_infinite_reverse]" />
      
      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Full height Scanning Line Effect */}
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[scan_8s_ease-in-out_infinite]" />

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
      `}</style>
    </div>
  );
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
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1200&auto=format&fit=crop"} 
          alt="Background"
          fill
          className="object-cover opacity-20"
          data-ai-hint="fitness technology"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#065A54]/70 via-[#065A54]/30 to-slate-950/95" />
      </div>

      <GraphicalHeaderAnimation />

      <div className="relative z-10 flex flex-col h-full">
        {/* Branding Title */}
        <div className="pt-10 flex flex-col items-center justify-center shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-2xl tracking-tighter text-white">arcex</span>
            <span className="font-black text-2xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
          </div>
        </div>

        {/* Step Header */}
        <div className="px-8 pt-6 pb-6 flex flex-col items-center gap-4 shrink-0">
          <div className="flex justify-between items-center w-full max-w-sm gap-2">
            {[1, 2, 3, 4, 5].map((i) => {
              const isActive = step === i;
              const isCompleted = step > i;
              return (
                <div key={i} className="flex-1 flex flex-col gap-2">
                   <div className={cn(
                     "h-1.5 w-full rounded-full transition-all duration-500", 
                     isCompleted ? "bg-primary/60" : isActive ? "bg-primary shadow-[0_0_15px_rgba(74,222,128,0.5)]" : "bg-white/10"
                   )} />
                   <p className={cn(
                     "text-[10px] font-bold text-center transition-all duration-500",
                     isActive ? "text-primary" : "text-white/20"
                   )}>
                     Step {i}
                   </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Interface Content */}
        <div className="flex-1 px-4 overflow-y-auto swipe-container pb-40">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="px-2 text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Your Identity</h2>
                <p className="text-sm text-white/50">Let's start with the basics</p>
              </div>
              
              <Card className="border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-white/70 pl-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input 
                        placeholder="Alex Johnson"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium focus:ring-primary/20 placeholder:text-white/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-white/70 pl-1">Age</Label>
                      <Input 
                        type="number"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        className="h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-white/70 pl-1">Sex</Label>
                      <Select value={gender} onValueChange={(val: 'male' | 'female') => setGender(val)}>
                        <SelectTrigger className="h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="z-[200] rounded-xl bg-slate-900 border-white/10 text-white">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="px-2 text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Body Metrics</h2>
                <p className="text-sm text-white/50">Details used for metabolic calculations</p>
              </div>

              <Card className="border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-white/70 pl-1">Weight (kg)</Label>
                      <Input 
                        type="number"
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-white/70 pl-1">Height (cm)</Label>
                      <Input 
                        type="number"
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        className="h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium text-center"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-white/70 pl-1">Daily Activity Level</Label>
                    <Select value={activity} onValueChange={(val: ActivityLevel) => setActivity(val)}>
                      <SelectTrigger className="h-14 rounded-xl bg-white/[0.02] border-white/10 text-white font-medium">
                        <SelectValue placeholder="Select Activity" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] rounded-xl bg-slate-900 border-white/10 text-white">
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="active">Very Active</SelectItem>
                        <SelectItem value="extreme">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="px-2 text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Your Goal</h2>
                <p className="text-sm text-white/50">What are we aiming for?</p>
              </div>

              <div className="grid grid-cols-3 gap-2 px-1">
                {(['loss', 'maintain', 'gain'] as Objective[]).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setObjective(obj)}
                    className={cn(
                      "p-4 rounded-xl border transition-all text-center backdrop-blur-md",
                      objective === obj 
                        ? "border-primary bg-primary/10 shadow-lg" 
                        : "border-white/5 bg-white/5"
                    )}
                  >
                    <p className={cn("text-xs font-bold capitalize", objective === obj ? "text-primary" : "text-white/30")}>{obj}</p>
                  </button>
                ))}
              </div>

              <Card className="border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-white/70 text-center block">Target Weight (kg)</Label>
                    <Input 
                      type="number"
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className={cn(
                        "h-16 rounded-xl font-bold text-2xl text-center transition-all bg-white/[0.01]",
                        !calculations.isWeightValid ? "border-red-500/50 bg-red-500/5 text-red-500" : "border-white/10 text-white"
                      )}
                    />
                    {!calculations.isWeightValid && (
                      <p className="text-[10px] font-bold text-red-500 text-center mt-2">Weight must match {objective} objective</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-white/70 text-center block">Desired Pace</Label>
                    <div className="grid gap-3">
                      {[0.25, 0.5, 0.75, 1.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setWeeklyRate(rate as WeeklyRate)}
                          className={cn(
                            "p-5 rounded-xl border text-left flex justify-between items-center transition-all",
                            weeklyRate === rate ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.02]"
                          )}
                        >
                          <div>
                            <p className={cn("text-sm font-bold", weeklyRate === rate ? "text-primary" : "text-white/60")}>{rate} kg per week</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "h-7 text-[10px] font-bold transition-all px-3 rounded-full",
                            weeklyRate === rate ? "border-primary text-primary" : "border-white/10 text-white/20"
                          )}>
                            {(calculations.weightDiff / rate).toFixed(1) === "Infinity" ? "0" : (calculations.weightDiff / rate).toFixed(1)} weeks
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="px-2 text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Fine-Tuning</h2>
                <p className="text-sm text-white/50">Your customized nutritional strategy</p>
              </div>

              <Card className="border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-5 rounded-xl text-center space-y-1 border border-primary/20 shadow-inner">
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Calculated Daily Intake</p>
                      <p className="text-3xl font-black text-white">{calculations.finalCalories} <span className="text-xs text-white/40">KCAL</span></p>
                    </div>

                    <div className="bg-white/[0.02] p-4 rounded-xl space-y-4 border border-white/5">
                      <p className="text-[10px] font-black text-center text-white/30 uppercase tracking-widest">Macro Targets</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center space-y-0.5">
                          <p className="text-base font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase">Protein</p>
                          <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black bg-white/5 text-white border-none">{calculations.proteinPct}%</Badge>
                        </div>
                        <div className="text-center space-y-0.5">
                          <p className="text-base font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase">Carbs</p>
                          <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black bg-white/5 text-white border-none">{calculations.carbPct}%</Badge>
                        </div>
                        <div className="text-center space-y-0.5">
                          <p className="text-base font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase">Fats</p>
                          <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black bg-white/5 text-white border-none">{calculations.fatPct}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Energy Offset</Label>
                        <Badge variant="secondary" className="text-[9px] font-bold h-5 bg-primary/20 text-primary border-none">{calAdj[0] > 0 ? `+${calAdj[0]}` : calAdj[0]} kcal</Badge>
                      </div>
                      <Slider value={calAdj} onValueChange={setCalAdj} min={objective === 'loss' ? -1100 : 0} max={objective === 'gain' ? 1100 : 0} step={20} className="[&_[role=slider]]:bg-primary" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Protein Goal</Label>
                        <Badge variant="secondary" className="text-[9px] font-bold h-5 bg-amber-500/20 text-amber-500 border-none">{protAdj[0]}g/kg</Badge>
                      </div>
                      <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={3.0} step={0.1} className="[&_[role=slider]]:bg-amber-500" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Carb Balance</Label>
                        <Badge variant="secondary" className="text-[9px] font-bold h-5 bg-blue-500/20 text-blue-500 border-none">{carbRatio[0]}:{100 - carbRatio[0]}</Badge>
                      </div>
                      <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} className="[&_[role=slider]]:bg-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="px-2 text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Final Confirmation</h2>
                <p className="text-sm text-white/50">Confirm your strategy to begin</p>
              </div>

              <Card className="border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest">Weekly Pace</p>
                          <p className="text-sm font-bold uppercase text-white">{calculations.derivedWeeklyRate} kg / week</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest">Estimated Time</p>
                          <p className="text-sm font-bold text-primary uppercase">{calculations.weeksToGoal} weeks</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <p className="text-[9px] font-semibold text-white/40 uppercase">Budget</p>
                            <p className="text-lg font-bold text-primary">{calculations.finalCalories} kcal</p>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <p className="text-[9px] font-semibold text-white/40 uppercase">TDEE</p>
                            <p className="text-lg font-bold text-white/20">{calculations.tdee} kcal</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <p className="text-[10px] font-black uppercase text-center tracking-widest text-white/30">MACROS AUDIT</p>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                            <p className="text-[7px] font-bold text-white/40 uppercase">Protein</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                            <p className="text-[7px] font-bold text-white/40 uppercase">Carbs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                            <p className="text-[7px] font-bold text-white/40 uppercase">Fats</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: MACRO_COLORS.fiber }}>{calculations.fiber}g</p>
                            <p className="text-[7px] font-bold text-white/40 uppercase">Fiber</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
                          <div style={{ width: `${calculations.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} />
                          <div style={{ width: `${calculations.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} />
                          <div style={{ width: `${calculations.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} />
                        </div>
                        <div className="flex justify-between text-[7px] font-semibold uppercase text-white/20">
                          <span>{calculations.proteinPct}% Protein</span>
                          <span>{calculations.carbPct}% Carbs</span>
                          <span>{calculations.fatPct}% Fats</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Integrated Completion Section */}
                  <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] border-2 border-emerald-500/30">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Your Profile is Ready</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Initialization Complete</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex gap-4 z-20 max-w-lg mx-auto">
          {step > 1 && (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)}
              className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all font-bold"
            >
              Previous
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className="flex-[2] h-14 rounded-xl bg-primary text-slate-950 font-bold shadow-xl gap-2 active:scale-95 transition-all"
          >
            {step === 5 ? "Launch arcexfit" : "Next Step"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
