
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Minus, 
  ChevronLeft, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
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
  currentMl: number;
  onUpdateMl: (amount: number) => void;
  onBack: () => void;
}

export function HydrationView({ currentMl, onUpdateMl, onBack }: HydrationViewProps) {
  const [targetMl, setTargetMl] = useState(3000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetMl);

  const percentage = Math.min(Math.round((currentMl / targetMl) * 100), 100);
  const avgIntake = (historyData.reduce((acc, curr) => acc + curr.amount, 0) / historyData.length).toFixed(1);
  const goalsMet = historyData.filter(d => d.amount >= 2.5).length; 

  const handleUpdateTarget = () => {
    setTargetMl(tempTarget);
    setIsEditing(false);
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

      {/* 1. The Interactive Tracker Card */}
      <Card className="border-none shadow-md overflow-hidden bg-white relative">
        <CardContent className="p-6 flex flex-col items-center relative">
          
          {/* Top Row: Daily Progress */}
          <div className="w-full flex justify-center items-center mb-6 relative">
            <div className="text-center">
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                Daily Progress
              </h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">
                track your water intake
              </p>
            </div>
            
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                {/* No pencil icon as per user request */}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/30 text-muted-foreground absolute right-0">
                  <Plus className="w-3.5 h-3.5" />
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
          <div className="relative flex items-center justify-center w-full mb-6">
            {/* Minus Button Left */}
            <Button 
              onClick={() => onUpdateMl(-250)}
              variant="outline" 
              size="icon" 
              className="absolute left-4 rounded-full h-12 w-12 border-blue-200 text-blue-500 hover:bg-blue-50 shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </Button>

            {/* Animated Water Glass */}
            <div className="relative w-32 h-44 border-[6px] border-blue-100 rounded-b-[2.5rem] rounded-t-lg overflow-hidden bg-muted/5 shadow-inner">
              {/* Water Fill */}
              <div 
                className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-1000 ease-out"
                style={{ height: `${percentage}%` }}
              >
                {/* Wave effect at the top of water */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[150%] h-8 bg-blue-500 rounded-[40%] water-wave" />
                
                {/* Bubbles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bubble bg-white/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 20}%`,
                        width: `${Math.random() * 6 + 3}px`,
                        height: `${Math.random() * 6 + 3}px`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${Math.random() * 2 + 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Cute Face Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
                <div className="relative w-12 h-10 mb-4">
                  {/* Left Eye (Wink) */}
                  <div className="absolute left-0 top-1 w-3 h-3 border-b-2 border-r-2 border-foreground rotate-45 rounded-sm" />
                  {/* Right Eye (Dot) */}
                  <div className="absolute right-0 top-1 w-2.5 h-2.5 bg-foreground rounded-full" />
                  {/* Smile */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-3.5 border-b-2 border-foreground rounded-full" />
                </div>
              </div>

              {/* Percentage Indicator */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center pointer-events-none z-20">
                <span className={`text-[10px] font-black transition-colors duration-500 ${percentage > 15 ? 'text-white' : 'text-muted-foreground/40'}`}>
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Plus Button Right */}
            <Button 
              onClick={() => onUpdateMl(250)}
              variant="outline" 
              size="icon" 
              className="absolute right-4 rounded-full h-12 w-12 border-blue-200 text-blue-500 hover:bg-blue-50 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Goal Progress Text */}
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-foreground">
              {currentMl} <span className="text-muted-foreground text-sm">/ {targetMl}ml</span>
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Achieve daily goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Detailed History Card */}
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> Last 7 Days
            </h3>
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Liters (L)</span>
          </div>

          <div className="h-[180px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHydration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorHydration)"
                  dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Performance Summary Card (White) */}
      <Card className="border-none shadow-sm bg-white border border-muted/20">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Goal Streak</p>
              <p className="text-xs font-bold text-foreground">{goalsMet} / 7 Days Met</p>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Weekly Avg</p>
            <p className="text-xs font-black text-blue-600 uppercase">{avgIntake} Liters</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
