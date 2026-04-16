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
  Trash2,
  Target
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
    const firstDate = chartData[0].formattedDate;
    const lastDate = chartData[chartData.length - 1].formattedDate;
    return firstDate === lastDate ? [firstDate] : [firstDate, lastDate];
  }, [chartData]);

  const sortedEntries = useMemo(() => {
    return [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [weightHistory]);

  const handleLogWeight = () => {
    const val = parseFloat(newWeight);
    if (isNaN(val)) return;
    onLogWeight({
      date: new Date().toISOString(),
      weight: Math.min(val, 1000)
    });
    setNewWeight("");
    setIsLogOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-4">
      <h1 className="text-2xl font-bold font-headline mb-2 px-1">Progress</h1>

      <div className="space-y-4 animate-in fade-in duration-500">
        {/* COMPACTED CURRENT WEIGHT CARD */}
        <Card className="border-none shadow-sm bg-card overflow-hidden rounded-2xl mx-1">
          <CardContent className="p-3.5 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Current Weight</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-3xl font-black text-foreground tracking-tighter">{currentWeight > 0 ? currentWeight.toFixed(1) : "---"}</h2>
                  <span className="text-xs font-bold text-muted-foreground uppercase">kg</span>
                </div>
              </div>
              {weightChange !== 0 && (
                <Badge className={cn(
                  "border-none px-2 py-0.5 gap-1 text-[9px] font-black uppercase",
                  weightChange < 0 ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                )}>
                  {weightChange < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                  {Math.abs(weightChange)}kg
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div className="text-center p-1.5 bg-muted/5 rounded-xl border border-muted/10">
                 <p className="text-[7px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Start</p>
                 <p className="font-black text-[10px]">{startWeight > 0 ? startWeight.toFixed(1) : "---"}</p>
              </div>
              <div className="text-center p-1.5 bg-muted/5 rounded-xl border border-muted/10">
                 <p className="text-[7px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Goal</p>
                 <p className="font-black text-[10px]">{targetWeight > 0 ? targetWeight.toFixed(1) : "---"}</p>
              </div>
              <div className="text-center p-1.5 bg-primary/5 rounded-xl border border-primary/10">
                 <p className="text-[7px] text-primary uppercase font-black tracking-widest mb-0.5">Left</p>
                 <p className="font-black text-[10px] text-primary">{targetWeight > 0 ? Math.abs(currentWeight - targetWeight).toFixed(1) : "---"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-muted/10 space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Progress</span>
                </div>
              </div>
              <Progress value={progressPercent} className="h-1 bg-muted" indicatorClassName="bg-[#6b85a3]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden bg-card mx-1">
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
                       contentStyle={{ 
                         borderRadius: '12px', 
                         border: '1px solid hsl(var(--border))', 
                         backgroundColor: 'hsl(var(--card))', 
                         boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                         fontSize: '10px', 
                         fontWeight: 'bold',
                         color: 'hsl(var(--foreground))'
                       }}
                       labelStyle={{ color: 'hsl(var(--foreground))' }}
                       itemStyle={{ color: 'hsl(var(--primary))' }}
                       cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, opacity: 0.5 }}
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

        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogTrigger asChild>
            <Button className="w-[calc(100%-8px)] mx-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2">
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
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setNewWeight("");
                      return;
                    }
                    const num = parseFloat(val);
                    if (num > 1000) {
                      setNewWeight("1000");
                    } else {
                      setNewWeight(val);
                    }
                  }}
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

        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> Log History
            </h3>
          </div>
          <div className="space-y-2 progress-history-list px-1">
            {sortedEntries.length === 0 ? (
              <div className="text-center py-8 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">No entries yet</p>
              </div>
            ) : (
              sortedEntries.map((entry, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-card transition-colors group">
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
                        variant="ghost" size="icon" 
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
