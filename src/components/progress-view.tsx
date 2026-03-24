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
  Scale,
  Calendar,
  History,
  Trash2
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
  onDeleteWeight: (date: string) => void;
}

export function ProgressView({ goalData, weightHistory, onLogWeight, onDeleteWeight }: ProgressViewProps) {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const startWeight = goalData?.weight ? parseFloat(goalData.weight) : (weightHistory.length > 0 ? weightHistory[0].weight : 0);
  const targetWeight = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
  
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : (goalData?.weight ? parseFloat(goalData.weight) : 0);

  const progressPercent = useMemo(() => {
    if (!startWeight || !targetWeight || startWeight === targetWeight) return 0;
    
    const objective = goalData?.objective || 'loss';
    let progress = 0;
    
    if (objective === 'loss') {
      if (currentWeight >= startWeight) return 0;
      progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
    } else if (objective === 'gain') {
      if (currentWeight <= startWeight) return 0;
      progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
    } else {
      return 100;
    }
    
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [startWeight, targetWeight, currentWeight, goalData]);

  // Updated weightChange to compare currentWeight vs startWeight
  const weightChange = useMemo(() => {
    if (!startWeight || !currentWeight) return 0;
    return parseFloat((currentWeight - startWeight).toFixed(1));
  }, [currentWeight, startWeight]);

  const chartData = useMemo(() => {
    const history = [...weightHistory];
    const initialWeight = goalData?.weight ? parseFloat(goalData.weight) : 0;

    if (history.length === 0) {
      if (initialWeight > 0) {
        return [
          { date: subDays(new Date(), 1).toISOString(), weight: initialWeight, isStart: true },
          { date: new Date().toISOString(), weight: initialWeight, isStart: false }
        ].map(entry => ({
          ...entry,
          formattedDate: entry.isStart ? 'Start' : format(new Date(entry.date), 'MMM d')
        }));
      }
      return [];
    }

    if (initialWeight > 0 && !history.find(h => h.isStart)) {
      const firstLogDate = new Date(history[0].date);
      const startDateStr = subDays(firstLogDate, 2).toISOString();
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

  const chartTicks = useMemo(() => {
    if (chartData.length === 0) return [];
    if (chartData.length === 1) return [chartData[0].formattedDate];
    return [chartData[0].formattedDate, chartData[chartData.length - 1].formattedDate];
  }, [chartData]);

  const sortedEntries = useMemo(() => {
    return [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [weightHistory]);

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
    <div className="space-y-4 pb-32 pt-4">
      <h1 className="text-2xl font-bold font-headline mb-2 px-1">Progress</h1>

      <div className="space-y-4 animate-in fade-in duration-500">
        {/* 1. Current Status */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-5 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Current Status</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-3xl font-black text-foreground">{currentWeight > 0 ? currentWeight.toFixed(1) : "---"}</h2>
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

        {/* 2. Next Milestone */}
        <Card className="border-none shadow-sm bg-primary/95 text-primary-foreground overflow-hidden rounded-[1rem]">
           <CardContent className="p-3 px-4 flex items-center justify-between">
              <div className="space-y-0.5">
                 <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-70">Next Milestone</p>
                 <h4 className="font-black text-[11px] uppercase tracking-tight">Reach {targetWeight > 0 ? targetWeight.toFixed(1) : "---"} kg</h4>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <span className="text-lg font-black">{progressPercent}%</span>
                    <p className="text-[6px] font-black uppercase opacity-60">Complete</p>
                 </div>
                 <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                   <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* 3. Weight Trend Chart */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2">
                <ChartIcon className="w-3.5 h-3.5 text-primary" /> Weight Trend
              </h3>
            </div>
            <div className="h-[180px] w-full mt-2">
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
                      ticks={chartTicks}
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

        {/* 4. Log New Weight Button */}
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

        {/* 5. Log History */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
              <History className="w-3 h-3" /> Log History
            </h3>
          </div>
          <div className="space-y-2">
            {sortedEntries.length === 0 ? (
              <div className="text-center py-8 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">No entries yet</p>
              </div>
            ) : (
              sortedEntries.map((entry, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-white hover:bg-muted/5 transition-colors group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black text-foreground/80 uppercase tracking-tight">
                          {format(new Date(entry.date), 'EEEE')}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">
                          {format(new Date(entry.date), 'MMMM do, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="text-sm font-black text-foreground">
                        {entry.weight.toFixed(1)} <span className="text-[9px] text-muted-foreground">kg</span>
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground/30 hover:text-destructive transition-colors rounded-full"
                        onClick={() => onDeleteWeight(entry.date)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
