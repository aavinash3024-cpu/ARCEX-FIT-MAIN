"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  ChevronLeft, 
  Calendar,
  CheckCircle2,
  Footprints,
  TrendingUp,
  Bell,
  BellOff
} from "lucide-react";
import { CapacitorPedometer } from "@capgo/capacitor-pedometer";
import { LocalNotifications } from "@capacitor/local-notifications";
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
import { subDays, format } from 'date-fns';

interface StepsViewProps {
  currentSteps: number;
  history?: Record<string, number>;
  onUpdateSteps: (amount: number) => void;
  onBack: () => void;
}

export function StepsView({ currentSteps, history = {}, onUpdateSteps, onBack }: StepsViewProps) {
  const [targetSteps, setTargetSteps] = useState(10000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetSteps);
  const [isPinned, setIsPinned] = useState(false);
  const [pedometerError, setPedometerError] = useState<string | null>(null);

  // --- NATIVE HARDWARE PEDOMETER INTEGRATION ---
  React.useEffect(() => {
    let active = true;
    const initHardware = async () => {
      try {
        const support = await CapacitorPedometer.isSupported();
        if (!support.supported) {
          setPedometerError("Hardware not supported");
          return;
        }

        // Request physical activity permissions
        const permission = await CapacitorPedometer.checkPermissions();
        if (permission.activity !== 'granted') {
          const req = await CapacitorPedometer.requestPermissions();
          if (req.activity !== 'granted') return;
        }
        
        // Start Android hardware listener
        await CapacitorPedometer.start();
        
        // Real-time hook into accelerometer
        CapacitorPedometer.addListener("step", (data: any) => {
          if (data.steps && active) {
            // Push hardware steps to our Next.js global state
            onUpdateSteps(data.steps - (cachedStartSteps || data.steps));
            setCachedStartSteps(data.steps);
          }
        });
      } catch (e: any) {
        setPedometerError(e.message || "Failed to sync sensor");
      }
    };
    
    initHardware();
    
    return () => {
      active = false;
      Pedometer.removeAllListeners();
      Pedometer.stop();
    };
  }, [currentSteps, onUpdateSteps]);

  // Sync steps to Notification Bar magically
  React.useEffect(() => {
    if (isPinned) {
      updateNotification(currentSteps);
    }
  }, [currentSteps, isPinned]);

  const togglePin = async () => {
    try {
      if (!isPinned) {
        await LocalNotifications.requestPermissions();
        setIsPinned(true);
      } else {
        await LocalNotifications.cancel({ notifications: [{ id: 101 }] });
        setIsPinned(false);
      }
    } catch(e) {
      setPedometerError("Notification permission denied");
    }
  };

  const updateNotification = async (count: number) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 101,
          title: "Arcex Fit - Active Tracker",
          body: `You are at ${count.toLocaleString()} steps today! Keep it up!`,
          ongoing: true, // Prevents Android user from swiping it away natively
          smallIcon: "ic_launcher_round",
          schedule: { at: new Date(Date.now() + 100) }
        }
      ]
    });
  };
  // ---------------------------------------------

  const percentage = Math.min(Math.round((currentSteps / targetSteps) * 100), 100);

  const chartData = useMemo(() => {
    return [6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
      const date = subDays(new Date(), daysAgo);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEE');
      const val = dateKey === format(new Date(), 'yyyy-MM-dd') ? currentSteps : (history[dateKey] || 0);
      return {
        day: dayName,
        steps: val,
        dateKey
      };
    });
  }, [history, currentSteps]);

  const avgSteps = Math.round(chartData.reduce((acc, curr) => acc + curr.steps, 0) / chartData.length);
  const totalWeekSteps = chartData.reduce((acc, curr) => acc + curr.steps, 0);
  const goalsMet = chartData.filter(d => d.steps >= targetSteps).length; 

  const handleUpdateTarget = () => {
    setTargetSteps(Math.min(tempTarget, 1000000));
    setIsEditing(false);
  };

  // Circular progress constants
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Step Tracker</h1>
      </div>

      {/* 1. Today's Summary Card with Circular Bar */}
      <Card className="border-none shadow-lg overflow-hidden bg-card relative">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Daily Achievement
            </h3>
            
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/30 text-muted-foreground">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl w-[90%] max-w-[320px] p-5 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-center font-black uppercase text-xs tracking-widest text-foreground">
                    Daily Step Goal
                  </DialogTitle>
                </DialogHeader>
                <div className="py-3 flex flex-col items-center gap-3">
                  <div className="space-y-2 w-full">
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block text-center opacity-60">
                      Step Target
                    </label>
                    <Input 
                      type="number" 
                      value={tempTarget} 
                      onChange={(e) => setTempTarget(Number(e.target.value))}
                      className="w-full text-center text-xl font-black rounded-xl border-muted-foreground/10 h-12 bg-muted/5 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-center">
                  <Button onClick={handleUpdateTarget} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                    Update Target
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted/20"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                strokeLinecap="round"
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
              <span className="text-3xl font-black text-foreground">{currentSteps.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ {targetSteps.toLocaleString()}</span>
              <div className="mt-1">
                <CheckCircle2 className={`w-5 h-5 transition-colors ${currentSteps >= targetSteps ? 'text-green-500' : 'text-muted/30'}`} />
              </div>
            </div>
          </div>

          <div className="text-center w-full mb-6">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              {currentSteps >= targetSteps ? "Goal Achieved!" : `${(targetSteps - currentSteps).toLocaleString()} more to go`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-muted/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                <Footprints className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase">Estimated Burn</p>
                <p className="text-xs font-black">{(currentSteps * 0.04).toFixed(1)} Kcal</p>
              </div>
            </div>
            <div className="bg-muted/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase">Estimated Walked</p>
                <p className="text-xs font-black">{(currentSteps * 0.0007).toFixed(2)} Km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 7-Day History Card */}
      <Card className="border-none shadow-md bg-card overflow-hidden">
        <CardContent className="p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-green-500" /> Last 7 Days
            </h3>
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Daily Steps</span>
          </div>

          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid hsl(var(--border))', 
                    backgroundColor: 'hsl(var(--card))', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
                    fontSize: '10px', 
                    fontWeight: 'bold' 
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [value.toLocaleString(), "Steps"]}
                />
                <Bar 
                  dataKey="steps" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.steps >= targetSteps ? '#22c55e' : '#e2e8f0'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Unified Engine Control Center - Sleek & Minimal */}
      <Card className="border-none shadow-md bg-card/60 backdrop-blur-md overflow-hidden relative border border-white/5">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
              Engine Sync
            </h3>
            {pedometerError && (
              <span className="text-[8px] font-black text-destructive uppercase tracking-widest animate-pulse">
                Sensor Error
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Health Connect Toggle */}
            <div 
              onClick={async () => {
                try {
                  const req = await CapacitorPedometer.requestPermissions();
                  if (req.activity === 'granted') {
                    await CapacitorPedometer.start();
                    toast({ title: "Health Sync Active", description: "Your steps are now syncing from high-res sensors." });
                  }
                } catch(e) {}
              }}
              className="bg-muted/10 hover:bg-muted/20 transition-all p-3 rounded-2xl flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-foreground uppercase tracking-tight">Sync</p>
                  <p className="text-[7px] font-bold text-muted-foreground uppercase opacity-60">Health</p>
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            </div>

            {/* Notification Toggle */}
            <div 
              onClick={togglePin}
              className={`transition-all p-3 rounded-2xl flex items-center justify-between cursor-pointer group ${isPinned ? 'bg-primary/10 border border-primary/10' : 'bg-muted/10'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-inner transition-colors ${isPinned ? 'bg-primary text-white' : 'bg-background'}`}>
                  {isPinned ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-foreground uppercase tracking-tight">Pin</p>
                  <p className="text-[7px] font-bold text-muted-foreground uppercase opacity-60">Bar</p>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${isPinned ? 'bg-primary shadow-[0_0_8px_#3b82f6]' : 'bg-muted-foreground/30'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
