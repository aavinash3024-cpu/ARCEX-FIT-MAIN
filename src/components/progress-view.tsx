
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  TrendingDown, 
  ArrowUpRight, 
  LineChart as ChartIcon,
  ChevronRight,
  Scale
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { format, subDays } from 'date-fns';

interface ProgressViewProps {
  goalData?: any;
  weightHistory: any[];
  onLogWeight: (entry: { date: string, weight: number }) => void;
}

export function ProgressView({ goalData, weightHistory, onLogWeight }: ProgressViewProps) {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const startWeight = goalData?.weight ? parseFloat(goalData.weight) : (weightHistory.length > 0 ? weightHistory[0].weight : 0);
  const targetWeight = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
  
  // Current weight is the latest entry or fallback to goal start weight
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : (goalData?.weight ? parseFloat(goalData.weight) : 0);

  const progressPercent = useMemo(() => {
    if (!startWeight || !targetWeight || startWeight === targetWeight) return 0;
    const totalDiff = Math.abs(startWeight - targetWeight);
    const completedDiff = Math.abs(startWeight - currentWeight);
    return Math.min(100, Math.max(0, Math.round((completedDiff / totalDiff) * 100)));
  }, [startWeight, targetWeight, currentWeight]);

  const weightChange = useMemo(() => {
    if (weightHistory.length < 2) return 0;
    const latest = weightHistory[weightHistory.length - 1].weight;
    const previous = weightHistory[weightHistory.length - 2].weight;
    return parseFloat((latest - previous).toFixed(1));
  }, [weightHistory]);

  const chartData = useMemo(() => {
    const history = [...weightHistory];
    
    // Add the starting weight from goalData as the very first point if it exists
    if (goalData?.weight) {
      const initialWeight = parseFloat(goalData.weight);
      
      // Calculate a date for the starting point (e.g., the day the goal was set, or 3 days before first log)
      let startDateStr;
      if (history.length > 0) {
        const firstLogDate = new Date(history[0].date);
        startDateStr = subDays(firstLogDate, 2).toISOString();
      } else {
        startDateStr = subDays(new Date(), 4).toISOString();
      }

      // Prepend to the chart data
      history.unshift({
        date: startDateStr,
        weight: initialWeight,
        isStart: true
      });
    }

    return history.map(entry => ({
      ...entry,
      formattedDate: entry.isStart ? 'Start' : format(new Date(entry.date), 'MMM d')
    }));
  }, [weightHistory, goalData]);

  const handleLogWeight = () => {
    const val = parseFloat(newWeight);
    if (isNaN(val)) return;

    onLogWeight({
      date: new Date().toISOString(),
      weight: val
    });
    setNewWeight("");
    setIsLogOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold font-headline">Progress</h1>
      </div>

      <div className="space-y-4 animate-in fade-in duration-500">
        {/* Current Status Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Current Status</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-black text-foreground">{currentWeight > 0 ? currentWeight.toFixed(1) : "---"}</h2>
                  <span className="text-sm font-bold text-muted-foreground uppercase">kg</span>
                </div>
              </div>
              {weightChange !== 0 && (
                <Badge className={weightChange < 0 ? "bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 gap-1 text-[10px] font-black uppercase" : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 gap-1 text-[10px] font-black uppercase"}>
                  {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {Math.abs(weightChange)}kg {weightChange < 0 ? 'Loss' : 'Gain'}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/20 rounded-2xl border border-muted/30">
                 <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Start</p>
                 <p className="font-black text-sm">{startWeight > 0 ? startWeight.toFixed(1) : "---"} <span className="text-[8px] opacity-40">kg</span></p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-2xl border border-muted/30">
                 <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Goal</p>
                 <p className="font-black text-sm">{targetWeight > 0 ? targetWeight.toFixed(1) : "---"} <span className="text-[8px] opacity-40">kg</span></p>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-2xl border border-primary/10">
                 <p className="text-[9px] text-primary uppercase font-black tracking-widest mb-1">Left</p>
                 <p className="font-black text-sm text-primary">{targetWeight > 0 ? Math.abs(currentWeight - targetWeight).toFixed(1) : "---"} <span className="text-[8px] opacity-40">kg</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Weight Dialog */}
        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2">
              <Plus className="w-4 h-4" /> Log New Weight Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl w-[90%] max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center font-black uppercase text-xs tracking-widest text-primary flex items-center justify-center gap-2">
                <Scale className="w-4 h-4" /> Daily Weight Log
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">CURRENT WEIGHT (KG)</Label>
                <Input 
                  type="number" 
                  value={newWeight} 
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder={currentWeight > 0 ? currentWeight.toString() : "0.0"}
                  className="rounded-xl h-12 text-lg font-bold text-center border-muted-foreground/10 bg-muted/5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleLogWeight} className="w-full h-12 rounded-xl bg-primary font-black uppercase text-[11px] tracking-widest">Save Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Weight Trend Chart Card */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2">
                <ChartIcon className="w-3.5 h-3.5 text-primary" /> Weight Trend
              </h3>
              <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 tracking-tighter">History</span>
            </div>
            
            <div className="h-[200px] w-full mt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                    <XAxis 
                      dataKey="formattedDate" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', fontSize: '10px', fontWeight: 'bold' }}
                       itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                      animationDuration={1500}
                      dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center opacity-20 gap-2">
                  <ChartIcon className="w-8 h-8" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting log history</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Milestone Card */}
        <Card className="border-none shadow-sm bg-primary/90 text-primary-foreground overflow-hidden">
           <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Next Milestone</p>
                 <h4 className="font-black text-sm">Reach {targetWeight > 0 ? targetWeight.toFixed(1) : "---"} kg</h4>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <span className="text-2xl font-black">{progressPercent}%</span>
                    <p className="text-[8px] font-bold uppercase opacity-60">Completed</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                   <ArrowUpRight className="w-5 h-5 text-accent" />
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
