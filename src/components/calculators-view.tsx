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
  Dumbbell,
  Scale,
  Trophy,
  Activity,
  Info,
  CircleHelp,
  AlertTriangle,
  TrendingUp
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

type CalculatorType = 'bmr' | '1rm' | 'bodyfat';
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

interface CalculatorsViewProps {
  initialType?: CalculatorType;
  onBack: () => void;
}

export function CalculatorsView({ initialType = 'bmr', onBack }: CalculatorsViewProps) {
  const [activeTab, setActiveTab] = useState<CalculatorType>(initialType);

  // Shared inputs
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  // BMR results
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [bmrResults, setBmrResults] = useState<{ bmr: number; tdee: number } | null>(null);

  // 1RM inputs & results
  const [liftWeight, setLiftWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [ormResult, setOrmResult] = useState<number | null>(null);

  // Body Fat inputs & results
  const [waist, setWaist] = useState<string>("");
  const [neck, setNeck] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [bfResults, setBfResults] = useState<{ percentage: number; lbm: number; category: string } | null>(null);

  // Scroll to top on tab change
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

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
    const result = w * (1 + (r / 30)); // Epley formula
    setOrmResult(Math.round(result));
  };

  const calculateBf = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const wa = parseFloat(waist);
    const hi = parseFloat(hip);

    if (isNaN(h) || isNaN(n) || isNaN(wa) || isNaN(w)) return;

    let bf = 0;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (isNaN(hi)) return;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.221 * Math.log10(h)) - 450;
    }

    const percentage = parseFloat(bf.toFixed(1));
    const lbm = parseFloat((w * (1 - percentage / 100)).toFixed(1));
    
    let category = "Unknown";
    if (gender === 'male') {
      if (percentage < 6) category = "Essential Fat";
      else if (percentage < 14) category = "Athlete";
      else if (percentage < 18) category = "Fitness";
      else if (percentage < 25) category = "Average";
      else category = "Obese";
    } else {
      if (percentage < 14) category = "Essential Fat";
      else if (percentage < 21) category = "Athlete";
      else if (percentage < 25) category = "Fitness";
      else if (percentage < 32) category = "Average";
      else category = "Obese";
    }

    setBfResults({ percentage, lbm, category });
  };

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Performance Tools</h1>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as CalculatorType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-11 bg-muted/50 p-1 rounded-2xl shadow-inner border border-muted/20">
          <TabsTrigger value="bmr" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">BMR / TDEE</TabsTrigger>
          <TabsTrigger value="1rm" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">1 Rep Max</TabsTrigger>
          <TabsTrigger value="bodyfat" className="text-[10px] font-black uppercase tracking-tight rounded-xl data-[state=active]:bg-[#fcfcfc] data-[state=active]:text-black data-[state=active]:shadow-sm">Body Fat %</TabsTrigger>
        </TabsList>

        <TabsContent value="bmr" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Calculator className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Input Metrics</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: Gender) => setGender(val)}>
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
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Age (Years)</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Math.min(100, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activity Level</Label>
                <Select value={activity} onValueChange={(val: ActivityLevel) => setActivity(val)}>
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
              <Button onClick={calculateBmr} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Calculate Energy</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card overflow-hidden rounded-3xl border border-muted/10">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">ENERGY BALANCE</h3>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">ESTIMATED DAILY REQUIREMENTS</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/10 p-5 rounded-3xl border border-muted/20 flex flex-col items-center text-center space-y-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm relative z-10 border border-muted/20">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest relative z-10">BMR</p>
                  <p className="text-3xl font-black relative z-10">{bmrResults ? bmrResults.bmr : '---'}</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter relative z-10">KCAL/DAY</p>
                </div>
                <div className="bg-muted/10 p-5 rounded-3xl border border-muted/20 flex flex-col items-center text-center space-y-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm relative z-10 border border-muted/20">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest relative z-10">TDEE</p>
                  <p className="text-3xl font-black relative z-10">{bmrResults ? bmrResults.tdee : '---'}</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter relative z-10">KCAL/DAY</p>
                </div>
              </div>

              <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10 space-y-3">
                <div className="flex items-start gap-3">
                  <CircleHelp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-foreground/80">TECHNICAL DEFINITIONS</p>
                    <div className="space-y-2">
                      <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                        <span className="font-bold text-foreground/70 uppercase">Basal Metabolic Rate:</span> The minimum calories required to maintain life at rest.
                      </p>
                      <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                        <span className="font-bold text-foreground/70 uppercase">Total Daily Energy Expenditure:</span> BMR plus physical activity impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {bmrResults && (
                <div className="bg-[#6b85a3] p-5 rounded-2xl text-white shadow-xl shadow-[#6b85a3]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flame className="w-16 h-16" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">MAINTENANCE GOAL</p>
                    <p className="text-xs font-bold leading-relaxed">
                      Consume <span className="text-base font-black px-1">{bmrResults.tdee}</span> calories per day to maintain your current weight and metabolic health.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1rm" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Dumbbell className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Strength Estimator</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight Lifted (kg)</Label>
                  <Input type="number" value={liftWeight} onChange={(e) => setLiftWeight(e.target.value === "" ? "" : Math.min(1000, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reps</Label>
                  <Input type="number" value={reps} onChange={(e) => setReps(e.target.value === "" ? "" : Math.min(1000, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
              </div>
              <Button onClick={calculateOrm} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Calculate Max</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card overflow-hidden rounded-3xl border border-muted/10">
            <CardContent className="p-5 space-y-6">
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center text-center space-y-1.5 relative overflow-hidden shadow-inner">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <Trophy className="w-8 h-8 text-primary mb-1 drop-shadow-sm" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Estimated 1 Rep Max</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-black text-foreground tracking-tighter">{ormResult ? ormResult : '---'}</p>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">kg</span>
                </div>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[9px] text-amber-800 font-bold leading-tight uppercase tracking-tight">
                  HEAVY LOAD WARNING: Personal records should always be attempted with a spotter or in a power rack with safety pins engaged.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Calculated Intensity Table
                  </h4>
                  <Badge variant="outline" className="text-[8px] h-4 font-black uppercase opacity-60">Epley Formula</Badge>
                </div>
                <div className="rounded-2xl border border-muted/20 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-b-muted/10">
                        <TableHead className="h-9 text-[8px] font-black uppercase text-center border-r border-muted/10">Reps</TableHead>
                        <TableHead className="h-9 text-[8px] font-black uppercase text-center border-r border-muted/10">Intensity</TableHead>
                        <TableHead className="h-9 text-[8px] font-black uppercase text-center">Load (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[2, 4, 6, 8, 10, 12].map((repCount) => {
                        const intensity = 1 / (1 + (repCount / 30));
                        const weightForReps = ormResult ? ormResult * intensity : null;
                        return (
                          <TableRow key={repCount} className="hover:bg-muted/5 border-b-muted/5 last:border-0 h-10">
                            <TableCell className="py-0 text-[10px] font-bold text-center border-r border-muted/5">{repCount}</TableCell>
                            <TableCell className="py-0 text-[10px] font-black text-center border-r border-muted/5 text-muted-foreground/60">
                              {Math.round(intensity * 100)}%
                            </TableCell>
                            <TableCell className="py-0 text-[11px] font-black text-center text-primary">
                              {weightForReps ? `${Math.round(weightForReps)}` : '---'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bodyfat" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Anthropometric Data</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={(val: Gender) => setGender(val)}>
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
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neck (cm)</Label>
                  <Input type="number" value={neck} onChange={(e) => setNeck(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Waist (cm)</Label>
                  <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                </div>
                {gender === 'female' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hip (cm)</Label>
                    <Input type="number" value={hip} onChange={(e) => setHip(e.target.value === "" ? "" : Math.min(500, parseInt(e.target.value) || 0).toString())} placeholder="0" className="rounded-xl border-muted-foreground/10 bg-background h-11 text-xs font-bold" />
                  </div>
                )}
              </div>
              <Button onClick={calculateBf} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Analyze Composition</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card overflow-hidden rounded-3xl border border-muted/10">
            <CardContent className="p-5 space-y-6">
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center text-center space-y-1 relative overflow-hidden shadow-inner">
                <Activity className="absolute -right-4 -top-4 w-20 h-20 text-primary/10 -rotate-12" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Body Fat Percentage</p>
                <div className="flex items-baseline gap-1 relative z-10">
                  <p className="text-5xl font-black text-foreground tracking-tighter">{bfResults ? bfResults.percentage : '---'}</p>
                  <span className="text-base font-bold text-muted-foreground tracking-tighter">%</span>
                </div>
                {bfResults && <Badge className="bg-primary text-white font-black uppercase tracking-tighter text-[9px] mt-2 h-6 px-3 shadow-md">{bfResults.category}</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/10 p-5 rounded-3xl border border-muted/20 text-center space-y-1.5 group">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mb-1" />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Lean Mass</p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <p className="text-2xl font-black">{bfResults ? bfResults.lbm : '---'}</p>
                    <span className="text-[10px] font-bold text-muted-foreground">KG</span>
                  </div>
                </div>
                <div className="bg-muted/10 p-5 rounded-3xl border border-muted/20 text-center space-y-1.5 group">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mx-auto mb-1" />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fat Mass</p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <p className="text-2xl font-black">{bfResults && weight ? (parseFloat(weight) - bfResults.lbm).toFixed(1) : '---'}</p>
                    <span className="text-[10px] font-bold text-muted-foreground">KG</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex items-start gap-3">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-accent/80 font-bold leading-relaxed uppercase tracking-tight">
                  Calculation Method: U.S. Navy Body Fat Formula. This represents an estimate based on circumferential measurements and height.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
