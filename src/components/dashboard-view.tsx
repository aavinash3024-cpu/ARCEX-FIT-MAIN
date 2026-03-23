import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Droplets, 
  CheckCircle2, 
  Footprints, 
  Target,
  ChevronRight,
  Brain,
  Zap,
  Leaf,
  Sparkles
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardView() {
  const bmr = 1600;
  const tdee = 2500;
  const currentCal = 1840;
  const targetCal = 2200;

  const metrics = [
    { 
      label: "Calories", 
      value: currentCal.toLocaleString(), 
      unit: "kcal", 
      target: targetCal.toLocaleString(), 
      icon: <Flame className="w-4 h-4 text-orange-500" />, 
      color: "bg-orange-50" 
    },
    { 
      label: "Hydration", 
      value: "1.8", 
      unit: "L", 
      target: "3.0", 
      icon: <Droplets className="w-4 h-4 text-sky-500" />, 
      color: "bg-sky-50" 
    },
    { 
      label: "Steps", 
      value: "8,432", 
      unit: "steps", 
      target: "10,000", 
      icon: <Footprints className="w-4 h-4 text-green-500" />, 
      color: "bg-green-50" 
    },
  ];

  const nutrients = [
    { label: "Carbs", current: 185, target: 250, unit: "g", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: "Protein", current: 120, target: 150, unit: "g", icon: <Target className="w-4 h-4 text-blue-500" /> },
    { label: "Fat", current: 52, target: 70, unit: "g", icon: <Flame className="w-4 h-4 text-red-400" /> },
    { label: "Fiber", current: 22, target: 35, unit: "g", icon: <Leaf className="w-4 h-4 text-emerald-500" /> },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Your Personal Guide - AI Suggestion Banner */}
      <Card className="border-none bg-gradient-to-br from-primary/90 to-primary text-primary-foreground overflow-hidden shadow-md">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm flex items-center gap-2">
              Your Personal Guide
              <Badge variant="outline" className="text-[9px] h-4 border-white/20 text-white font-normal uppercase tracking-tighter">AI Pulse</Badge>
            </h3>
            <p className="text-xs opacity-90 leading-relaxed">Increase protein by 15g today to support muscle recovery from yesterday's heavy lifting session.</p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-headline">Daily Overview</h2>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center">
            View all <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>

        {/* Metrics Belt - Compacted Height */}
        <div className="flex gap-3 overflow-x-auto pb-2 swipe-container">
          {metrics.map((m, idx) => {
            const currentVal = parseFloat(m.value.replace(',', ''));
            const targetVal = parseFloat(m.target.replace(',', ''));
            const percentage = Math.round((currentVal / targetVal) * 100);
            const isCalories = m.label === "Calories";

            return (
              <Card key={idx} className="min-w-[160px] flex-shrink-0 border-none shadow-sm glass-card">
                <CardContent className="p-3 flex flex-col justify-between h-32">
                  <div className="flex justify-between items-center">
                    <div className={`p-1.5 rounded-lg ${m.color}`}>
                      {m.icon}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{percentage}%</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-0.5">{m.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold">{m.value}</span>
                        <span className="text-[9px] text-muted-foreground font-medium">{m.unit}</span>
                      </div>
                    </div>

                    <div className="relative h-4 flex items-center">
                      <Progress value={Math.min(percentage, 100)} className="h-1.5 w-full" />
                      
                      {isCalories && (
                        <>
                          {/* BMR Marker */}
                          <div 
                            className="absolute top-0 h-4 w-[1px] bg-destructive/40" 
                            style={{ left: `${(bmr / targetVal) * 100}%` }}
                          />
                          {/* TDEE Marker */}
                          <div 
                            className="absolute top-0 h-4 w-[1px] bg-accent/60" 
                            style={{ left: `${Math.min((tdee / targetVal) * 100, 100)}%` }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integrated Macros Breakdown */}
        <Card className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Nutrient Tracking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {nutrients.map((n, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5">
                      {n.icon}
                      <span className="font-bold text-muted-foreground uppercase">{n.label}</span>
                    </div>
                    <span className="text-muted-foreground font-mono font-medium">
                      {n.current}/{n.target}{n.unit}
                    </span>
                  </div>
                  <Progress value={(n.current / n.target) * 100} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Weekly Progress & Goals */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Weight Goal
              </h3>
              <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0">LOSS</Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span>Journey to 75.0 kg</span>
                <span className="text-primary font-bold">78.5 kg</span>
              </div>
              <Progress value={65} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Current Weight</p>
                <p className="text-xl font-bold">78.5 <span className="text-xs font-normal opacity-60">kg</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-bold flex items-center justify-end">-0.4 kg</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase">vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
