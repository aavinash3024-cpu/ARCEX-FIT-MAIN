"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Minus, 
  Pencil, 
  ChevronLeft, 
  Droplets,
  Sparkles,
  TrendingUp,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const historyData = [
  { day: 'Mon', amount: 2.4 },
  { day: 'Tue', amount: 3.1 },
  { day: 'Wed', amount: 1.8 },
  { day: 'Thu', amount: 2.8 },
  { day: 'Fri', amount: 2.2 },
  { day: 'Sat', amount: 3.2 },
  { day: 'Sun', amount: 1.8 },
];

interface HydrationViewProps {
  onBack: () => void;
}

export function HydrationView({ onBack }: HydrationViewProps) {
  const [currentMl, setCurrentMl] = useState(1800);
  const [targetMl, setTargetMl] = useState(3000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetMl);

  const percentage = Math.min(Math.round((currentMl / targetMl) * 100), 100);

  const handleUpdateTarget = () => {
    setTargetMl(tempTarget);
    setIsEditing(false);
  };

  const addWater = (amount: number) => {
    setCurrentMl(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Hydration Tracker</h1>
      </div>

      {/* The Interactive Glass Card */}
      <Card className="border-none shadow-md overflow-hidden bg-white relative">
        <CardContent className="p-6 flex flex-col items-center relative">
          
          {/* Top Row: Center Title, Right Pencil */}
          <div className="w-full flex justify-center items-center mb-8 relative">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Daily Progress
            </h3>
            
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/30 text-muted-foreground absolute right-0">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl w-[90%] max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-center font-black uppercase text-xs tracking-widest text-primary">Set Daily Target</DialogTitle>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Input 
                      type="number" 
                      value={tempTarget} 
                      onChange={(e) => setTempTarget(Number(e.target.value))}
                      className="w-32 text-center text-xl font-bold rounded-xl border-muted-foreground/10 h-12"
                    />
                    <span className="font-bold text-muted-foreground">ML</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Typical target: 2000 - 4000 ml</p>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdateTarget} className="w-full h-12 rounded-xl bg-primary font-black uppercase text-[11px] tracking-widest">Update Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Center Glass & Side Buttons */}
          <div className="relative flex items-center justify-center w-full mb-8">
            {/* Minus Button Left */}
            <Button 
              onClick={() => addWater(-250)}
              variant="outline" 
              size="icon" 
              className="absolute left-4 rounded-full h-12 w-12 border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </Button>

            {/* Animated Water Glass */}
            <div className="relative w-40 h-56 border-4 border-muted rounded-b-[2rem] rounded-t-lg overflow-hidden bg-muted/5 shadow-inner">
              {/* Water Fill */}
              <div 
                className="absolute bottom-0 left-0 w-full bg-primary/80 transition-all duration-1000 ease-out"
                style={{ height: `${percentage}%` }}
              >
                {/* Wave effect at the top of water */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[150%] h-8 bg-primary/80 rounded-[40%] water-wave" />
                
                {/* Bubbles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bubble bg-white/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 20}%`,
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${Math.random() * 2 + 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Percentage Indicator (Shifted to bottom, smaller font) */}
              <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-none">
                <span className={`text-xl font-black transition-colors duration-500 ${percentage > 30 ? 'text-white' : 'text-muted-foreground/40'}`}>
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Plus Button Right */}
            <Button 
              onClick={() => addWater(250)}
              variant="outline" 
              size="icon" 
              className="absolute right-4 rounded-full h-12 w-12 border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Goal Progress Text */}
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-foreground">
              {currentMl} / <span className="text-muted-foreground">{targetMl}ml</span>
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Achieve daily goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Insight Card */}
      <Card className="border-none shadow-sm bg-accent/5 border-l-4 border-l-accent overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2.5 bg-accent/10 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-black text-accent uppercase tracking-widest leading-tight">AI Analysis</h3>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight">You've hit your target 4 out of the last 7 days. Consistency is key for optimal metabolism.</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis (7 Days) */}
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Last 7 Days
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">2.4</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">L Avg</span>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 gap-1 text-[10px] font-black uppercase">
                <TrendingUp className="w-3 h-3" /> +12%
              </Badge>
              <p className="text-[8px] font-bold text-muted-foreground uppercase">Vs. last week</p>
            </div>
          </div>

          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)', radius: 8 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                >
                  {historyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.amount >= (targetMl / 1000) ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex justify-between items-center text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
            <span>Progress Trend</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Goal Met</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/30" />
                <span>Below Goal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
