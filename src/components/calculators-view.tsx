"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Calculator, 
  Zap, 
  Flame,
  Info,
  Dumbbell,
  Scale
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type CalculatorType = 'bmr' | '1rm' | 'bodyfat';
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

interface CalculatorsViewProps {
  initialType?: CalculatorType;
  onBack: () => void;
}

export function CalculatorsView({ initialType = 'bmr', onBack }: CalculatorsViewProps) {
  const [activeTab, setActiveTab] = useState<CalculatorType>(initialType);

  // Shared state
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  // BMR state
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [bmrResults, setBmrResults] = useState<{ bmr: number; tdee: number } | null>(null);

  // 1RM state
  const [liftWeight, setLiftWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [ormResult, setOrmResult] = useState<number | null>(null);

  // Body Fat state
  const [waist, setWaist] = useState<string>("");
  const [neck, setNeck] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [bfResult, setBfResult] = useState<number | null>(null);

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType]);

  const calculateBmr = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    let bmrVal = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') bmrVal += 5;
    else bmrVal -= 161;

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9
    };
    const tdeeVal = bmrVal * activityMultipliers[activity];
    setBmrResults({ bmr: Math.round(bmrVal), tdee: Math.round(tdeeVal) });
  };

  const calculateOrm = () => {
    const w = parseFloat(liftWeight);
    const r = parseFloat(reps);
    if (isNaN(w) || isNaN(r)) return;
    // Epley Formula
    const result = w * (1 + (r / 30));
    setOrmResult(Math.round(result));
  };

  const calculateBf = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const wa = parseFloat(waist);
    const hi = parseFloat(hip);

    if (isNaN(h) || isNaN(n) || isNaN(wa)) return;

    let bf = 0;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (isNaN(hi)) return;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.221 * Math.log10(h)) - 450;
    }
    setBfResult(parseFloat(bf.toFixed(1)));
  };

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Performance Tools</h1>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as CalculatorType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-10 bg-white/50 p-1 rounded-xl shadow-sm border border-muted/10">
          <TabsTrigger value="bmr" className="text-[10px] font-black uppercase tracking-tight rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Energy</TabsTrigger>
          <TabsTrigger value="1rm" className="text-[10px] font-black uppercase tracking-tight rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Power</TabsTrigger>
          <TabsTrigger value="bodyfat" className="text-[10px] font-black uppercase tracking-tight rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="bmr" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Calculator className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">BMR & TDEE Calculator</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: Gender) => setGender(val)}>
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
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activity Level</Label>
                <Select value={activity} onValueChange={(val: ActivityLevel) => setActivity(val)}>
                  <SelectTrigger className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                    <SelectItem value="light">Lightly Active (1-2 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extreme">Extremely Active (Athlete)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateBmr} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2">Calculate Energy Needs</Button>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Energy Balance</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col items-center text-center space-y-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1">BMR</p>
                    <p className="text-xl font-black">{bmrResults ? bmrResults.bmr : '---'}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">KCAL/DAY</p>
                  </div>
                </div>
                <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex flex-col items-center text-center space-y-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest leading-none mb-1">TDEE</p>
                    <p className="text-xl font-black">{bmrResults ? bmrResults.tdee : '---'}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">KCAL/DAY</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1rm" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Dumbbell className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">1 Rep Max Calculator</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input type="number" value={liftWeight} onChange={(e) => setLiftWeight(e.target.value)} placeholder="Weight lifted" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reps</Label>
                  <Input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps performed" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <Button onClick={calculateOrm} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Calculate 1 Rep Max</Button>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Predicted Strength</h3>
              </div>
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 flex flex-col items-center text-center space-y-2">
                <Trophy className="w-6 h-6 text-primary mb-2" />
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] leading-none">Max Potential</p>
                <p className="text-4xl font-black text-foreground">{ormResult ? ormResult : '---'}<span className="text-sm ml-1 text-muted-foreground uppercase">kg</span></p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">Calculated using Epley formula</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bodyfat" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Body Fat Calculator</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: Gender) => setGender(val)}>
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
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neck (cm)</Label>
                  <Input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="Neck" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Waist (cm)</Label>
                  <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="Waist" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                </div>
                {gender === 'female' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hip (cm)</Label>
                    <Input type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="Hip" className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold" />
                  </div>
                )}
              </div>
              <Button onClick={calculateBf} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Calculate Body Fat</Button>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Body Composition</h3>
              </div>
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 flex flex-col items-center text-center space-y-2">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] leading-none">Body Fat %</p>
                <p className="text-4xl font-black text-foreground">{bfResult !== null ? bfResult : '---'}<span className="text-sm ml-1 text-muted-foreground uppercase">%</span></p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">U.S. Navy Method</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Trophy } from 'lucide-react';
