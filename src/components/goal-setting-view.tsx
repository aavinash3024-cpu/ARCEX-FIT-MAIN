"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Scale, 
  CheckCircle2,
  Settings2,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  PieChart
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

interface GoalSettingViewProps {
  onBack: () => void;
  onGoalSaved?: () => void;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

export function GoalSettingView({ onBack, onGoalSaved }: GoalSettingViewProps) {
  const [step, setStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [hasExistingGoal, setHasExistingGoal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>("25");
  const [weight, setWeight] = useState<string>("75");
  const [height, setHeight] = useState<string>("175");
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [objective, setObjective] = useState<Objective>('loss');
  const [targetWeight, setTargetWeight] = useState<string>("70");
  const [weeklyRate, setWeeklyRate] = useState<WeeklyRate>(0.5);
  const [calAdj, setCalAdj] = useState([0]);
  const [protAdj, setProtAdj] = useState([1.8]);
  const [carbRatio, setCarbRatio] = useState([50]);

  // STABLE SCROLL RESET - INTERNAL NAVIGATION
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [step, isSaved]);

  useEffect(() => {
    const saved = localStorage.getItem('pulseflow_goal_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGender(data.gender || 'male');
        setAge(data.age || "25");
        setWeight(data.weight || "75");
        setHeight(data.height || "175");
        setActivity(data.activity || 'moderate');
        setObjective(data.objective || 'loss');
        setTargetWeight(data.targetWeight || "70");
        setWeeklyRate(data.weeklyRate || 0.5);
        setCalAdj(data.calAdj || [0]);
        setProtAdj(data.protAdj || [1.8]);
        setCarbRatio(data.carbRatio || [50]);
        setIsSaved(data.isSaved || false);
        setHasExistingGoal(data.isSaved || false);
      } catch (e) {
        console.error("Failed to load goal data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // History sync for hardware back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.goalStep === 'number') {
        setStep(event.state.goalStep);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
      derivedWeeklyRate,
      currentDeficitOrSurplus
    };
  }, [weight, height, age, gender, activity, objective, targetWeight, calAdj, protAdj, carbRatio]);

  const nextStep = () => {
    if (step === 2 && !calculations.isWeightValid) return;
    if (step === 2) {
      let initialOffset = 0;
      if (objective === 'loss') initialOffset = -(weeklyRate * 1100);
      if (objective === 'gain') initialOffset = (weeklyRate * 1100);
      setCalAdj([Math.round(initialOffset)]);
    }
    const newStep = step + 1;
    window.history.pushState({ tab: 'goal-setting', goalStep: newStep }, '');
    setStep(newStep);
  };
  
  const prevStep = () => {
    window.history.back();
  };

  const savePlan = () => {
    const dataToSave = {
      gender, age, weight, height, activity,
      objective, targetWeight, weeklyRate,
      calAdj, protAdj, carbRatio, isSaved: true,
      ...calculations
    };
    localStorage.setItem('pulseflow_goal_data', JSON.stringify(dataToSave));
    setIsSaved(true);
    setHasExistingGoal(true);
    if (onGoalSaved) onGoalSaved();
  };

  const handleEdit = () => {
    setIsSaved(false);
    setStep(1);
    window.history.pushState({ tab: 'goal-setting', goalStep: 1 }, '');
  };

  const handleHeaderBack = () => {
    if (!isSaved && hasExistingGoal) {
      const saved = localStorage.getItem('pulseflow_goal_data');
      if (saved) {
        const data = JSON.parse(saved);
        setGender(data.gender);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);
        setActivity(data.activity);
        setObjective(data.objective);
        setTargetWeight(data.targetWeight);
        setWeeklyRate(data.weeklyRate);
        setCalAdj(data.calAdj);
        setProtAdj(data.protAdj);
        setCarbRatio(data.carbRatio);
        setIsSaved(true);
      }
    } else {
      onBack();
    }
  };

  if (!isInitialized) return null;

  if (isSaved) {
    return (
      <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 pt-2 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-headline">Saved Goal</h1>
        </div>

        <Card className="border-none shadow-xl bg-card overflow-hidden rounded-[1.5rem] border border-muted/20">
          <CardContent className="p-0">
            <div className="p-6 flex items-center justify-between border-b border-muted/10">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Goal Objective</p>
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                  {objective} weight
                </h3>
              </div>
            </div>

            <div className="flex bg-muted/5">
              <div className="flex-1 p-5 border-r border-muted/10">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Starting Weight</p>
                <div className="bg-background p-3 rounded-xl border border-muted/10 mt-1 shadow-sm">
                  <p className="text-xl font-black text-foreground text-center">{weight}kg</p>
                </div>
              </div>
              <div className="flex-1 p-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-right">Target Weight</p>
                <div className="bg-background p-3 rounded-xl border border-muted/10 mt-1 shadow-sm">
                  <p className="text-xl font-black text-primary text-center">{targetWeight}kg</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-0.5">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Energy Budget</h4>
                </div>
                <div className="space-y-4 pl-1">
                  <div>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Daily Goal</p>
                    <p className="text-lg font-black text-primary">{calculations.finalCalories} kcal</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Maintenance (TDEE)</p>
                    <p className="text-md font-black text-foreground/60">{calculations.tdee} kcal</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4 py-0.5">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Journey Pace</h4>
                </div>
                <div className="space-y-4 pl-1">
                  <div>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Weekly Change</p>
                    <p className="text-md font-black text-foreground">{calculations.derivedWeeklyRate} kg / Week</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Estimated Duration</p>
                    <p className="text-md font-black text-foreground">{calculations.weeksToGoal} Weeks</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-muted/30 pl-4 py-0.5 flex items-center gap-2">
                  <PieChart className="w-3 h-3 text-primary" />
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nutritional Split</h4>
                </div>
                <div className="pl-1 space-y-6">
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Protein</p>
                      <p className="text-md font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Carbs</p>
                      <p className="text-md font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Fats</p>
                      <p className="text-md font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-tight">Fiber</p>
                      <p className="text-md font-black" style={{ color: MACRO_COLORS.fiber }}>{calculations.fiber}g</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex h-3 w-full rounded-full overflow-hidden shadow-inner bg-muted/20">
                      <div className="h-full transition-all" style={{ width: `${calculations.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} />
                      <div className="h-full transition-all" style={{ width: `${calculations.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} />
                      <div className="h-full transition-all" style={{ width: `${calculations.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} />
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      <span>{calculations.proteinPct}% Protein</span>
                      <span>{calculations.carbPct}% Carbs</span>
                      <span>{calculations.fatPct}% Fats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-0 border-t border-muted/10">
            <Button 
              onClick={handleEdit} 
              variant="ghost" 
              className="w-full h-14 rounded-none text-muted-foreground font-black uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all hover:bg-muted/5"
            >
              Edit Goal Parameters
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={handleHeaderBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">{hasExistingGoal ? "Edit Goal" : "Setup My Goal"}</h1>
      </div>

      <div className="flex items-center justify-between px-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step === i ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
              step > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {i}
            </div>
            {i < 4 && <div className={cn("h-0.5 flex-1 mx-2 rounded-full", step > i ? "bg-primary/20" : "bg-muted")} />}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/80">Body Metrics</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                    <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Age</Label>
                  <Input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value === "" ? "" : Math.min(100, parseInt(e.target.value) || 0).toString())} 
                    className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} 
                    className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} 
                    className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Activity Level</Label>
                <Select value={activity} onValueChange={(val: any) => setActivity(val)}>
                  <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
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
        )}

        {step === 2 && (
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/80">Objective</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {(['loss', 'maintain', 'gain'] as Objective[]).map((obj) => (
                    <button
                       key={obj}
                       onClick={() => setObjective(obj)}
                       className={cn(
                          "p-3 rounded-2xl border transition-all text-center",
                          objective === obj ? "border-primary bg-primary/5" : "border-muted/20"
                       )}
                    >
                       <p className={cn("text-[9px] font-bold uppercase tracking-widest", objective === obj ? "text-primary" : "text-muted-foreground")}>{obj}</p>
                    </button>
                 ))}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Target Weight (kg)</Label>
                <Input 
                   type="number" 
                   value={targetWeight} 
                   onChange={(e) => setTargetWeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} 
                   className={cn(
                      "rounded-xl h-11 text-xs font-bold",
                      !calculations.isWeightValid ? "border-destructive" : "border-muted-foreground/10 bg-background"
                   )} 
                />
                {!calculations.isWeightValid && (
                   <p className="text-[9px] font-bold text-destructive uppercase">
                      Invalid target weight for {objective}
                   </p>
                )}
              </div>

              {objective !== 'maintain' && (
                 <div className="space-y-4">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Weekly Rate</Label>
                    <div className="grid grid-cols-1 gap-2">
                       {[0.25, 0.5, 0.75, 1.0].map((rate) => {
                          const weeks = (calculations.weightDiff / rate).toFixed(1);
                          return (
                            <button
                               key={rate}
                               onClick={() => setWeeklyRate(rate as WeeklyRate)}
                               className={cn(
                                  "p-4 rounded-xl border transition-all text-left flex justify-between items-center",
                                  weeklyRate === rate ? "border-primary bg-primary/5" : "border-muted/20"
                               )}
                            >
                               <div className="flex-1">
                                  <p className="text-[11px] font-bold">{rate} kg / week</p>
                                  <p className="text-[9px] font-semibold text-muted-foreground uppercase">~{Math.round(rate * 1100)} kcal {objective === 'loss' ? 'deficit' : 'surplus'}</p>
                                  {rate === 1.0 && (
                                    <div className="mt-2 flex items-center gap-2 bg-destructive/10 p-2 rounded-lg border border-destructive/20 max-w-fit">
                                      <AlertTriangle className="w-3 h-3 text-destructive" />
                                      <span className="text-[9px] font-black uppercase text-destructive tracking-tighter">
                                        Consult doctor before {objective === 'loss' ? 'losing' : 'gaining'} 1kg / week
                                      </span>
                                    </div>
                                  )}
                               </div>
                               <div className="text-right">
                                  <p className="text-xs font-bold text-primary">{weeks} Weeks</p>
                                  <p className="text-[8px] font-semibold text-muted-foreground uppercase">Estimated</p>
                                </div>
                            </button>
                          );
                       })}
                    </div>
                 </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Settings2 className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/80">Fine-Tuning</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-3xl text-center space-y-1 border border-primary/10 shadow-inner">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Calculated Daily Intake</p>
                  <p className="text-4xl font-black">{calculations.finalCalories} <span className="text-xs text-muted-foreground">KCAL</span></p>
                </div>

                <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                  <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-widest">Real-time Macro Breakdown</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center space-y-0.5">
                      <p className="text-lg font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">Protein</p>
                      <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black">{calculations.proteinPct}%</Badge>
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-lg font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">Carbs</p>
                      <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black">{calculations.carbPct}%</Badge>
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-lg font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">Fats</p>
                      <Badge variant="secondary" className="text-[8px] h-3.5 py-0 px-1.5 opacity-60 font-black">{calculations.fatPct}%</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Adjust Calories</Label>
                      <Badge variant="secondary" className="text-[9px] font-bold">{calAdj[0] > 0 ? `+${calAdj[0]}` : calAdj[0]} kcal</Badge>
                  </div>
                  <Slider 
                    value={calAdj} 
                    onValueChange={setCalAdj} 
                    min={objective === 'loss' ? -1100 : 0} 
                    max={objective === 'gain' ? 1100 : 0} 
                    step={20} 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Protein Intensity</Label>
                      <Badge variant="secondary" className="text-[9px] font-bold">{protAdj[0]}g/kg</Badge>
                  </div>
                  <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={2.5} step={0.1} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Carb:Fat Ratio</Label>
                      <Badge variant="secondary" className="text-[9px] font-bold">{carbRatio[0]}:{100 - carbRatio[0]}</Badge>
                  </div>
                  <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/80">Review Strategy</h2>
              </div>

              <div className="space-y-6">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Weekly Pace</p>
                       <p className="text-sm font-bold uppercase">{calculations.derivedWeeklyRate} kg / week</p>
                     </div>
                     <div className="text-right space-y-0.5">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Estimated Time</p>
                        <p className="text-sm font-bold text-primary uppercase">{calculations.weeksToGoal} weeks</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                     <div className="bg-muted/10 p-4 rounded-2xl">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase">Budget</p>
                        <p className="text-lg font-bold text-primary">{calculations.finalCalories} kcal</p>
                     </div>
                     <div className="bg-muted/10 p-4 rounded-2xl">
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase">TDEE</p>
                        <p className="text-lg font-bold text-foreground/40">{calculations.tdee} kcal</p>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-5">
                    <p className="text-[10px] font-black uppercase text-center tracking-widest text-foreground/80">MACROS BREAKDOWN</p>
                    <div className="grid grid-cols-4 gap-2">
                       <div className="text-center">
                          <p className="text-sm font-black" style={{ color: MACRO_COLORS.protein }}>{calculations.protein}g</p>
                          <p className="text-[7px] font-bold text-muted-foreground uppercase">Protein</p>
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-black" style={{ color: MACRO_COLORS.carbs }}>{calculations.carbs}g</p>
                          <p className="text-[7px] font-bold text-muted-foreground uppercase">Carbs</p>
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-black" style={{ color: MACRO_COLORS.fat }}>{calculations.fats}g</p>
                          <p className="text-[7px] font-bold text-muted-foreground uppercase">Fats</p>
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-black" style={{ color: MACRO_COLORS.fiber }}>{calculations.fiber}g</p>
                          <p className="text-[7px] font-bold text-muted-foreground uppercase">Fiber</p>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex h-2 w-full rounded-full overflow-hidden">
                         <div style={{ width: `${calculations.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} />
                         <div style={{ width: `${calculations.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} />
                         <div style={{ width: `${calculations.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} />
                      </div>
                      <div className="flex justify-between text-[7px] font-semibold uppercase text-muted-foreground/40">
                         <span>{calculations.proteinPct}% Protein</span>
                         <span>{calculations.carbPct}% Carbs</span>
                         <span>{calculations.fatPct}% Fats</span>
                      </div>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 pt-2">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep} className="h-12 w-16 rounded-xl border-muted/30">
               <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep} 
              disabled={step === 2 && !calculations.isWeightValid}
              className="flex-1 h-12 rounded-xl bg-primary font-bold uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={savePlan} 
              className="flex-1 h-12 rounded-xl bg-primary font-bold uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20"
            >
              Save Goal Plan <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}