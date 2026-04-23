"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Footprints, 
  TrendingUp, 
  Target, 
  Settings2,
  Calendar,
  Zap,
  Info,
  ShieldCheck,
  Pin,
  BellRing,
  AlertCircle,
  Smartphone,
  Activity
} from "lucide-react";
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { format, subDays, isSameDay, parseISO } from 'date-fns';

interface StepsViewProps {
  currentSteps: number;
  onUpdateSteps: (amount: number) => void;
  targetSteps: number;
  onBack: () => void;
  history?: Record<string, number>;
  triggerHaptic?: (type?: 'light' | 'medium' | 'success' | 'warning') => void;
}

export function StepsView({ 
  currentSteps, 
  onUpdateSteps, 
  targetSteps, 
  onBack,
  history = {},
  triggerHaptic
}: StepsViewProps) {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [pedometerError, setPedometerError] = useState<string | null>(null);
  const initialStepsRef = useRef<number | null>(null);

  const progress = Math.min(100, Math.round((currentSteps / targetSteps) * 100));

  // --- HARDWARE INITIALIZATION ---
  useEffect(() => {
    let timeoutId: any;
    const initHardware = async () => {
      // Safety timeout to prevent infinite "Checking..."
      timeoutId = setTimeout(() => {
        if (permissionStatus === 'checking') {
          setPermissionStatus('prompt');
          setIsSupported(false);
          setPedometerError("Connection timed out. Using manual tracking.");
        }
      }, 4000);

      try {
        const { CapacitorPedometer } = await import('@capgo/capacitor-pedometer');
        const support = await CapacitorPedometer.isSupported();
        setIsSupported(support.supported);
        
        if (!support.supported) {
          clearTimeout(timeoutId);
          setPermissionStatus('prompt');
          setPedometerError("Step counting sensor not found on this device.");
          return;
        }

        const perm = await CapacitorPedometer.checkPermissions();
        setPermissionStatus(perm.activity === 'granted' ? 'granted' : 'prompt');

        if (perm.activity === 'granted') {
          startTracking();
        }
        clearTimeout(timeoutId);
      } catch (e: any) {
        clearTimeout(timeoutId);
        setPermissionStatus('prompt');
        setPedometerError("Sensors unreachable. Using manual tracking.");
      }
    };

    initHardware();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      cleanup();
    };
  }, []);

  const requestPermissions = async () => {
    setPermissionStatus('checking');
    try {
      const { CapacitorPedometer } = await import('@capgo/capacitor-pedometer');
      const res = await CapacitorPedometer.requestPermissions();
      if (res.activity === 'granted') {
        setPermissionStatus('granted');
        startTracking();
      } else {
        setPermissionStatus('denied');
      }
    } catch (e) {
      setPermissionStatus('denied');
    }
  };

  const startTracking = async () => {
    try {
      const { CapacitorPedometer } = await import('@capgo/capacitor-pedometer');
      await CapacitorPedometer.start();
      CapacitorPedometer.removeAllListeners();
      CapacitorPedometer.addListener('step', (data: any) => {
        if (data.steps) {
          if (initialStepsRef.current === null) {
            initialStepsRef.current = data.steps;
            return;
          }
          const diff = data.steps - initialStepsRef.current;
          if (diff > 0) {
            onUpdateSteps(diff);
          }
        }
      });
    } catch (e) {
      setPedometerError("Background sensor failed.");
    }
  };

  const cleanup = async () => {
    try {
       const { CapacitorPedometer } = await import('@capgo/capacitor-pedometer');
       await CapacitorPedometer.stop();
       await CapacitorPedometer.removeAllListeners();
    } catch (e) {}
  };

  // --- NOTIFICATION PINNING ---
  useEffect(() => {
    if (isPinned && currentSteps >= 0) {
      updatePinnedNotification();
    } else if (!isPinned) {
      cancelNotification();
    }
  }, [isPinned, currentSteps]);

  const updatePinnedNotification = async () => {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [{
          id: 777,
          title: "Arcex Fit • Live Track",
          body: `👟 ${currentSteps.toLocaleString()} steps • ${progress}% of daily goal`,
          ongoing: true,
          autoCancel: false,
          smallIcon: 'res://ic_stat_name', // Ensure these assets exist in Android res
          extra: { steps: currentSteps }
        }]
      });
    } catch (e) { console.error("Notification failed", e); }
  };

  const cancelNotification = async () => {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.cancel({ notifications: [{ id: 777 }] });
    } catch (e) {}
  };

  // --- DATA VISUALIZATI  const stats = useMemo(() => {
    const vals = Object.values(history);
    const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : currentSteps;
    const streak = vals.filter(v => v >= targetSteps).length + (currentSteps >= targetSteps ? 1 : 0);
    const calories = Math.round(currentSteps * 0.04);
    return { avg, streak, calories };
  }, [history, currentSteps, targetSteps]);

  // Transform history record for charts
  const chartData = useMemo(() => {
    return [6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
      const d = subDays(new Date(), daysAgo);
      const dateKey = format(d, 'yyyy-MM-dd');
      const label = format(d, 'EEE');
      const val = dateKey === format(new Date(), 'yyyy-MM-dd') ? currentSteps : (history[dateKey] || 0);
      return {
        day: label,
        steps: val,
        fullDate: dateKey
      };
    });
  }, [history, currentSteps]);

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            triggerHaptic?.('light');
            onBack();
          }}
          className="rounded-full bg-muted/50 w-9 h-9"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Step Tracker</h1>
      </div>

      {/* Main Stats Card (Hydration Style) */}
      <Card className="border-none shadow-md overflow-hidden bg-card relative">
        <CardContent className="p-6 flex flex-col items-center relative">
          <div className="w-full flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Daily Progress</h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">Hardware Sense</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-black text-primary uppercase">Active</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                <circle
                  cx="80" cy="80" r="70" fill="none" stroke="url(#stepsGrad)" strokeWidth="8"
                  strokeDasharray={440} strokeDashoffset={440 - (440 * progress) / 100}
                  strokeLinecap="round" className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="stepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <div className="p-2 bg-primary/10 rounded-full mb-1">
                  <Footprints className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-black tabular-nums tracking-tighter">{currentSteps.toLocaleString()}</span>
                <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">STEPS</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
             <div className="flex justify-between items-end">
               <div className="space-y-0.5">
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Goal Status</p>
                 <p className="text-sm font-black text-foreground">
                   {Math.max(0, targetSteps - currentSteps).toLocaleString()} <span className="text-[10px] text-muted-foreground font-bold">LEFT</span>
                 </p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Daily Target</p>
                 <p className="text-sm font-black text-foreground/60">{targetSteps.toLocaleString()}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
               <button 
                onClick={() => { triggerHaptic?.('light'); onUpdateSteps(500); }}
                className="flex-1 h-10 border border-muted/20 bg-muted/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/10 active:scale-[0.98] transition-all"
               >
                 +500 Manual
               </button>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission/Sync Status (If needed) */}
      {permissionStatus !== 'granted' && (
        <Card className="border-none bg-primary/5 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-tight">Permissions</h3>
                <p className="text-[9px] font-medium text-muted-foreground leading-none">Sensor access needed</p>
              </div>
            </div>
            <Button 
              onClick={requestPermissions}
              disabled={permissionStatus === 'checking'}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 h-9 font-black uppercase text-[8px] tracking-widest"
            >
              {permissionStatus === 'checking' ? 'Connecting...' : 'Allow Access'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards (Hydration Style) */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none bg-card shadow-sm border border-muted/5">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Streak</p>
              <p className="text-sm font-black text-foreground">{stats.streak} / 7 Days</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card shadow-sm border border-muted/5">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Avg Steps</p>
              <p className="text-sm font-black text-foreground">{stats.avg.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Analysis Card (AreaChart Style) */}
      <Card className="border-none shadow-md bg-card overflow-hidden">
        <CardContent className="p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Last 7 Days
            </h3>
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 tabular-nums">Weekly Activity</span>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="stepsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#stepsColor)" dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Hardware Options</h3>
        <Card className="border-none bg-card shadow-sm border border-muted/10 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
             <button 
              onClick={() => { triggerHaptic?.('medium'); setIsPinned(!isPinned); }}
              className="w-full p-5 flex items-center justify-between group active:bg-muted/5 transition-all"
             >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", isPinned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40")}>
                    <Pin className={cn("w-4 h-4", isPinned && "rotate-45")} />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-foreground/90 block">Background Sync</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Status Bar Notification</span>
                  </div>
                </div>
                <div className={cn("w-10 h-5 rounded-full relative transition-all duration-300", isPinned ? "bg-primary" : "bg-muted")}>
                  <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm", isPinned && "translate-x-5")} />
                </div>
             </button>
          </CardContent>
        </Card>
      </section>

      {/* Sensor Info */}
      <div className="flex items-start gap-3 p-4 rounded-3xl bg-muted/20 border border-muted/5 opacity-60">
        <Smartphone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight leading-relaxed">
          {pedometerError || "Sensors operating normally. Steps are analyzed using onboard hardware gait analysis for peak efficiency."}
        </p>
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={cn(
      "px-2 py-0.5 rounded-full",
      variant === 'outline' ? "border" : "bg-muted",
      className
    )}>
      {children}
    </div>
  );
}
