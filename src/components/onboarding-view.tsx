
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
  HeartPulse
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

type Objective = 'maintain' | 'gain' | 'loss';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';
type WeeklyRate = 0.25 | 0.5 | 0.75 | 1.0;

interface OnboardingViewProps {
  onComplete: () => void;
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(1);

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
    const fatPct = 100 - proteinPct - carbPct;

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

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <div className="p-8 pt-12 space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase">arcex setup</h1>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Configure Your Intelligence</p>
      </div>

      <div className="px-8 flex justify-between gap-1 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", step >= i ? "bg-primary" : "bg-muted")} />
        ))}
      </div>

      <div className="flex-1 px-4 space-y-6">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="px-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Identity Details</h2>
              <p className="text-xs text-muted-foreground font-medium">Let's get to know you first.</p>
            </div>
            <Card className="border-none bg-card shadow-sm rounded-3xl p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">What's your name?</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input 
                    placeholder="Enter your name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Age</Label>
                  <Input 
                    type="number"
                    value={age} 
                    onChange={(e) => setAge(e.target.value)}
                    className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Sex</Label>
                  <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="male" className="text-xs font-bold uppercase">Male</SelectItem>
                      <SelectItem value="female" className="text-xs font-bold uppercase">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="px-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Body Status</h2>
              <p className="text-xs text-muted-foreground font-medium">Vital metrics for your base metabolic rate.</p>
            </div>
            <Card className="border-none bg-card shadow-sm rounded-3xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Weight (KG)</Label>
                  <Input 
                    type="number"
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Height (CM)</Label>
                  <Input 
                    type="number"
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Daily Activity Level</Label>
                <Select value={activity} onValueChange={(val: any) => setActivity(val)}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="sedentary" className="text-xs font-bold uppercase">Sedentary</SelectItem>
                    <SelectItem value="light" className="text-xs font-bold uppercase">Lightly Active</SelectItem>
                    <SelectItem value="moderate" className="text-xs font-bold uppercase">Moderately Active</SelectItem>
                    <SelectItem value="active" className="text-xs font-bold uppercase">Very Active</SelectItem>
                    <SelectItem value="extreme" className="text-xs font-bold uppercase">Extremely Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="px-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Main Objective</h2>
              <p className="text-xs text-muted-foreground font-medium">What are we trying to achieve together?</p>
            </div>
            <div className="grid grid-cols-3 gap-2 px-1">
              {(['loss', 'maintain', 'gain'] as Objective[]).map((obj) => (
                <button
                  key={obj}
                  onClick={() => setObjective(obj)}
                  className={cn(
                    "p-3 rounded-2xl border transition-all text-center",
                    objective === obj ? "border-primary bg-primary/5 shadow-sm" : "border-muted/20"
                  )}
                >
                  <p className={cn("text-[9px] font-black uppercase tracking-widest", objective === obj ? "text-primary" : "text-muted-foreground")}>{obj}</p>
                </button>
              ))}
            </div>
            <Card className="border-none bg-card shadow-sm rounded-3xl p-6 space-y-6">
               <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Target Weight (KG)</Label>
                <Input 
                  type="number"
                  value={targetWeight} 
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className={cn(
                    "h-12 rounded-xl font-bold text-xs",
                    !calculations.isWeightValid ? "border-destructive bg-destructive/5" : "bg-muted/5 border-muted-foreground/10"
                  )}
                />
                {!calculations.isWeightValid && (
                  <p className="text-[8px] font-black text-destructive uppercase tracking-widest mt-1">Invalid weight for {objective}</p>
                )}
              </div>
              <div className="space-y-3">
                 <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Weekly Intensity</Label>
                 <div className="grid gap-2">
                    {[0.25, 0.5, 0.75, 1.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setWeeklyRate(rate as WeeklyRate)}
                        className={cn(
                          "p-3 rounded-xl border text-left flex justify-between items-center transition-all",
                          weeklyRate === rate ? "border-primary bg-primary/5" : "border-muted/20"
                        )}
                      >
                        <div>
                           <p className="text-[11px] font-black uppercase">{rate} KG / WEEK</p>
                           <p className="text-[8px] font-bold text-muted-foreground uppercase">Estimated Pace</p>
                        </div>
                        <Badge variant="outline" className="h-5 text-[8px] font-black uppercase border-muted/30">
                           {(calculations.weightDiff / rate).toFixed(1)} WEEKS
                        </Badge>
                      </button>
                    ))}
                 </div>
              </div>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="px-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Strategy Fine-Tuning</h2>
              <p className="text-xs text-muted-foreground font-medium">Adjust your daily energy and nutrient flow.</p>
            </div>
            <Card className="border-none bg-card shadow-sm rounded-3xl p-6 space-y-8">
               <div className="bg-primary/5 p-5 rounded-3xl text-center border border-primary/10">
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">Estimated Daily Intake</p>
                  <p className="text-3xl font-black">{calculations.finalCalories} <span className="text-[10px] text-muted-foreground uppercase font-black">kcal</span></p>
               </div>
               
               <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Adjust Energy</Label>
                      <Badge variant="secondary" className="text-[9px] font-black h-5">{calAdj[0] > 0 ? `+${calAdj[0]}` : calAdj[0]} kcal</Badge>
                    </div>
                    <Slider value={calAdj} onValueChange={setCalAdj} min={objective === 'loss' ? -1100 : 0} max={objective === 'gain' ? 1100 : 0} step={20} />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Protein Intensity</Label>
                      <Badge variant="secondary" className="text-[9px] font-black h-5">{protAdj[0]}g / kg</Badge>
                    </div>
                    <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={3.0} step={0.1} />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Macro Ratio</Label>
                      <Badge variant="secondary" className="text-[9px] font-black h-5">{carbRatio[0]}% CARBS</Badge>
                    </div>
                    <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} />
                 </div>
               </div>
            </Card>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="px-4 space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">All Set, {name}!</h2>
              <p className="text-xs text-muted-foreground font-medium">Review your intelligence profile before starting.</p>
            </div>
            <Card className="border-none bg-card shadow-lg rounded-3xl p-6 space-y-6">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10">
                     <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">DAILY BUDGET</p>
                     <p className="text-lg font-black text-primary">{calculations.finalCalories} KCAL</p>
                  </div>
                  <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10">
                     <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">TARGET PACE</p>
                     <p className="text-lg font-black">{calculations.derivedWeeklyRate} KG / WK</p>
                  </div>
               </div>

               <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">NUTRITIONAL BLUEPRINT</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs font-black text-[#FFC107]">{calculations.protein}g</p>
                      <p className="text-[7px] font-bold text-muted-foreground uppercase">Prot</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#42A5F5]">{calculations.carbs}g</p>
                      <p className="text-[7px] font-bold text-muted-foreground uppercase">Carb</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#FF7043]">{calculations.fats}g</p>
                      <p className="text-[7px] font-bold text-muted-foreground uppercase">Fat</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#10b981]">{calculations.fiber}g</p>
                      <p className="text-[7px] font-bold text-muted-foreground uppercase">Fib</p>
                    </div>
                  </div>
               </div>

               <div className="bg-emerald-500/10 p-5 rounded-[2rem] border border-emerald-500/20 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                     <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                     <p className="text-[11px] font-black text-emerald-800 uppercase leading-tight">AI GUIDANCE ENABLED</p>
                     <p className="text-[9px] font-bold text-emerald-700/60 uppercase mt-0.5">Real-time tracking activated</p>
                  </div>
               </div>
            </Card>
          </div>
        )}
      </div>

      <div className="px-4 pt-8 flex gap-3">
        {step > 1 && (
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            className="w-16 h-14 rounded-2xl border border-muted/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <Button 
          onClick={handleNext}
          disabled={step === 1 && !name.trim()}
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase text-[12px] tracking-widest shadow-xl shadow-primary/20 gap-2"
        >
          {step === 5 ? "Initialize Experience" : "Continue Setup"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
