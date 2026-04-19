"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Bell, 
  Trash2, 
  Flame, 
  Trophy, 
  Zap, 
  Dumbbell, 
  HeartPulse,
  Target,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'achievement' | 'system' | 'goal';
  subtype?: '50-percent' | '100-percent' | 'pr';
  isRead: boolean;
  icon: any;
  gradient: string;
}

interface NotificationsViewProps {
  onBack: () => void;
}

export function NotificationsView({ onBack }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Peak: 100kg Bench Press',
      description: 'Congratulations! You just smashed your previous Bench Press PR. Your strength growth is in the top 5% this week.',
      time: 'Just now',
      type: 'achievement',
      subtype: 'pr',
      isRead: false,
      icon: Trophy,
      gradient: 'from-amber-400 to-orange-600'
    },
    {
      id: '2',
      title: 'Goal Master: 100% Protein',
      description: 'You have hit your daily protein target of 160g. Perfect for muscle recovery and skin cell regeneration.',
      time: '2 hours ago',
      type: 'goal',
      subtype: '100-percent',
      isRead: false,
      icon: Dumbbell,
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      id: '3',
      title: 'Goal Momentum: 50% Calories',
      description: 'You are halfway to your daily calorie budget. You have 1,100 kcal remaining for the day.',
      time: '5 hours ago',
      type: 'goal',
      subtype: '50-percent',
      isRead: true,
      icon: Flame,
      gradient: 'from-orange-400 to-rose-500'
    },
    {
      id: '4',
      title: 'Micro focus: 100% Vitamin C',
      description: 'You have achieved your daily Vitamin C goal! Great for collagen synthesis and skin firmness.',
      time: 'Yesterday',
      type: 'goal',
      subtype: '100-percent',
      isRead: true,
      icon: HeartPulse,
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      id: '5',
      title: 'Elite Premium Active',
      description: 'Your ARCEX FIT Elite subscription is active. You now have unlimited Personal AI Analysis access.',
      time: '2 days ago',
      type: 'system',
      isRead: true,
      icon: Sparkles,
      gradient: 'from-cyan-400 to-blue-600'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Notifications</h1>
        </div>
        {notifications.some(n => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-primary">
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3 px-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
            <Bell className="w-16 h-16" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">Your inbox is clear</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Card key={n.id} className={cn(
                "border-none shadow-sm transition-all overflow-hidden relative",
                !n.isRead ? "bg-card" : "bg-card/50 opacity-70"
              )}>
                <CardContent className="p-4 flex items-start gap-4">
                  {/* Liquid Glow Icon Design like Subscription Page */}
                  <div className="relative shrink-0 pt-1">
                    <div className={cn(
                      "w-11 h-11 rounded-full p-[1.5px] shadow-sm transition-transform duration-500",
                      !n.isRead ? "scale-110" : "scale-100 opacity-60"
                    )}
                    style={{ background: `linear-gradient(to bottom right, ${n.gradient.split(' ').join(', ')})` }}
                    >
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <Icon className={cn("w-5 h-5", !n.isRead ? "text-foreground" : "text-muted-foreground")} />
                      </div>
                    </div>
                    {!n.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn(
                        "text-[13px] font-black uppercase tracking-tight leading-tight",
                        !n.isRead ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {n.title}
                      </h3>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed tracking-tight">
                      {n.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">
                        {n.time}
                      </span>
                      {n.subtype === '100-percent' && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[7px] font-black uppercase h-3.5 border-none px-1.5">Achievement Met</Badge>
                      )}
                      {n.subtype === 'pr' && (
                        <Badge className="bg-amber-500/10 text-amber-600 text-[7px] font-black uppercase h-3.5 border-none px-1.5">New Record</Badge>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteNotification(n.id)}
                    className="h-8 w-8 text-muted-foreground/20 hover:text-destructive hover:bg-destructive/5 shrink-0 rounded-full mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
