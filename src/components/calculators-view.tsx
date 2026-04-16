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
  AlertTriangle,
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
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>("75");
  const [height, setHeight] = useState<string>("175");

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

  // STABLE SCROLL RESET
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
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
          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl">
            <CardContent className="p-5 space-y-6">
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

          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl border border-muted/10">
            <CardContent className="p-6 space-y-6">
              <div className="text-left space-y-1">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">ENERGY BALANCE</h3>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">ESTIMATED DAILY REQUIREMENTS</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm border border-orange-500/20">
                        <Flame className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Basal Metabolism (BMR)</p>
                        <p className="text-xl font-black">{bmrResults ? bmrResults.bmr : '---'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black border-orange-500/20 text-orange-600 bg-white">KCAL/DAY</Badge>
                  </div>
                  <div className="bg-orange-500/10 p-2 rounded-lg">
                    <p className="text-[8px] font-bold text-orange-800 leading-tight uppercase">
                      What it means: The calories your body burns at absolute rest to maintain vital functions like breathing and heartbeat.
                    </p>
                  </div>
                </div>
                
                <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm border border-sky-500/20">
                        <Zap className="w-4 h-4 text-sky-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Expenditure (TDEE)</p>
                        <p className="text-xl font-black">{bmrResults ? bmrResults.tdee : '---'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black border-sky-500/20 text-sky-600 bg-white">KCAL/DAY</Badge>
                  </div>
                  <div className="bg-sky-500/10 p-2 rounded-lg">
                    <p className="text-[8px] font-bold text-sky-800 leading-tight uppercase">
                      What it means: Your "Maintenance Calories." The total energy you burn daily including exercise and digestion.
                    </p>
                  </div>
                </div>
              </div>

              {bmrResults && (
                <div className="bg-[#6b85a3] p-4 rounded-xl text-white shadow-lg shadow-[#6b85a3]/10 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <p className="text-[10px] font-bold leading-tight">
                      <span className="block text-[8px] font-black uppercase opacity-60 mb-0.5">MAINTENANCE STRATEGY</span>
                      Consume {bmrResults.tdee} kcal to maintain weight.
                    </p>
                    <Flame className="w-5 h-5 opacity-40" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1rm" className="space-y-4 pt-4">
          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl">
            <CardContent className="p-5 space-y-6">
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

          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl border border-muted/10">
            <CardContent className="p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Estimated 1 Rep Max</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-foreground tracking-tighter">{ormResult ? ormResult : '---'}</p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">kg</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="bg-orange-600/10 p-4 rounded-xl border border-orange-600/20 flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-[9px] font-black text-orange-900 leading-relaxed uppercase tracking-tighter">
                  PRECAUTION: Do not attempt to test your actual 1RM without a qualified spotter or safety bars. These calculations are estimates based on sub-maximal loads.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> INTENSITY MATRIX
                  </h4>
                </div>
                <div className="rounded-xl border border-muted/20 overflow-hidden bg-muted/5">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="hover:bg-transparent border-b-muted/10">
                        <TableHead className="h-8 text-[7px] font-black uppercase text-center border-r border-muted/10">Reps</TableHead>
                        <TableHead className="h-8 text-[7px] font-black uppercase text-center border-r border-muted/10">Intensity</TableHead>
                        <TableHead className="h-8 text-[7px] font-black uppercase text-center">Load (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[2, 4, 6, 8, 10].map((repCount) => {
                        const intensity = 1 / (1 + (repCount / 30));
                        const weightForReps = ormResult ? ormResult * intensity : null;
                        return (
                          <TableRow key={repCount} className="hover:bg-muted/5 border-b-muted/5 last:border-0 h-9">
                            <TableCell className="py-0 text-[10px] font-bold text-center border-r border-muted/5">{repCount}</TableCell>
                            <TableCell className="py-0 text-[10px] font-black text-center border-r border-muted/5 text-muted-foreground/50">
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
          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl">
            <CardContent className="p-5 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
                <Scale className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Body Composition</h2>
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

          <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl border border-muted/10">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Body Fat Percentage</p>
                  <div className="flex items-baseline gap-1 relative z-10">
                    <p className="text-4xl font-black text-foreground tracking-tighter">{bfResults ? bfResults.percentage : '---'}</p>
                    <span className="text-[10px] font-bold text-muted-foreground tracking-tighter">%</span>
                  </div>
                </div>
                {bfResults && <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-tighter text-[8px] h-5 px-2 rounded-lg">{bfResults.category}</Badge>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/5 border border-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <div>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Lean Mass</p>
                      <p className="text-sm font-black">{bfResults ? bfResults.lbm : '---'} <span className="text-[9px] text-muted-foreground">KG</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Fat Mass</p>
                      <p className="text-sm font-black text-orange-600">{bfResults && weight ? (parseFloat(weight) - bfResults.lbm).toFixed(1) : '---'} <span className="text-[9px] text-muted-foreground">KG</span></p>
                    </div>
                    <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
                  </div>
                </div>
                
                <div className="bg-accent/5 p-3 rounded-xl border border-accent/10 flex items-start gap-3">
                  <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <p className="text-[9px] text-accent/70 font-bold uppercase tracking-tight">
                    Navy Method: Estimated based on circumference measurements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
