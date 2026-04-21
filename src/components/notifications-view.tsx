'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  CheckCircle2,
  TrendingUp,
  Activity,
  History,
  Clock,
  Check,
  X,
  Shield,
  Star,
  Sun,
  Droplets,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { subHours, subDays } from 'date-fns';

// Icon Map to handle string persistence
const ICON_MAP: Record<string, any> = {
  trophy: Trophy,
  target: Target,
  flame: Flame,
  zap: Zap,
  sparkles: Sparkles,
  bell: Bell,
  activity: Activity,
  'trending-up': TrendingUp,
  'heart-pulse': HeartPulse,
  dumbbell: Dumbbell,
  check: CheckCircle2,
  shield: Shield,
  star: Star,
  sun: Sun,
  droplets: Droplets,
};

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  type: 'achievement' | 'system' | 'goal';
  subtype?: '50-percent' | '100-percent' | 'pr';
  isRead: boolean;
  icon: string;
  gradient: string;
}

interface NotificationsViewProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onBack: () => void;
}

export function NotificationsView({
  notifications,
  setNotifications,
  onBack,
}: NotificationsViewProps) {
  const [autoDelete, setAutoDelete] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pulseflow_notif_autodelete') !== 'false';
    }
    return true;
  });
  const [autoDeletePeriod, setAutoDeletePeriod] = useState<'24h' | '1w'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('pulseflow_notif_period') as any) || '24h';
    }
    return '24h';
  });

  useEffect(() => {
    localStorage.setItem('pulseflow_notif_autodelete', autoDelete.toString());
    localStorage.setItem('pulseflow_notif_period', autoDeletePeriod);
  }, [autoDelete, autoDeletePeriod]);

  const displayedNotifications = useMemo(() => {
    if (!autoDelete) {
      return notifications;
    }
    const cutoff =
      autoDeletePeriod === '24h'
        ? subHours(new Date(), 24).getTime()
        : subDays(new Date(), 7).getTime();

    return notifications.filter((n) => (n.timestamp || 0) > cutoff);
  }, [notifications, autoDelete, autoDeletePeriod]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  return (
    <div className="space-y-4 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1 flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-muted/50 w-9 h-9"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-headline">Notifications</h1>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-muted/5 rounded-2xl mx-1">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-black uppercase tracking-tight text-foreground/80 leading-none">
                  Auto-Cleanup
                </h4>
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                  {autoDelete
                    ? autoDeletePeriod === '24h'
                      ? 'Current: 24 Hours'
                      : 'Current: 1 Week'
                    : 'Status: Disabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={autoDelete}
              onCheckedChange={setAutoDelete}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {autoDelete && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAutoDeletePeriod('24h')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border',
                  autoDeletePeriod === '24h'
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-card border-muted/20 text-muted-foreground'
                )}
              >
                24 Hours
              </button>
              <button
                onClick={() => setAutoDeletePeriod('1w')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border',
                  autoDeletePeriod === '1w'
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-card border-muted/20 text-muted-foreground'
                )}
              >
                1 Week
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="px-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllRead}
          className="text-[10px] font-black uppercase tracking-widest text-[#08A391] hover:bg-[#08A391]/5 p-0 h-auto"
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3 px-1">
        {displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
            <Bell className="w-16 h-16" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">
              Your inbox is clear
            </p>
          </div>
        ) : (
          displayedNotifications.map((n) => {
            const IconComponent = ICON_MAP[n.icon] || Bell;
            return (
              <Card
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={cn(
                  'border-none shadow-sm transition-all overflow-hidden relative cursor-pointer active:scale-[0.99]',
                  !n.isRead ? 'bg-card' : 'bg-card/50 opacity-70'
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="relative shrink-0 pt-1">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full p-[1.5px] shadow-sm transition-transform duration-500',
                        !n.isRead ? 'scale-110' : 'scale-100 opacity-60'
                      )}
                      style={{ background: n.gradient }}
                    >
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <IconComponent
                          className={cn(
                            'w-4 h-4',
                            !n.isRead
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        />
                      </div>
                    </div>
                    {!n.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={cn(
                          'text-[13px] font-black uppercase tracking-tight leading-tight',
                          !n.isRead
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
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
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 text-[7px] font-black uppercase h-3.5 border-none px-1.5 rounded-sm"
                        >
                          Goal Mastered
                        </Badge>
                      )}
                      {n.subtype === '50-percent' && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/10 text-blue-600 text-[7px] font-black uppercase h-3.5 border-none px-1.5 rounded-sm"
                        >
                          50% Achieved
                        </Badge>
                      )}
                      {n.subtype === 'pr' && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-600 text-[7px] font-black uppercase h-3.5 border-none px-1.5 rounded-sm"
                        >
                          New Record
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
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
