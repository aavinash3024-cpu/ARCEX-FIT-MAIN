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
  Activity,
  User,
  Info
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

export function CalculatorsView({ onBack }: { onBack: () => void }) {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const [results, setResults] = useState<{ bmr: number; tdee: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    // Mifflin-St Jeor Equation
    let bmrVal = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') {
      bmrVal += 5;
    } else {
      bmrVal -= 161;
    }

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9
    };

    const tdeeVal = bmrVal * activityMultipliers[activity];

    setResults({
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal)
    });
  };

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Performance Tools</h1>
      </div>

      {/* Calculator Card */}
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-muted/20">
            <Calculator className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">BMR & TDEE Calculator</h2>
          </div>

          <div className="space-y-4">
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
                <Input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight (kg)</Label>
                <Input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Height (cm)</Label>
                <Input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="rounded-xl border-muted-foreground/10 bg-muted/5 h-11 text-xs font-bold"
                />
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

            <Button 
              onClick={calculate}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
            >
              Calculate Energy Needs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && (
        <Card className="border-none shadow-lg bg-white overflow-hidden animate-in zoom-in-95 duration-300">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Your Energy Balance</h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">estimated daily requirements</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col items-center text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1">BMR</p>
                  <p className="text-xl font-black text-foreground">{results.bmr}</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">KCAL/DAY</p>
                </div>
              </div>

              <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex flex-col items-center text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-accent uppercase tracking-widest leading-none mb-1">TDEE</p>
                  <p className="text-xl font-black text-foreground">{results.tdee}</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">KCAL/DAY</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl border border-muted/10">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-foreground uppercase tracking-tight">What do these mean?</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground/70">BMR:</span> Calories your body burns at rest just to stay alive.<br/>
                    <span className="font-bold text-foreground/70">TDEE:</span> Total calories you burn daily including all activity.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary text-primary-foreground space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Maintenance Goal</p>
                <p className="text-xs font-bold">To maintain your weight, consume approximately {results.tdee} kcal per day.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}