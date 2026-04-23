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
  Smartphone
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
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
    let active = true;
    const initHardware = async () => {
      try {
        const { CapacitorPedometer } = await import('@capgo/capacitor-pedometer');
        const support = await CapacitorPedometer.isSupported();
        setIsSupported(support.supported);
        
        if (!support.supported) {
          setPedometerError("Step counting sensor not found on this device.");
          return;
        }

        const perm = await CapacitorPedometer.checkPermissions();
        setPermissionStatus(perm.activity === 'granted' ? 'granted' : 'prompt');

        if (perm.activity === 'granted') {
          startTracking();
        }
      } catch (e: any) {
        setPedometerError("Hardware communication error.");
      }
    };

    initHardware();

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  const requestPermissions = async () => {
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
      setPedometerError("Failed to start hardware listener.");
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

  // --- DATA VISUALIZATION ---
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const label = i === 0 ? 'Today' : format(d, 'EEE');
      
      const steps = i === 0 ? currentSteps : (history[dateStr] || 0);
      return {
        name: label,
        steps: steps,
        fullDate: dateStr,
        isToday: i === 0
      };
    }).reverse();
    return last7Days;
  }, [history, currentSteps]);

  return (
    <div className="flex flex-col h-screen bg-background animate-in fade-in duration-700">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-muted/20 px-4 py-4 flex items-center justify-between">
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
        <div className="text-center flex-1 pr-9">
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Step Tracker</h1>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Hardware Analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-24 pb-32 space-y-8 no-scrollbar">
        {/* Main Progress Sphere */}
        <div className="flex justify-center relative">
          <div className="w-64 h-64 relative flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="128"
                cy="128"
                r="115"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/10"
              />
              <circle
                cx="128"
                cy="128"
                r="115"
                fill="none"
                stroke="url(#stepsGradient)"
                strokeWidth="12"
                strokeDasharray={722.5}
                strokeDashoffset={722.5 - (722.5 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 animate-bounce">
                <Footprints className="w-6 h-6 text-primary" />
              </div>
              <span className="text-4xl font-black tracking-tighter text-foreground tabular-nums">
                {currentSteps.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] mt-1">
                Goal: {targetSteps.toLocaleString()}
              </span>
              <div className="mt-4 flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-black text-emerald-500 uppercase">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Guard */}
        {permissionStatus !== 'granted' && isSupported !== false && (
          <Card className="border-none bg-primary/5 rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">Access Required</h3>
                  <p className="text-[10px] font-medium text-muted-foreground">Permission needed for physical activity sensors.</p>
                </div>
              </div>
              <Button 
                onClick={requestPermissions}
                disabled={permissionStatus === 'checking'}
                className="w-full rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest h-11"
              >
                {permissionStatus === 'checking' ? 'Checking...' : 'Enable Activity Tracking'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {pedometerError && (
          <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-[10px] font-bold text-destructive uppercase tracking-wide">{pedometerError}</p>
          </div>
        )}

        {/* 7-Day Analysis Graph */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-primary" />
              Analysis Log
            </h3>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Past 7 Days</span>
          </div>
          
          <Card className="border-none bg-card shadow-lg rounded-[2rem] overflow-hidden pt-6">
            <CardContent className="p-4">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-muted/20 shadow-xl">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{payload[0].payload.fullDate}</p>
                              <p className="text-sm font-black text-primary">{payload[0].value.toLocaleString()} steps</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="steps" 
                      radius={[6, 6, 6, 6]}
                      barSize={24}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isToday ? 'url(#activeBar)' : '#f1f5f9'} 
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="activeBar" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Switches */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
            Preferences
          </h3>
          <Card className="border-none bg-card shadow-md rounded-[2.5rem] overflow-hidden border border-muted/10">
            <CardContent className="p-0">
               {/* Pin to Notification */}
               <button 
                onClick={() => {
                  triggerHaptic?.('medium');
                  setIsPinned(!isPinned);
                }}
                className="w-full p-5 flex items-center justify-between transition-all hover:bg-muted/5Active Documentation: active:scale-[0.98] border-b border-muted/5 group last:border-0"
               >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-3xl flex items-center justify-center transition-all",
                    isPinned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
                  )}>
                    <Pin className={cn("w-5 h-5", isPinned && "rotate-45")} />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-black text-foreground/90 block">Live Notification Pin</span>
                    <span className="text-[10px] font-medium text-muted-foreground">Stay visible in the status bar</span>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300",
                  isPinned ? "bg-primary" : "bg-muted"
                )}>
                  <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                    isPinned && "translate-x-6"
                  )} />
                </div>
               </button>

               {/* Reminders */}
               <div className="w-full p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-indigo-50 text-indigo-500">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-black text-foreground/90 block">Inactivity Alerts</span>
                    <span className="text-[10px] font-medium text-muted-foreground">Remind me to walk every hour</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase text-indigo-500 border-indigo-200">Soon</Badge>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Sync Info */}
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-muted/40 border border-muted/10 opacity-70">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">
            Syncing Directly with your Phone Accelerometer & Gyroscope Sensors for peak accuracy.
          </p>
        </div>
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
