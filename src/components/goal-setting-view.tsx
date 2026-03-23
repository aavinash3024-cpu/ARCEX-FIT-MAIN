
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Activity, 
  Scale, 
  Zap,
  Flame,
  CheckCircle2,
  Settings2,
  Sparkles,
  Info
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
}

export function GoalSettingView({ onBack }: GoalSettingViewProps) {
  const [step, setStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  // Step 1: Metrics
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>("25");
  const [weight, setWeight] = useState<string>("75");
  const [height, setHeight] = useState<string>("175");
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // Step 2: Objectives
  const [objective, setObjective] = useState<Objective>('loss');
  const [targetWeight, setTargetWeight] = useState<string>("70");
  const [weeklyRate, setWeeklyRate] = useState<WeeklyRate>(0.5);

  // Step 3: Macros & Adjustments
  const [calAdj, setCalAdj] = useState([0]); // +/- from target
  const [protAdj, setProtAdj] = useState([1.8]); // g per kg
  const [carbRatio, setCarbRatio] = useState([50]); // % of remaining calories

  // Calculations
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

    // Objective calories
    let baseTarget = tdee;
    if (objective === 'loss') baseTarget -= (weeklyRate * 1100); // Rough estimate 7700kcal per kg
    if (objective === 'gain') baseTarget += (weeklyRate * 1100);

    const finalCalories = Math.round(baseTarget + calAdj[0]);
    
    // Macros
    const proteinGrams = Math.round(w * protAdj[0]);
    const proteinKcal = proteinGrams * 4;
    
    const remainingKcal = finalCalories - proteinKcal;
    const carbKcal = remainingKcal * (carbRatio[0] / 100);
    const fatKcal = remainingKcal - carbKcal;

    return {
      tdee,
      finalCalories,
      protein: proteinGrams,
      carbs: Math.round(carbKcal / 4),
      fats: Math.round(fatKcal / 9),
      isWeightValid: objective === 'gain' ? tw > w : objective === 'loss' ? tw < w : tw === w
    };
  }, [weight, height, age, gender, activity, objective, targetWeight, weeklyRate, calAdj, protAdj, carbRatio]);

  const nextStep = () => {
    if (step === 2 && !calculations.isWeightValid) return;
    setStep(s => s + 1);
  };
  
  const prevStep = () => setStep(s => s - 1);

  const savePlan = () => {
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <div className="space-y-6 pt-10 pb-24 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Plan Active</h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">PulseFlow AI calibrated</p>
        </div>

        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-muted/20 pb-4">
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Objective</p>
                  <p className="text-lg font-black text-foreground uppercase tracking-tight">{objective} Weight</p>
               </div>
               <Badge className="bg-primary text-white font-black h-6">{targetWeight} kg</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-muted/10 p-4 rounded-2xl space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Daily Target</p>
                  <p className="text-2xl font-black text-primary">{calculations.finalCalories} <span className="text-[10px] text-muted-foreground">KCAL</span></p>
               </div>
               <div className="bg-muted/10 p-4 rounded-2xl space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Protein Goal</p>
                  <p className="text-2xl font-black text-accent">{calculations.protein} <span className="text-[10px] text-muted-foreground">G</span></p>
               </div>
            </div>

            <div className="space-y-3">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Macro Split</p>
               <div className="flex h-3 w-full rounded-full overflow-hidden shadow-inner">
                  <div className="bg-primary" style={{ width: `${(calculations.carbs*4/calculations.finalCalories)*100}%` }} />
                  <div className="bg-accent" style={{ width: `${(calculations.protein*4/calculations.finalCalories)*100}%` }} />
                  <div className="bg-yellow-400" style={{ width: `${(calculations.fats*9/calculations.finalCalories)*100}%` }} />
               </div>
               <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground/60">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Carbs {calculations.carbs}g</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Prot {calculations.protein}g</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Fat {calculations.fats}g</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
           <Button onClick={() => setIsSaved(false)} variant="outline" className="w-full h-12 rounded-xl border-muted/30 font-black uppercase text-[10px] tracking-widest">Edit Plan</Button>
           <Button onClick={onBack} className="w-full h-12 rounded-xl bg-primary font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Setup My Goal</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
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
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Step 1: Body Metrics</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                    <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Age (Years)</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activity Level</Label>
                <Select value={activity} onValueChange={(val: any) => setActivity(val)}>
                  <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
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
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Step 2: Objective</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {(['loss', 'maintain', 'gain'] as Objective[]).map((obj) => (
                    <button
                       key={obj}
                       onClick={() => setObjective(obj)}
                       className={cn(
                          "p-3 rounded-2xl border transition-all text-center space-y-1",
                          objective === obj ? "border-primary bg-primary/5 shadow-sm" : "border-muted/20 hover:border-muted/40"
                       )}
                    >
                       <p className={cn("text-[9px] font-black uppercase tracking-widest", objective === obj ? "text-primary" : "text-muted-foreground")}>{obj}</p>
                    </button>
                 ))}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Weight (kg)</Label>
                <Input 
                   type="number" 
                   value={targetWeight} 
                   onChange={(e) => setTargetWeight(e.target.value)} 
                   className={cn(
                      "rounded-xl h-11 text-xs font-bold",
                      !calculations.isWeightValid ? "border-destructive focus-visible:ring-destructive" : "border-muted-foreground/10 bg-muted/5"
                   )} 
                />
                {!calculations.isWeightValid && (
                   <p className="text-[9px] font-bold text-destructive uppercase tracking-tight">
                      Target weight must be {objective === 'gain' ? 'higher' : objective === 'loss' ? 'lower' : 'equal'} for {objective}
                   </p>
                )}
              </div>

              {objective !== 'maintain' && (
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weekly Rate</Label>
                    <div className="grid grid-cols-2 gap-2">
                       {[0.25, 0.5, 0.75, 1.0].map((rate) => (
                          <button
                             key={rate}
                             onClick={() => setWeeklyRate(rate as WeeklyRate)}
                             className={cn(
                                "p-3 rounded-xl border transition-all text-left",
                                weeklyRate === rate ? "border-primary bg-primary/5" : "border-muted/20"
                             )}
                          >
                             <p className="text-[10px] font-black text-foreground">{rate} kg <span className="text-[8px] text-muted-foreground">/wk</span></p>
                             <p className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5">
                                ~{Math.round(rate * 1100)} kcal/day delta
                             </p>
                          </button>
                       ))}
                    </div>
                 </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Settings2 className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Step 3: Fine-Tuning</h2>
              </div>

              <div className="bg-primary/5 p-5 rounded-3xl text-center space-y-1">
                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Calculated Intake</p>
                 <p className="text-4xl font-black">{calculations.finalCalories} <span className="text-xs text-muted-foreground">KCAL</span></p>
              </div>

              {/* Calories Shifter */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Calories Adjustment</Label>
                    <Badge variant="secondary" className="text-[9px] font-black">{calAdj[0] > 0 ? '+' : ''}{calAdj[0]} kcal</Badge>
                 </div>
                 <Slider value={calAdj} onValueChange={setCalAdj} min={-500} max={500} step={20} className="py-2" />
                 <p className="text-[9px] text-muted-foreground font-bold uppercase text-center">Adjust total daily intake manually</p>
              </div>

              {/* Protein Shifter */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protein Intensity</Label>
                    <Badge variant="secondary" className="text-[9px] font-black">{protAdj[0]}g / kg</Badge>
                 </div>
                 <Slider value={protAdj} onValueChange={setProtAdj} min={1.2} max={2.5} step={0.1} className="py-2" />
                 <p className="text-[9px] text-muted-foreground font-bold uppercase text-center">Current: {calculations.protein}g Daily</p>
              </div>

              {/* Carbs/Fat Shifter */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carbs / Fat Ratio</Label>
                    <Badge variant="secondary" className="text-[9px] font-black">{carbRatio[0]}% Carbs</Badge>
                 </div>
                 <Slider value={carbRatio} onValueChange={setCarbRatio} min={20} max={80} step={5} className="py-2" />
                 <div className="flex justify-between text-[9px] font-black text-muted-foreground/60 uppercase">
                    <span>Higher Fat</span>
                    <span>Balanced</span>
                    <span>Higher Carbs</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Step 4: Review Plan</h2>
              </div>

              <div className="space-y-4">
                 <div className="bg-muted/10 p-4 rounded-2xl flex justify-between items-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Goal</p>
                    <p className="text-sm font-black uppercase">{objective} To {targetWeight} kg</p>
                 </div>

                 <div className="bg-muted/10 p-4 rounded-2xl flex justify-between items-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Daily Budget</p>
                    <p className="text-sm font-black text-primary">{calculations.finalCalories} kcal</p>
                 </div>

                 <div className="rounded-2xl border border-muted/20 p-4 space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase text-center">Recommended Breakdown</p>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="text-center">
                          <p className="text-lg font-black">{calculations.protein}g</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">Protein</p>
                       </div>
                       <div className="text-center">
                          <p className="text-lg font-black">{calculations.carbs}g</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">Carbs</p>
                       </div>
                       <div className="text-center">
                          <p className="text-lg font-black">{calculations.fats}g</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">Fats</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-accent/5 p-4 rounded-2xl flex gap-3 items-start border border-accent/10">
                    <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-[10px] text-accent font-bold uppercase leading-tight">
                       This plan is based on your TDEE ({calculations.tdee} kcal). Consistent tracking is key to reaching {targetWeight}kg.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons - Attached directly to step cards flow */}
        <div className="flex gap-4 pt-2">
          {step > 1 && (
            <Button 
               variant="outline" 
               onClick={prevStep} 
               className="h-12 w-16 rounded-xl border-muted/30"
            >
               <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep} 
              disabled={step === 2 && !calculations.isWeightValid}
              className="flex-1 h-12 rounded-xl bg-primary font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={savePlan} 
              className="flex-1 h-12 rounded-xl bg-primary font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20"
            >
              Save Goal Plan <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
