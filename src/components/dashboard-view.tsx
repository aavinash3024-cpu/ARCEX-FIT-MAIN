import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Droplets, 
  Footprints, 
  Target,
  ChevronRight,
  Zap,
  Sparkles,
  Calculator,
  TrendingDown,
  Scale,
  ArrowUpRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';

const weightData = [
  { day: 'Mon', weight: 79.5 },
  { day: 'Tue', weight: 79.2 },
  { day: 'Wed', weight: 78.8 },
  { day: 'Thu', weight: 78.9 },
  { day: 'Fri', weight: 78.5 },
];

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
      label: "Streak", 
      value: "12", 
      unit: "days", 
      target: "15", 
      icon: <Zap className="w-4 h-4 text-yellow-500" />, 
      color: "bg-yellow-50" 
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
    { label: "Carbs", current: 185, target: 250, unit: "g" },
    { label: "Protein", current: 120, target: 150, unit: "g" },
    { label: "Fat", current: 52, target: 70, unit: "g" },
    { label: "Fiber", current: 22, target: 35, unit: "g" },
  ];

  const calculators = [
    { label: "1 Rep Max", description: "Power" },
    { label: "Body Fat %", description: "Body" },
    { label: "BMR / TDEE", description: "Energy" },
  ];

  return (
    <div className="space-y-6 pb-24 pt-8">
      {/* 1. Personal Guide - AI Suggestion Banner */}
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

      {/* 2. Daily Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-headline">Daily Overview</h2>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center">
            SWIPE TO SEE <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>

        {/* Metrics Belt */}
        <div className="flex gap-3 overflow-x-auto pb-2 swipe-container">
          {metrics.map((m, idx) => {
            const currentVal = parseFloat(m.value.replace(',', ''));
            const targetVal = parseFloat(m.target.replace(',', ''));
            const percentage = Math.round((currentVal / targetVal) * 100);
            const isCalories = m.label === "Calories";

            return (
              <Card key={idx} className="min-w-[150px] flex-shrink-0 border-none shadow-sm glass-card">
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
                          <div 
                            className="absolute top-0 h-4 w-[1px] bg-destructive/40" 
                            style={{ left: `${(bmr / targetVal) * 100}%` }}
                          />
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
      </section>

      {/* 3. Nutrient Tracking (Macros Card) */}
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
                  <span className="font-bold text-muted-foreground uppercase">{n.label}</span>
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

      {/* 4. Goal Milestone Card */}
      <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Next Goal Milestone</p>
            <h4 className="font-bold text-lg">Reach 77.0 kg</h4>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">45%</span>
              <ArrowUpRight className="w-5 h-5 text-accent" />
            </div>
            <p className="text-[9px] font-bold uppercase opacity-60">1.5kg remaining</p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Weight & Performance Tools (Swipeable) */}
      <div className="flex gap-3 overflow-x-auto pb-4 swipe-container">
        {/* Weight Card with Graph */}
        <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm glass-card overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Scale className="w-3 h-3 text-primary" /> Current Weight
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">78.5</span>
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-none px-2 py-0.5 gap-1 text-[10px]">
                <TrendingDown className="w-3 h-3" /> -0.4kg
              </Badge>
            </div>
            
            <div className="h-16 w-full -mx-4 -mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Calculators Card */}
        <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm glass-card">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Calculator className="w-3 h-3 text-primary" /> Performance Tools
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {calculators.map((calc, idx) => (
                <button 
                  key={idx} 
                  className="p-2 bg-primary/5 rounded-xl text-center hover:bg-primary/10 transition-colors border border-primary/10"
                >
                  <p className="text-[9px] font-black uppercase text-primary leading-tight">{calc.label}</p>
                  <p className="text-[7px] font-bold text-muted-foreground/60 uppercase">{calc.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
