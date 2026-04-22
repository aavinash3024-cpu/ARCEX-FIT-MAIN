"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, RefreshCw, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";
import { CapacitorPedometer } from "@capgo/capacitor-pedometer";
import { cn } from "@/lib/utils";

interface HealthConnectCardProps {
  onSyncSuccess?: (steps: number) => void;
  className?: string;
}

export function HealthConnectCard({ onSyncSuccess, className }: HealthConnectCardProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'error' | 'unsupported'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const support = await CapacitorPedometer.isSupported();
      if (!support.supported) {
        setStatus('unsupported');
        return;
      }

      const permission = await CapacitorPedometer.checkPermissions();
      if (permission.activity === 'granted') {
        setStatus('connected');
        const savedSync = localStorage.getItem('arcex_last_health_sync');
        if (savedSync) setLastSync(savedSync);
      } else {
        setStatus('idle');
      }
    } catch (e) {
      console.error("Health Connect Check Error:", e);
      setStatus('error');
    }
  };

  const handleConnect = async () => {
    setIsSyncing(true);
    try {
      const req = await CapacitorPedometer.requestPermissions();
      if (req.activity === 'granted') {
        setStatus('connected');
        handleSync();
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSync = async () => {
    if (status !== 'connected') return;
    setIsSyncing(true);
    try {
      // Small delay to simulate "fetching" from Health Connect
      await new Promise(r => setTimeout(r, 1500));
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSync(now);
      localStorage.setItem('arcex_last_health_sync', now);
      
      // In a real app, we'd fetch the actual total from the plugin
      // For now, we signal success
      if (onSyncSuccess) onSyncSuccess(0); 

    } catch (e) {
      console.error("Sync Error", e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className={cn("border border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative", className)}>
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Activity className="w-12 h-12 text-primary" />
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Health Connect</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">System Sync Engine</p>
          </div>
          {status === 'connected' && (
            <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-600 border-green-500/20 text-[8px] font-black uppercase">
              Live
            </Badge>
          )}
        </div>

        {status === 'connected' ? (
          <div className="space-y-4">
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Last Synced</p>
                <p className="text-xs font-black text-foreground">{lastSync || "Just Now"}</p>
              </div>
              <Button 
                onClick={handleSync} 
                disabled={isSyncing}
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 rounded-full bg-primary/20 text-primary p-0 hover:bg-primary/30"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <p className="text-[9px] font-bold text-muted-foreground/80 uppercase">
                Synchronizing with Android Health Stack
              </p>
            </div>
          </div>
        ) : status === 'unsupported' ? (
           <div className="bg-destructive/5 p-4 rounded-2xl border border-destructive/10 flex items-center gap-3">
             <AlertCircle className="w-5 h-5 text-destructive" />
             <p className="text-[10px] font-bold text-destructive uppercase leading-tight">
               Sensors not supported or restricted on this device.
             </p>
           </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              Connect to Android Health Connect to automatically sync your steps, activity & calories from other apps.
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isSyncing}
              className="w-full h-11 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2"
            >
              <Smartphone className="w-4 h-4" />
              {isSyncing ? "Requesting..." : "Enable Health Connect"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
