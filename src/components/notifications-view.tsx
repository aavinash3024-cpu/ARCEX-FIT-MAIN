
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell, Trash2, Check, Clock, Sparkles, Target, Zap, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'goal' | 'workout' | 'nutrition' | 'system';
  isRead: boolean;
}

interface NotificationsViewProps {
  onBack: () => void;
}

export function NotificationsView({ onBack }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Daily Goal Achieved!',
      description: 'You hit your hydration target for the day. Great job staying consistent!',
      time: '2 hours ago',
      type: 'goal',
      isRead: false
    },
    {
      id: '2',
      title: 'New Workout Plan',
      description: 'Your AI coach has updated your "Leg Day" routine based on your recent progress.',
      time: '5 hours ago',
      type: 'workout',
      isRead: true
    },
    {
      id: '3',
      title: 'Macro Alert',
      description: 'You are 50g short on protein today. Consider a high-protein snack to reach your muscle-building target.',
      time: 'Yesterday',
      type: 'nutrition',
      isRead: false
    },
    {
      id: '4',
      title: 'Elite Premium Active',
      description: 'Your subscription is active. You have full access to unlimited AI meal logging.',
      time: '2 days ago',
      type: 'system',
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'goal': return Target;
      case 'workout': return Zap;
      case 'nutrition': return Utensils;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'goal': return 'text-amber-500 bg-amber-50';
      case 'workout': return 'text-primary bg-primary/10';
      case 'nutrition': return 'text-green-500 bg-green-50';
      default: return 'text-blue-500 bg-blue-50';
    }
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
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2 px-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
            <Bell className="w-16 h-16" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">Your inbox is clear</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <Card key={n.id} className={cn(
                "border-none shadow-sm transition-all overflow-hidden relative",
                !n.isRead ? "bg-card" : "bg-card/50 opacity-70"
              )}>
                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", getIconColor(n.type))}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn("text-sm font-bold truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </h3>
                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase whitespace-nowrap ml-2">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteNotification(n.id)}
                    className="h-8 w-8 text-muted-foreground/30 hover:text-destructive shrink-0 rounded-full"
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
